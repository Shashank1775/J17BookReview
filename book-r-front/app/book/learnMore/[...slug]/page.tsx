'use client'

import NavBar from "@/components/nav/navbar";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/router"; // Correct import for useRouter

interface Book {
    _id: string;
    title: string;
    author: string;
    year: number;
    description: string;
    genre: string; // Adjust type based on your data structure
}

interface List {
    _id: string;
    name: string;
    // Add other properties as needed
}

export default function EditForm({ params }: { params: { slug: string[] } }) {
    const bookid = params.slug[0];
    const [book, setBook] = useState<Book | null>(null); // Specify Book type
    const [adding, setAdding] = useState(false);
    const [lists, setLists] = useState<List[]>([]); // Specify List array type
    const [selectedList, setSelectedList] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchBook() {
            try {
                const response = await axios.get<Book>(`/api/books?id=${bookid}`); // Specify response type
                setBook(response.data);
                const responseLists = await axios.get<List[]>('/api/lists'); // Specify response type
                setLists(responseLists.data);
            } catch (error) {
                console.error("Error fetching book data:", error);
            }
        }
        fetchBook();
    }, [bookid]);

    function addToList() {
        setAdding(true);
    }

    async function handleListAdd(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        if (!selectedList) {
            alert('Please select a list.');
            return;
        }

        try {
            console.log('Adding book to list:', book, selectedList)
            await axios.put("/api/addBooks", { selectedBook: book, selectedList });
            setAdding(false);
        } catch (error) {
            console.error('Error adding book to list:', error);
        }
    }

    const truncateText = useMemo(() => {
        return (text: string, wordLimit: number) => {
            const words = text.split(' ');
            if (words.length <= wordLimit) return text;
            return words.slice(0, wordLimit).join(' ') + '...';
        };
    }, []);

    return (
        <NavBar>
            <div className="p-4">
                {book ? (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
                        <p><strong>Author:</strong> {book.author}</p>
                        <p><strong>Year:</strong> {book.year}</p>
                        <p><strong>Description:</strong> {book.description}</p>
                        <p><strong>Genre:</strong> {book.genre}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <div>
                <Button onClick={() => addToList()}>
                    Add to List
                </Button>
                <Button onClick={() => router.push('/book')}>Back</Button>
            </div>
            {adding && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white p-6 rounded shadow-lg z-10">
                        <h2 className="text-xl mb-4">Add {book?.title} to List</h2>
                        <p>Author: {book?.author}</p>
                        <p>Year: {book?.year}</p>
                        <p>Description: {truncateText(book?.description || '', 20)}</p>
                        <form onSubmit={(ev) => handleListAdd(ev)}>
                            <Select onValueChange={(value) => setSelectedList(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a list" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Your Lists</SelectLabel>
                                        {lists.map((list) => (
                                            <SelectItem key={list._id} value={list._id}>
                                                {list.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Button className="bg-blue-500 mt-4" type='submit'>Submit</Button>
                        </form>
                        <div className="mt-4">
                            <Button className="bg-blue-500" onClick={() => setAdding(false)} type='button'>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </NavBar>
    );
}
