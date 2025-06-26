import { NextRequest, NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";

// POST /api/upload/image - Upload image to ImageKit
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit
    const response = await imagekit.upload({
      file: buffer,
      fileName: fileName || file.name,
      folder: folder,
      useUniqueFileName: true,
      tags: ["product", "admin-upload"],
    });

    return NextResponse.json({
      fileId: response.fileId,
      name: response.name,
      url: response.url,
      thumbnailUrl: response.thumbnailUrl,
      filePath: response.filePath,
      size: response.size,
      fileType: response.fileType,
    });
  } catch (error) {
    console.error("Error uploading to ImageKit:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

// DELETE /api/upload/image - Delete image from ImageKit
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }

    await imagekit.deleteFile(fileId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting from ImageKit:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
