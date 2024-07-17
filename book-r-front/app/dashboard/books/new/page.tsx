import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import CallNavbar from "@/components/dashboard/callnavbar";
import NewBookForm from "@/components/dashboard/newbookform";

export default function Books() {
    return (
        <CallNavbar>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Add New Book</h1>
                <NewBookForm />
            </div>
        </CallNavbar>
    );
}
