import { NextResponse } from 'next/server';
import mongooseConnect from "../../../lib/mongoose";
import { Sorting } from '../../../models/sorting';
import { auth } from "../../../lib/auth"

export async function POST(request: any) {
    const session = await auth();
    const userId = session?.user?.id;
    const adminId = ['6681baf3edaf2e8a771432a2'];
    if (typeof userId !== 'string') {
        return NextResponse.json({ message: "You are not authorized to view this page" });
    }
    
    if (adminId.includes(userId)) {
        await mongooseConnect();
        const { sortingName, parent, properties } = await request.json();
        const SortingDoc = await Sorting.create({ name: sortingName, parent: parent, properties });
        return NextResponse.json({ SortingDoc });
    } else {
        return NextResponse.json({ message: "You are not authorized to view this page" });
    }
}

export async function GET() {
    const session = await auth();
    const userId = session?.user?.id;
    const adminId = ['6681baf3edaf2e8a771432a2'];
    if (typeof userId !== 'string') {
        return NextResponse.json({ message: "You are not authorized to view this page" });
    }

    if (adminId.includes(userId)) {
        await mongooseConnect();
        return NextResponse.json(await Sorting.find({}).populate('parent'));
    } else {
        return NextResponse.json({ message: "You are not authorized to view this page" });
    }
}

export async function DELETE(request: any) {
    const session = await auth();
    const userId = session?.user?.id;
    const adminId = ['6681baf3edaf2e8a771432a2'];
    if (typeof userId !== 'string') {
        return NextResponse.json({ message: "You are not authorized to view this page" });
    }

    if (adminId.includes(userId)) {
        await mongooseConnect();
        const { id } = await request.json();
        await Sorting.deleteOne({ _id: id });
        return NextResponse.json({ message: "Class deleted successfully" });
    } else {
        return NextResponse.json({ message: "You are not authorized to view this page" });
    }
}