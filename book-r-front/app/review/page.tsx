'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/nav/navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import PomedorianTimer from "@/components/nav/pomedorianTimer";

interface List {
    _id: string;
    name: string;
    books: Array<{
        _id: string;
        title: string;
        author: string;
        year: number;
        description: string;
        link: string;
    }>;
}

interface Note {
    _id: string;
    name: string;
    description: string;
}

export default function ReviewPage() {
    const [lists, setLists] = useState<List[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedList, setSelectedList] = useState<string | null>(null);
    const [showFlashCards, setShowFlashCards] = useState<boolean>(false);
    const [flashCards, setFlashCards] = useState<List["books"]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [cNote, setCNote] = useState<Note | null>(null);
    const [isFlipped, setIsFlipped] = useState<boolean>(true);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    useEffect(() => {
        fetchUserLists();
        fetchUserNotes();
    }, []);

    const fetchUserLists = async () => {
        try {
            const response = await axios.get<List[]>('/api/lists');
            setLists(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchUserNotes = async () => {
        try {
            const response = await axios.get<Note[]>('/api/notes');
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function handleNoteAdd(ev: React.FormEvent) {
        ev.preventDefault();
        const data = { name, description };
        axios.post('/api/notes', data)
            .then((response) => {
                fetchUserNotes();
            });

        setName('');
        setDescription('');
    }

    const handleListAdd = (ev: React.FormEvent) => {
        ev.preventDefault();
        const currentList = lists.find(list => list._id === selectedList);
        if (currentList) {
            setShowFlashCards(true);
            setFlashCards(currentList.books);
            setCurrentCardIndex(0);
        } else {
            console.error('List not found');
        }
    };

    const handleNextCard = () => {
        if (currentCardIndex < flashCards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(true);
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(true);
        }
    };

    const handleChange = (value: string) => {
        setSelectedList(value);
        const currentList = lists.find(list => list._id === value);
        if (currentList) {
            setShowFlashCards(true);
            setFlashCards(currentList.books);
            setCurrentCardIndex(0);
        } else {
            console.error('List not found');
        }
    };

    function handleDeletePopup(note: Note) {
        setDeleting(true);
        setCNote(note);
    }

    function handleDeleteNote() {
        const id = cNote?._id;
        if (id) {
            axios.delete(`/api/notes/${id}`)
                .then(() => {
                    setDeleting(false);
                    setCNote(null);
                    fetchUserNotes();
                })
                .catch(error => {
                    console.error('Error deleting note:', error);
                });
        }
    }

    return (
        <div>
            <NavBar>
                <div className="p-4 pt-1">
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <div className="mt-2 w-full p-4 bg-white rounded shadow-lg">
                                <div className="mb-4">
                                    <h1 className="text-2xl font-bold">Flashcards</h1>
                                </div>
                                <div className="mb-4 flex items-center gap-4 justify-center">
                                    <label className="whitespace-nowrap">Select a List:</label>
                                    <Select onValueChange={(value) => handleChange(value)}>
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
                                </div>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {showFlashCards && flashCards.length > 0 ? (
                                        <>
                                            <div className="flashcard-container w-full h-96 flex items-center justify-center">
                                                <div className={`flashcard w-3/4 h-3/4 perspective-1000 cursor-pointer relative ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
                                                    <div className="flashcard-inner w-full h-full transition-transform duration-500 ease-in-out transform">
                                                        {isFlipped ? (
                                                            <div className="flashcard-front absolute w-full h-full bg-white rounded p-4 backface-hidden flex items-center justify-center shadow-lg border border-gray-200">
                                                                <h2 className="text-lg font-bold">{flashCards[currentCardIndex]?.title}</h2>
                                                                <p className="text-gray-100 absolute bottom-2 right-2 opacity-0 transition-opacity duration-300">{isFlipped ? 'Click to reveal details' : ''}</p>
                                                            </div>
                                                        ) : (
                                                            <div className="flashcard-back absolute w-full h-full bg-white rounded p-4 backface-hidden transform rotateY-180 flex flex-col shadow-lg border border-gray-200">
                                                                <span className="flex justify-center items-center">
                                                                    <h1 className="font-bold text-3xl"><strong>Author:</strong> {flashCards[currentCardIndex]?.author}</h1>
                                                                </span>
                                                                <span className="flex pt-3">
                                                                    <p><strong>Year:</strong> {flashCards[currentCardIndex]?.year}</p>
                                                                    <a href={flashCards[currentCardIndex]?.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 ml-auto">Wikipedia Page</a>
                                                                </span>
                                                                <span className="pt-3">
                                                                    <p><strong>Description:</strong> {flashCards[currentCardIndex]?.description}</p>
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 mt-4 justify-center">
                                                <Button className="bg-gray-700" onClick={handlePrevCard} disabled={currentCardIndex === 0}>Back</Button>
                                                <Button className="bg-gray-700" onClick={handleNextCard} disabled={currentCardIndex === flashCards.length - 1}>Forward</Button>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-center text-gray-700 mt-4">No flashcards to display.</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 w-full p-4 bg-white rounded shadow-lg">
                                <span>
                                    <h1 className="text-2xl font-bold">Pomodorian Timer</h1>
                                </span>
                                <div>
                                    <PomedorianTimer />
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="mt-2 w-full p-4 bg-white rounded shadow-lg">
                                <h1 className="text-2xl font-bold">Create New Note</h1>
                                <form onSubmit={handleNoteAdd}>
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Note Name:
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-sky-100"
                                            placeholder="eg. 1984 by George Orwell"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Note Description:
                                        </label>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-sky-100"
                                            placeholder="eg. Need to review orwell more, keep missing his works."
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <Button type="submit" className="bg-gray-700">
                                            Add Note
                                        </Button>
                                    </div>
                                </form>
                            </div>
                            <div className="mt-4 w-full p-4 bg-white rounded shadow-lg">
                                <h1 className="text-2xl font-bold">Your Notes</h1>
                                <ul>
                                    {notes.map(note => (
                                        <li key={note._id} className="flex justify-between items-center p-2 bg-gray-100 rounded mt-2">
                                            <div>
                                                <h2 className="text-lg font-bold">{note.name}</h2>
                                                <p>{note.description}</p>
                                            </div>
                                            <Button className="bg-red-500" onClick={() => handleDeletePopup(note)}>
                                                Delete
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                                {deleting && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="bg-white p-4 rounded shadow-lg">
                                            <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this note?</h2>
                                            <div className="flex justify-end gap-4">
                                                <Button className="bg-gray-500" onClick={() => setDeleting(false)}>
                                                    Cancel
                                                </Button>
                                                <Button className="bg-red-500" onClick={handleDeleteNote}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </NavBar>
        </div>
    );
}
