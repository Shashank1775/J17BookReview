import { NextApiResponse } from 'next';
import mongooseConnect from "../../../lib/mongoose";
import NewList from "../../../models/newlist";
import { auth } from "../../../lib/auth";

export async function PUT(request: any) {
    const session = await auth();
    const userId = session?.user?.id;
    const { selectedBook, selectedList } = await request.json();
    
    try {
        await mongooseConnect(); // Ensure the database connection is ready

        // Check if the book already exists in the list
        const list = await NewList.findOne({ _id: selectedList, creatorId: userId });

        if (list.books.includes(selectedBook._id)) {
            return new Response(JSON.stringify({ message: "Book already exists in the list" }), { status: 400 });
        }

        // Add the book to the list if it's not a duplicate
        const updatedList = await NewList.updateOne(
            { _id: selectedList, creatorId: userId },
            { $push: { books: selectedBook } }
        );
        console.log("List updated successfully:", updatedList);
        return new Response(JSON.stringify({ updatedList }), { status: 200 });

    } catch (error) {
        console.error("PUT request error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}

export async function DELETE(request: any) {
    const session = await auth();
    const userId = session?.user?.id;
    const { selectedBook, selectedList } = await request.json();
    const selectedListId = selectedList._id;

    try {
        await mongooseConnect(); // Ensure the database connection is ready

        // Check if the list exists and belongs to the user
        const list = await NewList.findOne({ _id: selectedListId, creatorId: userId });

        if (!list) {
            return new Response(JSON.stringify({ message: "List not found or you don't have permission to modify this list" }), { status: 404 });
        }
        
        // Remove the book from the list
        const updatedList = await NewList.updateOne(
            { _id: selectedListId, creatorId: userId },
            { $pull: { books: { _id: selectedBook._id } } }
        );

        if (updatedList.modifiedCount === 0) {
            return new Response(JSON.stringify({ message: "Book not found in the list" }), { status: 404 });
        }

        console.log("Book removed successfully from the list:", updatedList);
        return new Response(JSON.stringify({ message: "Book removed successfully" }), { status: 200 });

    } catch (error) {
        console.error("DELETE request error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
