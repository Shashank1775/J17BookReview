import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from '../ui/button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import DeletePopupGenre from './deletepopupGenre';

interface Genre {
    _id: string;
    name: string;
    parent?: string;
}

export default function GenreForm() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [cGenre, setCGenre] = useState<string>('');
    const [parent, setParent] = useState<string>('');

    useEffect(() => {
        fetchGenres();
    }, []);

    async function fetchGenres() {
        try {
            const response = await axios.get<Genre[]>('/api/genres');
            setGenres(response.data);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = { name: cGenre, parent };
        try {
            await axios.post('/api/genres', data);
            fetchGenres();
        } catch (error) {
            console.error('Error submitting genre:', error);
        }
    }

    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-8">
                <h1 className='text-2xl font-bold mb-4 text-center'>Genre Form</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Name</label>
                        <input
                            type='text'
                            placeholder='Enter a Name'
                            value={cGenre}
                            onChange={(ev: ChangeEvent<HTMLInputElement>) => setCGenre(ev.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Parent</label>
                        <Select value={parent} onValueChange={(value) => setParent(value)}>
                            <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                                <SelectValue placeholder="Select a Parent (Optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Parents</SelectLabel>
                                    {genres.map((genre) => (
                                        <SelectItem key={genre._id} value={genre.name}>{genre.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700">
                        Submit
                    </Button>
                </form>
            </div>
            <div className="mt-6 max-h-screen overflow-y-auto">
                <Table className="shadow-md bg-white rounded-lg">
                    <TableCaption className="text-center text-gray-700 font-medium">All current genres</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-700">ID</TableHead>
                            <TableHead className="text-gray-700">Name</TableHead>
                            <TableHead className="text-gray-700">Parent</TableHead>
                            <TableHead className="text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {genres.length > 0 && genres.map((genre) => (
                            <TableRow key={genre._id}>
                                <TableCell className="text-gray-700">{genre._id}</TableCell>
                                <TableCell className="text-gray-700">{genre.name}</TableCell>
                                <TableCell className="text-gray-700">{genre.parent}</TableCell>
                                <TableCell className="text-gray-700 flex justify-end gap-2">
                                    <DeletePopupGenre _id={genre._id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
