import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/app/auth/getUser';
import { BibliographyTable } from '@/components/bibliography-table';

interface Reference {
  id: string;
  title: string;
  abstract?: string;
  authors?: { name: string }[];
  year?: number;
  url?: string;
}

export default async function BibliographyDashboard() {
  const supabase = await createClient();
  const user = await getUser();
  const userId = user?.id;

  let references: Reference[] = [];
  
  if (userId) {
    const { data: bibliography } = await supabase
      .from('bibliography')
      .select('references')
      .eq('user_id', userId)
      .single();

    references = bibliography?.references || [];
  }

  return (
    <main className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
              Bibliography Manager
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-300">
              Save and Record References for Future Use
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg dark:border-gray-700">
            {references.length > 0 || !userId ? (
              <BibliographyTable 
                initialReferences={references} 
                userId={userId!} 
              />
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Your bibliography is empty. Start by adding some references!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}