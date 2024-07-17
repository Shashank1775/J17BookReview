'use client'

import CallNavbar from "@/components/dashboard/callnavbar";
import ChangeBookForm from "@/components/dashboard/changebookform";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Book {
    id: string;
    title: string;
    author: string;
    // Add other properties as needed
}

interface Params {
    slug: string[];
}

export default function EditForm({ params }: { params: Params }) {
    const bookid = params.slug[0];
    const [book, setBook] = useState<Book | null>(null); // Specify Book | null type
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Specify string | null type
    const router = useRouter();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get<Book>(`/api/newbook?id=${bookid}`); // Specify response type Book
                setBook(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching book data:", error);
                setError("Failed to fetch book data");
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookid]);

    if (loading) {
        return (
            <CallNavbar>
                <div>Loading...</div>
            </CallNavbar>
        );
    }

    if (error) {
        return (
            <CallNavbar>
                <div>Error: {error}</div>
            </CallNavbar>
        );
    }

    return (
        <CallNavbar>
            <div>
                <h1>Edit Form</h1>
                <h1>{bookid}</h1>
                {book && (
                    <>
                        <div>
                            <ChangeBookForm {...book} />
                        </div>
                    </>
                )}
            </div>
        </CallNavbar>
    );
}
