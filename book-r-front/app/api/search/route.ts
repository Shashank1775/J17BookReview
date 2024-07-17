// pages/api/search.js
import { NextResponse } from 'next/server';
import mongooseConnect from "../../../lib/mongoose";
import NewBook from "../../../models/newbook";

export async function GET(request: any) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const searchBy = searchParams.get('searchBy');

    await mongooseConnect();

    let bookDocuments;
    if (searchBy === "_id") {
        bookDocuments = await NewBook.findById(search);
    } else if (searchBy === "title") {
        bookDocuments = await NewBook.find({ title: search });
    } else if (searchBy === "author") {
        bookDocuments = await NewBook.find({ author: search });
    } else if (searchBy === "year") {
        bookDocuments = await NewBook.find({ year: search });
    } else if (searchBy === "genre") {
        bookDocuments = await NewBook.find({ genre: search });
    } else {
        return NextResponse.json({ message: "Invalid searchBy parameter" }, { status: 400 });
    }

    if (!bookDocuments || (Array.isArray(bookDocuments) && bookDocuments.length === 0)) {
        return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(bookDocuments);
}
