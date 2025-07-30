from flask import Blueprint, request, jsonify
from sentence_transformers import SentenceTransformer, util
from keybert import KeyBERT
import spacy
import requests
import torch
from openai import OpenAI
import json
import os

from pathlib import Path
from dotenv import load_dotenv


cite_bp = Blueprint('cite', __name__)


# Initialize models once
nlp = spacy.load("en_core_web_sm")
kw_model = KeyBERT('all-MiniLM-L6-v2')
sbert_model = SentenceTransformer('all-MiniLM-L6-v2').to('cuda' if torch.cuda.is_available() else 'cpu')

OPENAI_KEY = os.environ.get("OPENAI_KEY")
client = OpenAI(api_key=OPENAI_KEY)

SEMANTIC_KEY = os.environ.get("SEMANTIC_SCHOLAR_API_KEY")


env_path = Path(__file__).resolve().parents[3] / '.env.local'
load_dotenv(dotenv_path=env_path)

OPENAI_KEY = os.environ.get("GEMINI_API_KEY")

@cite_bp.route('/cite-openai', methods=['POST'])
def cite():
    try:
        print("HELLOOOO THIS API HAS BEEN CALLED")
        data = request.json
        sentences = data.get('sentences', [])

        print("sentences retrieved :):", sentences)
        
        if not sentences:
            return jsonify({"error": "No sentences provided"}), 400

        # 1. Extract keywords
        combined_text = ' '.join(s['text'] for s in sentences)
        search_terms = [kw[0] for kw in 
            kw_model.extract_keywords(
                combined_text,
                keyphrase_ngram_range=(1, 3),
                stop_words='english',
                top_n=5
            )
        ]
        print(f"🔍 Search Keywords: {search_terms}")

        # 2. Fetch papers from Semantic Scholar
        papers = []
        for term in search_terms:
            response = requests.get(
                "https://api.semanticscholar.org/graph/v1/paper/search",
                params={"query": term, "limit": 3, "fields": "title,abstract,authors,year"},
                headers={"x-api-key": SEMANTIC_KEY}
            )
            if response.ok:
                papers.extend(p for p in response.json().get('data', []) if p.get('abstract'))

        print("These are the papers:", papers)

        # 3. Match sentences to papers
        matched_pairs = []
        essay_embeddings = sbert_model.encode(
            [s['text'] for s in sentences],
            convert_to_tensor=True
        )
        
        for paper in papers:
            abstract_sents = [sent.text.strip() for sent in nlp(paper["abstract"]).sents]
            abstract_embeddings = sbert_model.encode(abstract_sents, convert_to_tensor=True)
            similarities = util.cos_sim(essay_embeddings, abstract_embeddings)
            
            for i, score in enumerate(torch.max(similarities, dim=1).values):
                if score > 0.5:  # Threshold
                    matched_pairs.append({
                        "essay_sentence": sentences[i]['text'],
                        "paper_title": paper["title"],
                        "abstract_sentence": abstract_sents[torch.argmax(similarities[i])],
                        "score": score.item(),
                        "paragraph_index": sentences[i]['paragraph_index']
                    })

        # 4. Get citations from OpenAI
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{
                "role": "system",
                "content": """Analyze essay-abstract pairs and return JSON with:
                - original_sentence: Original sentence
                - rewritten_sentence: Original + citation
                - citation: (Author, Year) or null
                - needs_citation: boolean
                Format: {"analysis": [...]}"""
            }, {
                "role": "user",
                "content": json.dumps({"pairs": matched_pairs})
            }],
            response_format={"type": "json_object"}
        )
        
        results = json.loads(response.choices[0].message.content)
        
        # 5. Prepare output
        output = []
        for item in results.get('analysis', []):
            if item.get('needs_citation'):
                output.append({
                    "original": item['essay_sentence'],
                    "rewritten": item['rewritten_sentence'],
                    "paragraph_index": item.get('paragraph_index')
                })
        
        return jsonify({"results": output})

    except Exception as e:
        return jsonify({"error": str(e)}), 500