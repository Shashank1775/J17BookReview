import { NextApiResponse } from 'next';
import mongooseConnect from "../../../lib/mongoose";
import Genre from "../../../models/newGenre";
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

    try {
        const genreDocument = await Genre.find();
        return NextResponse.json(genreDocument);
    } catch (error) {
        console.error("GET request error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function POST(request: any) {
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

    try {
        await mongooseConnect(); // Ensure the database connection is ready

        const { name, parent } = await request.json(); // Parse the request body

        // Create a new genre document
        const genreDocument = await Genre.create({
            name,
            parent,
        });
        console.log("Genre created successfully:", genreDocument);
        return NextResponse.json({ genreDocument });
    } catch (error) {
        console.error("POST request error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(request: any) {
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

    try {
        await mongooseConnect(); // Ensure the database connection is ready

        const { id } = await request.json(); // Parse the request body
        await Genre.deleteOne({ _id: id });

        return NextResponse.json({ message: "Genre deleted successfully" });
    } catch (error) {
        console.error("DELETE request error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
