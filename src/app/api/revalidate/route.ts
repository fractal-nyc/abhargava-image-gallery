import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { path, secret } = await request.json();
    
    // In a real implementation, you would check the secret against an environment variable
    // if (secret !== process.env.REVALIDATION_SECRET) {
    //   return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    // }
    
    if (!path) {
      return NextResponse.json(
        { message: "Path parameter is required" },
        { status: 400 }
      );
    }
    
    // Revalidate the path
    revalidatePath(path);
    
    return NextResponse.json({ revalidated: true, path });
  } catch (error) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 }
    );
  }
} 