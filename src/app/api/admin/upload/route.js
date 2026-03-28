import { requireAdmin } from '@/lib/server-auth';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    // Authenticate admin
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient } = auth;

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'general';

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ 
        error: 'Invalid file type', 
        details: 'Only JPEG, PNG, GIF, and WebP images are allowed' 
      }, { status: 400 });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return Response.json({ 
        error: 'File too large', 
        details: 'Maximum file size is 10MB' 
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${random}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('email-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return Response.json({ 
        error: 'Upload failed', 
        details: uploadError.message 
      }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('email-images')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    return Response.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return Response.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}
