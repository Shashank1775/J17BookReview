import NewBook from "@/models/newbook";
import NewList from "@/models/newlist";
import NewNote from "@/models/newnote";
import mongooseConnect from "../../../lib/mongoose";
import { auth } from "../../../lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(request: any) {
    const session = await auth();
    const userId = session?.user?.id;

    try {
        await mongooseConnect(); // Ensure the database connection is ready

        // Delete all NewList entries for the userId
        await NewList.deleteMany({ creatorId: userId });

        // Delete all NewNote entries for the userId
        await NewNote.deleteMany({ creatorId: userId });

        return NextResponse.json({ status: 200, body: { message: "Deleted all data successfully" } });

        } catch (error) {
        console.error("DELETE request error:", error);
        return NextResponse.json({ status: 500, body: { message: "Internal Server Error" } });
    }
}
