'use client'

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/nav/navbar";
import { Button } from '@/components/ui/button';
import StarRating from '../../components/nav/starRating';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from 'next/navigation'; // Corrected import

interface Book {
  _id: string;
  title: string;
  author: string;
  year: string;
  description: string;
}

interface List {
  _id: string;
  name: string;
  deadline: string;
  priority: number;
  studyInterval: string;
  color: string;
  books: Book[];
}

export default function ListForm() {
  const { data: session, status } = useSession();
  const [userLists, setUserLists] = useState<List[]>([]); // Specify List[] type
  const [deletePopup, setDeletePopup] = useState(false);
  const [listDeletePopup, setListDeletePopup] = useState(false);
  const [selectedDeleteList, setSelectedDeleteList] = useState<List | null>(null); // Specify List | null type
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // Specify Book | null type
  const [selectedList, setSelectedList] = useState<List | null>(null); // Specify List | null type
  const router = useRouter();

  useEffect(() => {
    fetchUserLists();
  }, []);

  const fetchUserLists = async () => {
    try {
      const response = await axios.get<List[]>('/api/lists'); // Specify axios response type
      setUserLists(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error (e.g., show error message)
    }
  };

  const handleDoubleClick = (book: Book, list: List) => {
    setSelectedBook(book);
    setSelectedList(list);
    setDeletePopup(true);
  };

  const handleEdit = (id: string) => {
    router.push(`/lists/edit/${id}`);
  };

  function handleListPopup(list:any){
    setSelectedDeleteList(list)
    setListDeletePopup(true)
  }

  const handleDeleteBook = async () => {
    try {
      if (!selectedBook || !selectedList) return; // Guard clause to ensure selectedBook and selectedList are not null
      console.log('Deleting book:', selectedBook._id);
      await axios.delete('/api/addBooks', { data: { selectedBook, selectedList } });

      // Update userLists after deletion
      setUserLists(prevLists => {
        const updatedLists = prevLists.map(list => {
          if (list._id === selectedList._id) {
            return {
              ...list,
              books: list.books.filter(book => book._id !== selectedBook._id)
            };
          }
          return list;
        });
        return updatedLists;
      });

      closePopup();
    } catch (error) {
      console.error('Error deleting book:', error);
      // Handle error (e.g., show error message)
    }
  };

  const handleDeleteList = async () => {
    try {
      if (!selectedDeleteList) return; // Guard clause to ensure selectedDeleteList is not null
      const id = selectedDeleteList._id;
      await axios.delete(`/api/lists?id=${id}`);
  
      // Update userLists after deletion
      setUserLists(prevLists => prevLists.filter(list => list._id !== id));
  
      closePopup();
    } catch (error) {
      console.error('Error deleting list:', error);
      // Handle error (e.g., show error message)
    }
  };
  
  const closePopup = () => {
    setDeletePopup(false);
    setSelectedBook(null);
    setSelectedList(null);
    setListDeletePopup(false);
    setSelectedDeleteList(null);
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="bg-white p-6 rounded shadow-lg z-10">
          <h1 className="text-gray-700 text-2xl font-bold mb-4">Unauthorized</h1>
          <p className="text-gray-700 mb-4">
            You are not logged in. To use this feature, you must be logged in. Please press the button below to login.
          </p>
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => router.push('/auth/login')}
            type='button'
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar>
        <div className="p-4 flex items-center justify-center">
          <h1 className="text-2xl font-bold">Your Lists:</h1>
          <div className="ml-auto pl-4">
            <Button onClick={() => router.push('/lists/create')} type='button'>Create List</Button>
          </div>
        </div>
        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {userLists.map(list => (
            <div key={list._id} className={`w-full p-4 bg-white rounded shadow-lg border-t-4 border-${list.color}-200`}>
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-bold">{list.name}</h1>
                <span className="cursor-pointer" onClick={() => handleEdit(list._id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </span>
                <span className="cursor-pointer" onClick={() => handleListPopup(list)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </span>
                <h1 className="text-lg font-bold">{list.deadline.substring(0, 10)}</h1>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <span className="font-bold mr-2">Priority:</span>
                  <StarRating rating={list.priority} maxRating={3} />
                </div>
                <div className="flex items-center">
                  <span className="font-bold mr-2">Interval:</span>
                  <h1 className="text-lg font-bold">{list.studyInterval}</h1>
                </div>
              </div>
              <div className="mt-4 w-full bg-white rounded shadow-lg overflow-hidden overflow-y-auto max-h-[630px]" style={{ maxHeight: '50vh' }}>
                <Table className='w-full'>
                  <TableCaption>Books in List</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.books.map(book => (
                      <TableRow key={book._id} onDoubleClick={() => handleDoubleClick(book, list)}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.year}</TableCell>
                        <TableCell>{book.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      </NavBar>
      {deletePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded shadow-lg z-10">
            <h2 className="text-xl mb-4">Are you sure you want to delete this book?</h2>
            <p>Book: {selectedBook?.title}</p>
            <p>List: {selectedList?.name}</p>
            <p className="text-red-500 mb-4">This action is irreversible.</p>
            <div className="flex justify-end">
              <Button className="bg-gray-500 text-white mr-2" onClick={closePopup} type='button'>Cancel</Button>
              <Button className="bg-red-500 text-white" onClick={handleDeleteBook} type='button'>Delete</Button>
            </div>
          </div>
        </div>
      )}
      {listDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded shadow-lg z-10">
            <h2 className="text-xl mb-4">Are you sure you want to delete this list?</h2>
            <p>List: {selectedDeleteList?.name}</p>
            <p>Deadline: {selectedDeleteList?.deadline.substring(0, 10)}</p>
            <p className="text-red-500 mb-4">This action is irreversible.</p>
            <div className="flex justify-end">
              <Button className="bg-gray-500 text-white mr-2" onClick={closePopup} type='button'>Cancel</Button>
              <Button className="bg-red-500 text-white" onClick={handleDeleteList} type='button'>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
