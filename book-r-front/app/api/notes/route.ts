import { NextResponse } from "next/server";
import mongooseConnect from "../../../lib/mongoose";
import NewNote from "../../../models/newnote";
import { auth } from "../../../lib/auth";

import NewBook from "../../../models/newbook"; // Import the NewBook model

export async function GET(request: any) { // Add type annotation for the request parameter
    const session = await auth();
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.user?.id; // Add null check for session and optional chaining for session.user

    await mongooseConnect();

    try {
        const listDocuments = await NewNote.find({ creatorId: userId });
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

        const { name, description } = await request.json(); // Parse the request body
        // Create a new list document
        const noteDocument = await NewNote.create({
            creatorId: userId,
            name,
            description,
            date: new Date()
        });
        console.log("List created successfully:", noteDocument);
        return NextResponse.json({ noteDocument });
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
    const { name, description, _id } = await request.json(); // Parse the request body

    if (!_id) {
      return NextResponse.json({ message: "ID is required", _id}, { status: 400 });
    }

    await mongooseConnect();
    // Perform the update operation

    const result: any = await NewNote.updateOne(
      { _id, creatorId: userId }, // Ensure the user is only updating their own list
      { name, description, date: new Date() }
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

export async function DELETE(request: any) {
    const session = await auth();
    const userId = session?.user?.id;
    const { id } = await request.json();
    try {
        await mongooseConnect(); // Ensure the database connection is ready

        const deletedList = await NewNote.deleteOne({ _id: id, creatorId: userId });

        if (deletedList.deletedCount === 0) {
            return NextResponse.json({ message: "List not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "List deleted successfully" });
    } catch (error) {
        console.error("DELETE request error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
