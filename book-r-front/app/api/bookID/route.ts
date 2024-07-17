import { NextResponse } from "next/server";
import mongooseConnect from "../../../lib/mongoose";
import NewBook from "../../../models/newbook";
import { auth } from "../../../lib/auth"


export async function GET(request: any) {
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