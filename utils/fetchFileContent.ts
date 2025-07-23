import { createClient } from '@/utils/supabase/client';

export async function fetchFileContent(fileId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
    .from('files')
    .select('content, filename')
    .eq('id', fileId)
    .single();

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        throw new Error('File not found');
    }

    return {
        content: data.content,
        fileName: data.filename
    };

}