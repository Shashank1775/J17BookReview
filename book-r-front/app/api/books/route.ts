import { NextApiResponse } from 'next';
import mongooseConnect from "../../../lib/mongoose";
import NewBook from "../../../models/newbook";
import { auth } from "../../../lib/auth";
import { NextResponse } from 'next/server';

export async function GET(request: any) {
    const session = await auth();
    const userId = session?.user?.id;
    const adminId = ['6681baf3edaf2e8a771432a2'];

    // Ensure userId is a string
    if (typeof userId !== 'string') {
        return NextResponse.json({ message: "You are not authorized to view this page" });
    }

    if (!adminId.includes(userId)) {
        return NextResponse.json({ message: "You are not authorized to view this page" });
    }

    await mongooseConnect();

    // Parse URL to get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        if (id) {
            const bookDocument = await NewBook.findById(id);
            if (!bookDocument) {
                return NextResponse.json({ message: "Book not found" }, { status: 404 });
            }
            return NextResponse.json(bookDocument);
        }

        const bookDocuments = await NewBook.find();
        return NextResponse.json(bookDocuments);
    } catch (error) {
        console.error("GET request error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
