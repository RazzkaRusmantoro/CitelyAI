import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { getUser } from '@/app/auth/getUser';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const data = await request.json();


    if (!data.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let filesCount = 0;
    let filesProCount = 0;
    let sourcesSaved = 0;
    let citationsGenerated = 0;
    let recentFiles: any[] = [];

    console.log("We're here ")
    // Count from files table
    const { count: filesCountData, error: filesError } = await supabase
      .from('files')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', data.user.id);

    console.log(data.user.id)
    
    if (!filesError && filesCountData) {
      filesCount = filesCountData;
    }

    console.log("Data:", filesCountData)
    
    // Count from files_pro table
    const { count: filesProCountData, error: filesProError } = await supabase
      .from('files_pro')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', data.user.id);
    
    if (!filesProError && filesProCountData) {
      filesProCount = filesProCountData;
    }
    
    // Get references from bibliography table
    const { data: bibliographyData, error: bibliographyError } = await supabase
      .from('bibliography')
      .select('references')
      .eq('user_id', data.user.id)
      .single();
    
    if (!bibliographyError && bibliographyData && bibliographyData.references) {
      try {
        const references = bibliographyData.references;
        if (Array.isArray(references)) {
          sourcesSaved = references.length;
        }
        else if (typeof references === 'object' && references !== null) {
          sourcesSaved = Object.keys(references).length;
        }
      } catch (error) {
        console.error("Error parsing references:", error);
      }
    }
    
    // Get citations from files table
    const { data: filesData, error: filesCitationsError } = await supabase
      .from('files')
      .select('citations')
      .eq('user_id', data.user.id);
    
    if (!filesCitationsError && filesData) {
      filesData.forEach(file => {
        if (file.citations) {
          try {
            const citations = file.citations;
            if (Array.isArray(citations)) {
              citationsGenerated += citations.length;
            }
            else if (typeof citations === 'object' && citations !== null) {
              citationsGenerated += Object.keys(citations).length;
            }
          } catch (error) {
            console.error("Error parsing citations from files table:", error);
          }
        }
      });
    }
    
    // Get citations from files_pro table
    const { data: filesProData, error: filesProCitationsError } = await supabase
      .from('files_pro')
      .select('citations')
      .eq('user_id', data.user.id);
    
    if (!filesProCitationsError && filesProData) {
      filesProData.forEach(file => {
        if (file.citations) {
          try {
            const citations = file.citations;
            if (Array.isArray(citations)) {
              citationsGenerated += citations.length;
            }
            else if (typeof citations === 'object' && citations !== null) {
              citationsGenerated += Object.keys(citations).length;
            }
          } catch (error) {
            console.error("Error parsing citations from files_pro table:", error);
          }
        }
      });
    }
    
    // Get recent files
    const { data: recentFilesData, error: recentFilesError } = await supabase
      .from('files')
      .select('id, filename, opened_at, file_url')
      .eq('user_id', data.user.id)
      .order('opened_at', { ascending: false })
      .limit(3);
    
    if (!recentFilesError && recentFilesData) {
      recentFiles = recentFilesData;
    }

    const totalProjects = filesCount + filesProCount;

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        citationsGenerated,
        sourcesSaved,
        recentFiles
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}