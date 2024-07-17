import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

interface Book {
    id: string;
    title: string;
    author: string;
    year: number;
    description: string;
}

const SearchAndDisplay: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [search, setSearch] = useState<string>('');
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('/api/books');
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const truncateText = (text: string, wordLimit: number) => {
        const words = text.split(' ');
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(' ') + '...';
    };

    const handleSearch = (results: Book[]) => {
        setFilteredBooks(results);
    };

    return (
        <div className="mt-4 w-full flex flex-col items-start">
            <div className="w-full flex flex-wrap gap-4">
                <div className="w-1/2 p-4 bg-white rounded shadow-lg">
                    <SearchBook setResults={handleSearch} />
                </div>
            </div>
            <div className="mt-4 w-full p-4 bg-white rounded shadow-lg">
                <Table className='overflow-y-auto'>
                    <TableCaption>Your search results.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBooks.map(book => (
                            <TableRow key={book.id}>
                                <TableCell className="font-medium">{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.year}</TableCell>
                                <TableCell>{truncateText(book.description, 20)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default SearchAndDisplay;
