// components/SearchBook.tsx
'use client';

import CallNavbar from "@/components/dashboard/callnavbar";
import { useState, FormEvent } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from 'axios';

interface Book {
    _id: string;
    title: string;
    author: string;
    year: string;
    genre: string;
    // Add other properties as needed
}

export default function SearchBook() {
    const [search, setSearch] = useState<string>('');
    const [searchBy, setSearchBy] = useState<string>('');
    const [results, setResults] = useState<Book[]>([]);

    const handleSearch = async (event: FormEvent) => {
        event.preventDefault();
        const searchParams = { search, searchBy };
        try {
            const response = await axios.get<Book[]>('/api/search', { params: searchParams });
            setResults(Array.isArray(response.data) ? response.data : [response.data]);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <CallNavbar>
            <div className="max-w-screen mx-auto p-4 bg-white shadow-lg rounded-md mt-4 ml-4 mr-4">
                <h1 className="text-gray-700 text-2xl font-bold mb-4">Search for a Book</h1>
                <form onSubmit={handleSearch}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Search By</label>
                        <Select value={searchBy} onValueChange={(value) => setSearchBy(value)}>
                            <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500">
                                <SelectValue placeholder="Select a Search Criterion" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Search By</SelectLabel>
                                    <SelectItem value="title">Title</SelectItem>
                                    <SelectItem value="author">Author</SelectItem>
                                    <SelectItem value="_id">ID</SelectItem>
                                    <SelectItem value="year">Year</SelectItem>
                                    <SelectItem value="genre">Genre</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Search</label>
                        <input
                            type='text'
                            placeholder={`Enter ${searchBy}`}
                            value={search}
                            onChange={(ev) => setSearch(ev.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        Search
                    </Button>
                </form>
            </div>
            <div className="mt-4 ml-4 flex flex-wrap items-center justify-start">
                {results.length > 0 ? (
                    results.map((result) => (
                        <div key={result._id} className="p-4 bg-white shadow-lg rounded-md shadow-md mr-4 mb-4" style={{ minWidth: '300px' }}>
                            <h2 className="text-xl font-bold">{result.title}</h2>
                            <p>Author: {result.author}</p>
                            <p>Year: {result.year}</p>
                            <p>ID: {result._id}</p>
                        </div>
                    ))
                ) : (
                    <p className="mt-4 ml-4">No results found</p>
                )}
            </div>
        </CallNavbar>
    );
}
