import { NextResponse } from "next/server";
import mongooseConnect from "../../../lib/mongoose";
import NewList from "../../../models/newlist";
import { auth } from "../../../lib/auth";

import NewBook from "../../../models/newbook"; // Import the NewBook model

export async function GET(request: any) { // Add type annotation for the request parameter
    const session = await auth();
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.user?.id; // Add null check for session and optional chaining for session.user

    await mongooseConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        const bookDocument = await NewList.findById(id);
        if (!bookDocument) {
            return NextResponse.json({ message: "List not found" }, { status: 404 });
        }
        return NextResponse.json(bookDocument);
    }

    try {
        const listDocuments = await NewList.find({ creatorId: userId }).populate('books');
        return NextResponse.json(listDocuments);
    } catch (error) {
        console.error("GET request error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function POST(request: any) {
    const session = await auth();
    const userId = session?.user?.id;
    try {
        await mongooseConnect(); // Ensure the database connection is ready

        const { name, studyInterval, tags, books, priority, deadline, color, description } = await request.json(); // Parse the request body

        // Create a new list document
        const listDocument = await NewList.create({
            creatorId: userId,
            name,
            studyInterval,
            tags,
            books,
            priority,
            deadline,
            color,
            description
        });
        console.log("List created successfully:", listDocument);
        return NextResponse.json({ listDocument });
    } catch (error) {
        console.error("POST request error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function PUT(request: any) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session?.user?.id;
    const { name, studyInterval, tags, books, priority, deadline, color, description, _id} = await request.json();

    if (!_id) {
      return NextResponse.json({ message: "ID is required", _id}, { status: 400 });
    }

    await mongooseConnect();
    // Perform the update operation

    const result: any = await NewList.updateOne(
      { _id, creatorId: userId }, // Ensure the user is only updating their own list
      { name, studyInterval, tags, books, priority, deadline, color, description }
    );

    if (result.nModified === 0) {
      return NextResponse.json({ message: "No document was updated" }, { status: 400 });
    }

    return NextResponse.json({ message: "List updated successfully", result });

  } catch (error) {
    console.error("Error updating list:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// routes/api/lists/[id].js (or similar)
export async function DELETE(request: any) {
  try {
    const session = await auth(); // Assuming auth() handles session authentication
    const userId = session?.user?.id;

    // Extract the list ID from request parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await mongooseConnect(); // Ensure the database connection is ready

    // Perform the deletion logic (example: deleting from database)
    await NewList.findByIdAndDelete(id); // Example using Mongoose, adjust as per your database library

    // Respond with a success message or deleted resource ID
    return NextResponse.json({ id });
  } catch (error) {
    // Handle errors (e.g., database errors, authentication errors)
    console.error('Error deleting list:', error);
    return new Response(JSON.stringify({ message: 'Failed to delete list' }), { status: 500 });
  }
}


