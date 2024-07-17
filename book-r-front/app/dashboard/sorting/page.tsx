// components/Sorting.tsx
'use client';

import CallNavbar from "@/components/dashboard/callnavbar";
import { Button } from "@/components/ui/button";
import { useState, useEffect, FormEvent } from "react";
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import DeletePopupSorting from "@/components/dashboard/deletepopupsorting";
import GenreForm from "@/components/dashboard/genreForm";

interface Category {
    _id: string;
    name: string;
    parent?: Category | null;
    properties: { name: string; value: string[] }[];
    __v?: number;
}

interface Property {
    name: string;
    value: string;
}

export default function Sorting() {
    const [sortingName, setSortingName] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [parent, setParent] = useState<string>('');
    const [edit, setEdit] = useState<boolean>(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData() {
        axios.get<Category[]>('/api/sorting')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function editSorting(category: Category) {
        setEdit(true);
        setEditCategory(category);
        setSortingName(category.name);
        setParent(category.parent ? category.parent._id : "0");
        setProperties(category.properties.map(({ name, value }) => ({ name, value: value.join(',') })));
    }

    async function handleSubmit(ev: FormEvent) {
        ev.preventDefault();
        const data: Partial<Category> = {
            name: sortingName,
            parent: parent === "0" ? null : categories.find(cat => cat._id === parent) || null,
            properties: properties.map(p => ({ name: p.name, value: p.value.split(',') })),
        };
        if (edit && editCategory) {
            data._id = editCategory._id;
            await axios.put('/api/sorting', data);
            setEdit(false);
            setEditCategory(null);
            fetchData(); // Refresh categories after edit
            resetForm();
        } else {
            await axios.post('/api/sorting', data);
            resetForm();
            fetchData(); // Refresh categories after new category creation
        }
    }

    function resetForm() {
        setSortingName('');
        setParent('');
        setProperties([]);
    }

    function newProperty() {
        setProperties(prev => [...prev, { name: '', value: '' }]);
    }

    function removeProperty(index: number) {
        setProperties(prev => {
            const updatedProperties = [...prev];
            updatedProperties.splice(index, 1);
            return updatedProperties;
        });
    }

    function handlePropertyChange(index: number, newName: string) {
        setProperties(prev => {
            const updatedProperties = [...prev];
            updatedProperties[index] = { ...updatedProperties[index], name: newName };
            return updatedProperties;
        });
    }

    function handleChangePropertyValue(index: number, newValue: string) {
        setProperties(prev => {
            const updatedProperties = [...prev];
            updatedProperties[index] = { ...updatedProperties[index], value: newValue };
            return updatedProperties;
        });
    }

    function cancelEdit() {
        setEdit(false);
        setEditCategory(null);
        resetForm();
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col items-center">
            <CallNavbar>
                <div className="flex gap-4">
                    <div className="max-w-1/2 mx-auto p-4 bg-white shadow-lg rounded-md mt-4 ml-4">
                        <div className="mt-4 w-full max-w-6xl px-6">
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">Sorting and Genre Management</h1>
                            <div className="flex flex-col gap-8 w-full">
                                <div className="w-full">
                                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full space-y-4">
                                        <div className="flex gap-4 items-end">
                                            <div className="flex-1">
                                                <label className="block text-gray-700 mb-1">Sorting Class</label>
                                                <input
                                                    type="text"
                                                    placeholder={edit ? `Edit Sorting Name ${editCategory?.name}` : "New Sorting Name"}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                                                    onChange={(ev) => setSortingName(ev.target.value)}
                                                    value={sortingName}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-gray-700 mb-1">Parent</label>
                                                <Select onValueChange={(value) => setParent(value)} value={parent}>
                                                    <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500">
                                                        <SelectValue placeholder="Select a Parent" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Parent Classes</SelectLabel>
                                                            <SelectItem value="0">No Parent</SelectItem>
                                                            {categories.length > 0 && categories.map((category) => (
                                                                <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1">Properties</label>
                                            {properties.length > 0 && properties.map((property, index) => (
                                                <div className="flex gap-2 mt-2" key={index}>
                                                    <input
                                                        type="text"
                                                        placeholder="Property Name"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                                                        value={property.name}
                                                        onChange={(ev) => handlePropertyChange(index, ev.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Property Value"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                                                        value={property.value}
                                                        onChange={(ev) => handleChangePropertyValue(index, ev.target.value)}
                                                    />
                                                    <Button type="button" className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800" onClick={() => removeProperty(index)}>Remove</Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-4">
                                            <Button type="button" className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800" onClick={newProperty}>Add New Properties</Button>
                                            <div>
                                                <Button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 mr-2">Save</Button>
                                                {edit && (
                                                    <Button type="button" className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800" onClick={cancelEdit}>Cancel</Button>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                    {!edit && (
                                        <div className="mt-6 max-h-screen overflow-y-auto">
                                            <Table className="shadow-md bg-white rounded-lg">
                                                <TableCaption className="text-center text-gray-700 font-medium">All current categories</TableCaption>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="text-gray-700">ID</TableHead>
                                                        <TableHead className="text-gray-700">Name</TableHead>
                                                        <TableHead className="text-gray-700">Version</TableHead>
                                                        <TableHead className="text-gray-700">Parent</TableHead>
                                                        <TableHead className="text-gray-700">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {categories.length > 0 && categories.map((category) => (
                                                        <TableRow key={category._id}>
                                                            <TableCell className="text-gray-700">{category._id}</TableCell>
                                                            <TableCell className="text-gray-700">{category.name}</TableCell>
                                                            <TableCell className="text-gray-700">{category.__v}</TableCell>
                                                            <TableCell className="text-gray-700">{category?.parent?.name}</TableCell>
                                                            <TableCell className="text-gray-700 flex justify-end gap-2">
                                                                <DeletePopupSorting _id={category._id} />
                                                                <button
                                                                    className="text-blue-600 hover:underline"
                                                                    onClick={() => editSorting(category)}
                                                                >
                                                                    Edit
                                                                </button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </div>                            
                            </div>
                        </div>
                    </div>
                    <div className="max-w-1/2 mx-auto p-4 bg-white shadow-lg rounded-md mt-4">
                        <GenreForm />
                    </div>
                </div>
            </CallNavbar>
        </div>
    );
}
