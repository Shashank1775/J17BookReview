'use client';

import ChangeListForm from "@/components/nav/changeListForm";
import NavBar from "@/components/nav/navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface List {
    id: string;
    name: string;
    studyInterval: string;
    tags: string;
    priority: number;
    deadline: Date;
    color: string;
    description: string;
}

interface EditFormProps {
    params: {
        slug: string[];
    };
}

export default function EditForm({ params }: EditFormProps) {
    const listId = params.slug[0];
    const [list, setList] = useState<List | null>(null);
    const router = useRouter();

    useEffect(() => {
        axios.get(`/api/lists?id=${listId}`)
            .then(response => {
                setList(response.data);
            })
            .catch(error => {
                console.error("Error fetching list data:", error);
                // Handle error (e.g., redirect to error page)
            });
    }, [listId]);

    if (!list) {
        return (
            <NavBar>
                <div className="text-center mt-8">
                    Loading...
                </div>
            </NavBar>
        );
    }

    return (
        <NavBar>
            <ChangeListForm {...list} />
        </NavBar>
    );
}
