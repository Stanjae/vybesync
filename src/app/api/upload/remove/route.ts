import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(req: Request) {
  try {
    const {public_id} = await req.json();

    if (!public_id) {
      return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
    }
    console.log(public_id);
    // Delete from Cloudinary
    cloudinary.uploader.destroy(`${public_id}`,{resource_type:"video"}).then((opp)=>console.log('lady: ',opp));


    return NextResponse.json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
