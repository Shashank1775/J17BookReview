'use client'

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import NavBar from "@/components/nav/navbar";
import FeaturedSectionCard from "@/components/nav/featuredSectionCard";
import SearchBook from '@/components/nav/search';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation'; // Correct import for useRouter
import { useSession } from "next-auth/react";

interface Book {
    _id: string;
    title: string;
    author: string;
    year: number;
    description: string;
    genre: string;
    cover: string; // Assuming cover is a string URL
}

interface List {
    _id: string;
    name: string;
    // Add other properties as needed
}

export default function Books() {
    const { data: session, status } = useSession();
    const clientName = session?.user?.name || 'Guest';

    const [books, setBooks] = useState<Book[]>([]); // Specify Book[] type
    const [search, setSearch] = useState<string>(''); // Specify string type for search
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]); // Specify Book[] type
    const [addingToList, setAddingToList] = useState<boolean>(false); // Specify boolean type
    const [lists, setLists] = useState<List[]>([]); // Specify List[] type
    const [selectedBook, setSelectedBook] = useState<Book | null>(null); // Specify Book | null type
    const [selectedList, setSelectedList] = useState<string>(''); // Specify string type

    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const [booksResponse, listsResponse] = await Promise.all([
                    axios.get<Book[]>('/api/books'), // Specify response type Book[]
                    axios.get<List[]>('/api/lists'), // Specify response type List[]
                ]);
                setBooks(booksResponse.data);
                setLists(listsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const truncateText = useMemo(() => {
        return (text: string, wordLimit: number) => {
            const words = text.split(' ');
            if (words.length <= wordLimit) return text;
            return words.slice(0, wordLimit).join(' ') + '...';
        };
    }, []);

    function addToList(book: Book) {
        setSelectedBook(book);
        setAddingToList(true);
    }

    function closePopup() {
        setAddingToList(false);
        setSelectedBook(null);
    }

    async function handleListAdd(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        if (!selectedList) {
            alert('Please select a list.');
            return;
        }

        try {
            console.log(selectedList);
            await axios.put("/api/addBooks", { selectedBook, selectedList });
            setAddingToList(false);
            setSelectedBook(null);
        } catch (error) {
            console.error('Error adding book to list:', error);
        }
    }

    return (
        <div>
            <NavBar>
                <div className='w-screen h-screen flex flex-col p-3 pb-2 gap-4 bg-gray-50'>
                    <div>
                        <h1 className="text-2xl font-bold">Featured Books:</h1>
                    </div>
                    <div className="flex justify-center gap-2">
                        {books.slice(-5).map(book => (
                            <div key={book._id} className='w-screen'>
                                <FeaturedSectionCard
                                    title={book.title}
                                    author={book.author}
                                    year={book.year}
                                    description={book.description}
                                    cover={book.cover}
                                />
                            </div>
                        ))}
                    </div>
                    <div className='flex gap-4'>
                        <div className='w-1/2'>
                            <div>
                                <div className="mt-4 w-full p-4 pt-1 bg-white rounded shadow-lg overflow-y-auto max-h-[630px]">
                                    <Table className='overflow-y-auto'>
                                        <TableCaption>All Current Books</TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Title</TableHead>
                                                <TableHead>Author</TableHead>
                                                <TableHead>Year</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Genre</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {books.map(book => (
                                                <TableRow key={book._id}>
                                                    <TableCell className="font-medium">{book.title}</TableCell>
                                                    <TableCell>{book.author}</TableCell>
                                                    <TableCell>{book.year}</TableCell>
                                                    <TableCell>{truncateText(book.description, 10)}</TableCell>
                                                    <TableCell>{book.genre}</TableCell>
                                                    <TableCell>
                                                        <span className='flex gap-2'>
                                                            <Button className='bg-blue-500 hover:bg-blue-600 text-white' onClick={() => addToList(book)}>
                                                                Add to List
                                                            </Button>
                                                            <Button className='bg-clear hover:bg-gray-200 text-black' onClick={() => router.push(`/book/learnMore/${book._id}`)}>
                                                                Learn More
                                                            </Button>
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                        <div className='w-1/2'>
                            <div>
                                <div className="mt-4 w-full p-4 bg-white rounded shadow-lg overflow-y-auto max-h-[630px] p-1">
                                    <SearchBook setResults={setFilteredBooks} />
                                    <Table className='overflow-y-auto max-h-[200px]'>
                                        <TableCaption>Your search results.</TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Title</TableHead>
                                                <TableHead>Author</TableHead>
                                                <TableHead>Year</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Genre</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredBooks.map(book => (
                                                <TableRow key={book._id}>
                                                    <TableCell className="font-medium">{book.title}</TableCell>
                                                    <TableCell>{book.author}</TableCell>
                                                    <TableCell>{book.year}</TableCell>
                                                    <TableCell>{truncateText(book.description, 20)}</TableCell>
                                                    <TableCell>{book.genre}</TableCell>
                                                    <TableCell>
                                                        <Button className='bg-blue-500' onClick={() => addToList(book)}>
                                                            Add to List
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </NavBar>
            {/* Modal for adding book to list */}
            {addingToList && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white p-6 rounded shadow-lg z-10">
                        <h2 className="text-xl mb-4">Add {selectedBook?.title} to List</h2>
                        <p>Author: {selectedBook?.author}</p>
                        <p>Year: {selectedBook?.year}</p>
                        <p>Description: {truncateText(selectedBook?.description || '', 20)}</p>
                        <form onSubmit={(ev) => handleListAdd(ev)}>
                            <Select onValueChange={(value) => setSelectedList(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a list" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Your Lists</SelectLabel>
                                        {lists.map(list => (
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
                            <Button className="bg-blue-500" onClick={closePopup} type='button'>Close</Button>
                        </div>
                    </div>
                </div>
            )}
            {/* Unauthorized access modal */}
            {clientName === 'Guest' ? (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white p-6 rounded shadow-lg z-10">
                        <h2 className="text-xl mb-4">You are not authorized to view this page.</h2>
                        <p className="text-gray-500 mb-4 text-center">Please press the button to login.</p>
                        <div className="flex justify-center">
                            <Button className="bg-sky-500 text-white mr-2" onClick={() => router.push('/auth/login')} type='button'>Login</Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
