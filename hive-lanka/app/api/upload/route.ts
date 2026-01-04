import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('📤 Uploading file:', file.name);

    // 1. Get Azure credentials
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    // Fixed the typo here and set default container
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'hive-lanka-products';

    if (!connectionString) {
      return NextResponse.json({ error: 'Azure storage not configured' }, { status: 500 });
    }

    // 2. Connect to Container
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // 3. Create unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExtension = file.name.split('.').pop();
    const blobName = `poster-${timestamp}-${randomString}.${fileExtension}`;

    // 4. Upload
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: file.type },
    });

    // 5. Return URL
    const imageUrl = blockBlobClient.url;
    console.log('✅ Upload successful:', imageUrl);

    return NextResponse.json({ success: true, url: imageUrl });

  } catch (error: any) {
    console.error('❌ Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}