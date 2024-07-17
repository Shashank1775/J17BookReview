"use client";

import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

interface Category {
  _id: string;
  properties: Property[];
  parent?: Category;
}

interface Property {
  name: string;
  value: string[];
}

interface Genre {
  _id: string;
  name: string;
}

interface ImageUploadResponse {
  imageUrl: string;
}

export default function NewBookForm() {
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [sorting, setSorting] = useState<string | null>(null);
  const [properties, setProperties] = useState<Record<string, string>>({});
  const [redirect, setRedirect] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [cGenre, setCGenre] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    axios.get<Category[]>('/api/sorting')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    axios.get<Genre[]>('/api/genres')
      .then(response => {
        setGenres(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = {
      title,
      author,
      year,
      description,
      link,
      images,
      sorting,
      properties,
      cGenre,
    };
    if (data.sorting === "0") {
      delete (data as { sorting?: string }).sorting;
    }
    try {
      await axios.post('/api/newbook', data);
      setRedirect(true);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  }

  if (redirect) {
    router.push('/dashboard/books');
  }

  async function uploadImages(ev: ChangeEvent<HTMLInputElement>) {
    const files = ev.target?.files;
  
    if (files && files.length > 0) { // Check if files is truthy and has length
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      try {
        const { data } = await axios.post<ImageUploadResponse>('/api/upload', formData);
        setImages(prevImages => [...prevImages, data.imageUrl]);
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    }
  }

  const propertiesToFill: Property[] = [];
if (categories.length > 0 && sorting) {
  let selSortInfo = categories.find(category => category._id === sorting);

  while (selSortInfo && selSortInfo !== undefined) {
    if (selSortInfo.properties) {
      propertiesToFill.push(...selSortInfo.properties);
    }
    selSortInfo = selSortInfo.parent ? categories.find(category => category._id === selSortInfo?.parent!._id) : undefined;
  }
}

  function setPropertiesProp(name: string, value: string) {
    setProperties(prev => {
      const newProperties = { ...prev };
      newProperties[name] = value;
      return newProperties;
    });
  }

  return (
    <div className="bg-red-50 min-h-screen flex items-center justify-center w-screen">
      <div className="w-full max-w-2xl p-6 rounded-lg shadow-md bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-gray-700 text-2xl font-bold mb-4">New Book</h1>
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              placeholder="title"
              value={title}
              onChange={ev => setTitle(ev.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Author</label>
            <input
              type="text"
              placeholder="author"
              value={author}
              onChange={ev => setAuthor(ev.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Year</label>
            <input
              type="number"
              placeholder="year"
              value={year}
              onChange={ev => setYear(ev.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              placeholder="description"
              value={description}
              onChange={ev => setDescription(ev.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Upload Images</label>
            <div className="flex gap-2 flex-wrap">
              <label className="cursor-pointer w-24 h-24 flex items-center justify-center flex-col mt-1 bg-gray-700 rounded-lg text-white hover:bg-gray-900">
                <b>Upload</b>
                <input type="file" className="w-full h-full hidden" onChange={uploadImages} />
                <b>Images</b>
              </label>
              <div>
                {!!images.length && images.map((link, index) => (
                  <div key={index} className="my-2 h-24 w-24 inline-block">
                    <Image src={link} alt={`Image ${index}`} className="max-height-100% rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Link</label>
            <input
              type="text"
              placeholder="link"
              value={link}
              onChange={ev => setLink(ev.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          {propertiesToFill.length > 0 && propertiesToFill.map((p, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-1/2">
                <div>{p.name}</div>
              </div>
              <div className="w-1/2">
                <Select 
                  value={properties[p.name]}
                  onValueChange={value => setPropertiesProp(p.name, value)}
                >
                  <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500">
                    <SelectValue placeholder="Select a Value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{p.name} Values</SelectLabel>
                      {p.value.map((v, index) => (
                        <SelectItem key={index} value={v}>{v}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
          <div>
            <label className="block text-gray-700">Genre</label>
            <Select
              value={cGenre}
              onValueChange={value => setCGenre(value)}
            >
              <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500">
                <SelectValue placeholder="Select a Value" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Genres</SelectLabel>
                  {genres.length > 0 && genres.map((genre) => (
                    <SelectItem key={genre._id} value={genre.name}>{genre.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-gray-700 text-white w-full px-4 py-2 rounded-md hover:bg-gray-800">Submit</Button>
        </form>
      </div>
    </div>
  );
}
