'use client'

import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Link from "next/link";
import CallNavbar from "@/components/dashboard/callnavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import DeletePopup from "../../../components/dashboard/deltepopup";

interface Book {
  _id: string;
  title: string;
  author: string;
  year: string;
  description: string;
  link: string;
  genre: string;
  // Add other properties as needed
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]); // Define the type as Book[]

  useEffect(() => {
    axios.get('/api/newbook')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []);

  return (
    <CallNavbar>
      <div className="mt-4 ml-4">
        <Button className="bg-gray-700 text-white hover:bg-gray-800">
          <Link href="/dashboard/books/new" className="text-white">
            Add New Book
          </Link>
        </Button>
        <div className="mt-4 overflow-x-auto overflow-y-auto max-h-[830px]">
          <Table className="shadow-md bg-white rounded-lg">
            <TableCaption className="text-center text-gray-700 font-medium">
              All current books
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] text-gray-700">Title</TableHead>
                <TableHead className="w-[150px] text-gray-700">Author</TableHead>
                <TableHead className="w-[100px] text-gray-700">Year</TableHead>
                <TableHead className="w-[250px] text-gray-700">Description</TableHead>
                <TableHead className="w-[150px] text-gray-700">Link</TableHead>
                <TableHead className="w-[100px] text-gray-700">Genre</TableHead>
                <TableHead className="w-[100px] text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book._id} className="hover:bg-gray-50">
                  <TableCell className="text-gray-700">{book.title}</TableCell>
                  <TableCell className="text-gray-700">{book.author}</TableCell>
                  <TableCell className="text-gray-700">{book.year}</TableCell>
                  <TableCell className="text-gray-700">{book.description}</TableCell>
                  <TableCell className="text-gray-700">{book.link}</TableCell>
                  <TableCell className="text-gray-700">{book.genre}</TableCell>
                  <TableCell className="text-gray-700">
                    <Link href={`/dashboard/books/edit/${book._id}`} className="text-blue-600 hover:underline text-right">
                      Edit
                    </Link>
                    <DeletePopup _id={book._id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </CallNavbar>
  );
}
