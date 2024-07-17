'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import NavBar from "@/components/nav/navbar";
import { Button } from "@/components/ui/button";

interface ListFormData {
  _id?: string;
  name?: string;
  studyInterval?: string;
  tags?: string;
  priority?: number;
  deadline?: Date;
  color?: string;
  description?: string;
}

export default function ChangeListForm({
  _id,
  name: existingName,
  studyInterval: existingStudyInterval,
  tags: existingTags,
  priority: existingPriority,
  deadline: existingDeadline,
  color: existingColor,
  description: existingDescription,
}: ListFormData) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState(existingName || "");
  const [studyInterval, setStudyInterval] = useState(existingStudyInterval || "");
  const [tags, setTags] = useState(existingTags || "");
  const [priority, setPriority] = useState(existingPriority || 0);
  const [deadline, setDeadline] = useState(existingDeadline || undefined);
  const [color, setColor] = useState(existingColor || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (redirect) {
      router.push("/lists");
    }
  }, [redirect, router]);

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data: ListFormData = {
      _id,
      name,
      studyInterval,
      tags,
      priority,
      deadline,
      color,
      description,
    };
    try {
      if (_id) {
        await axios.put(`/api/lists/${_id}`, data);
      } else {
        await axios.post("/api/lists", data);
      }
      setRedirect(true);
    } catch (error) {
      console.error("Error saving list:", error);
      // Handle error (e.g., show error message)
    }
  }

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
            onClick={() => router.push("/auth/login")}
            type="button"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4">
        <form
          className="max-w-full p-4 bg-white shadow-lg rounded-md"
          onSubmit={handleSubmit}
        >
          <h1 className="text-gray-700 text-2xl font-bold mb-4">Edit List</h1>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Name
            </label>
            <input
              placeholder="eg. American Authors"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="studyInterval" className="block text-gray-700 mb-2">
              Study Interval
            </label>
            <input
              placeholder="eg. Three Days"
              type="text"
              id="studyInterval"
              value={studyInterval}
              onChange={(e) => setStudyInterval(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-gray-700 mb-2">
              Tags
            </label>
            <input
              placeholder="eg. @History @America"
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="priority" className="block text-gray-700 mb-2">
              Priority
            </label>
            <Select
              value={priority.toString()}
              onValueChange={(value) => setPriority(Number(value))}
            >
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
            <label htmlFor="deadline" className="block text-gray-700 mb-2">
              Deadline
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(new Date(deadline), "PPP") : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="mb-4">
            <label htmlFor="color" className="block text-gray-700 mb-2">
              Color
            </label>
            <Select
              value={color}
              onValueChange={(value) => setColor(value)}
            >
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
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 h-full"
              placeholder="eg. A list of American authors to study for the upcoming tournament. *Optional*"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit
          </Button>
          <Button
            type="button"
            className="w-full bg-clear hover:bg-neutral-300 text-black py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4"
            onClick={() => router.push("/lists")}
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
}
