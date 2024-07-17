import { NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { MongoClient } from 'mongodb';
import { auth } from '../../../lib/auth';
import streamifier from 'streamifier';

const mongodbUri = process.env.MONGODB_URI || '';
const containerName = process.env.CONTAINER_NAME || '';
const sasToken = process.env.SAS_TOKEN || '';
const accountName = process.env.ACCOUNT_NAME || '';

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net/?${sasToken}`
);
const containerClient = blobServiceClient.getContainerClient(containerName);

const client = new MongoClient(mongodbUri);

async function connectMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

async function extractMetadata(request: any) {
  const formData = await request.formData();
  const images = formData.getAll('images');
  const file = images[0];
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const contentType = file.type;
  const fileType = contentType.split('/')[1];
  const caption = 'No caption';
  const fileName = file.name || `image-${Date.now()}.${fileType}`;

  console.log('Extracted Metadata:', { fileName, caption, fileType, bufferLength: buffer.length });

  return { fileName, caption, fileType, buffer };
}

async function uploadImageStream(blobName: string, buffer: Buffer) {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const dataStream = streamifier.createReadStream(buffer);

  console.log('Uploading Image Stream:', { blobName, bufferLength: buffer.length });

  await blockBlobClient.uploadStream(dataStream, buffer.length, 5);

  console.log('Upload Completed:', blockBlobClient.url);

  return blockBlobClient.url;
}

async function storeMetadata(filename: string, caption: string, imageUrl: string, fileType: string) {
  try {
    await connectMongoDB();

    const collection = client.db('test').collection('images');
    await collection.insertOne({ filename, caption, fileType, imageUrl });

    console.log('Metadata Stored:', { filename, caption, imageUrl, fileType });
  } catch (error) {
    console.error('Failed to store metadata:', error);
    throw error;
  }
}

export async function POST(request: any) {
  const session = await auth();
  const userId = session?.user?.id;
  const adminId = ['6681baf3edaf2e8a771432a2'];
  if (typeof userId !== 'string') {
    return NextResponse.json({ message: "You are not authorized to view this page" });
    }
  
  if (!adminId.includes(userId)) {
    return NextResponse.json({ message: "You are not authorized to view this page" });
  } 

  try {
    const { fileName, caption, fileType, buffer } = await extractMetadata(request);

    const imageUrl = await uploadImageStream(fileName, buffer);

    await storeMetadata(fileName, caption, imageUrl, fileType);

    return NextResponse.json({ message: 'Image uploaded successfully', fileName, imageUrl, fileType }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Image upload failed' }, { status: 500 });
  }
}
