'use client'

import NavBar from "@/components/nav/navbar";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";

export default function ListForm() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [name, setName] = useState("");
    const [studyInterval, setStudyInterval] = useState("");
    const [tags, setTags] = useState("");
    const [priority, setPriority] = useState<number>(0);
    const [deadline, setDeadline] = useState<Date | undefined>(new Date()); // Initialize deadline state with current date
    const [color, setColor] = useState("");
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState("");
    const [redirect, setRedirect] = useState(false);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (status === "unauthenticated") {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="bg-white p-6 rounded shadow-lg z-10">
                    <h1 className="text-gray-700 text-2xl font-bold mb-4">Unauthorized</h1>
                    <p className="text-gray-700 mb-4">You are not logged in. To use this feature, you must be logged in. Please press the button below to login</p>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={() => router.push('/auth/login')} type='button'>Login</Button>
                </div>
            </div>
        );
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        if (!name || !studyInterval || !tags || !priority || !deadline || !color) {
            setFormError("One or more required fields are empty.");
            setTimeout(() => {
                setFormError("");
            }, 5000);
            return;
        }

        const data = {
            name,
            studyInterval,
            tags,
            priority,
            deadline,
            color,
            description,
        };

        axios.post('/api/lists', data)
            .then(() => {
                setRedirect(true);
            })
            .catch(error => {
                console.error('Error creating list:', error);
                setFormError("Error creating list. Please try again later.");
            });
    }

    if (redirect) {
        router.push('/lists');
    }

    return (
        <div>
            <NavBar>
                <div className="p-4">
                    <form className="max-w-100% p-4 bg-white shadow-lg rounded-md" onSubmit={handleSubmit}>
                        <h1 className="text-gray-700 text-2xl font-bold mb-4">Create a List</h1>
                        {formError && (
                            <p className="text-red-500 text-sm text-center py-2">{formError}</p>
                        )}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                            <input placeholder="eg. American Authors" type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="studyInterval" className="block text-gray-700 mb-2">Study Interval</label>
                            <input placeholder="eg. Three Days" type="text" id="studyInterval" value={studyInterval} onChange={(e) => setStudyInterval(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="tags" className="block text-gray-700 mb-2">Tags</label>
                            <input placeholder="eg. @History @America " type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="priority" className="block text-gray-700 mb-2">Priority</label>
                            <Select value={priority.toString()} onValueChange={(value) => setPriority(Number(value))}>
                                <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500">
                                    <SelectValue placeholder="Select a Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Priority</SelectLabel>
                                        <SelectItem value="1">Low</SelectItem>
                                        <SelectItem value="2">Medium</SelectItem>
                                        <SelectItem value="3">High</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="deadline" className="block text-gray-700 mb-2">Deadline</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={deadline} onSelect={(date: Date | undefined) => setDeadline(date ?? new Date())}
 initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="color" className="block text-gray-700 mb-2">Color</label>
                            <Select value={color.toString()} onValueChange={(value) => setColor(value)}>
                                <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500">
                                    <SelectValue placeholder="Select a Color" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Color</SelectLabel>
                                        <SelectItem value="red">Red</SelectItem>
                                        <SelectItem value="blue">Blue</SelectItem>
                                        <SelectItem value="green">Green</SelectItem>
                                        <SelectItem value="yellow">Yellow</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500" placeholder="eg. A list of American authors to study for the upcoming tournament. *Optional*"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Submit</Button>
                        <Button type="button" className="w-full bg-clear hover:bg-neutral-300 text-black py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4" onClick={() => router.push('/lists')}>Cancel</Button>
                    </form>
                </div>
            </NavBar>
        </div>
    );
}
