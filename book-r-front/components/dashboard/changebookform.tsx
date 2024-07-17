import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

interface BookProps {
  _id?: string;
  title: string;
  author: string;
  year?: string;
  description?: string;
  cover?: string;
  link?: string;
  images?: string[];
  sorting?: string | null;
  properties?: Record<string, string>;
  genre?: string;
}

interface Category {
  _id: string;
  properties: { name: string }[];
}

interface Genre {
  _id: string;
  name: string;
}

export default function ChangeBookForm({
  _id,
  title: existingTitle,
  author: existingAuthor,
  year: existingYear = '',
  description: existingDescription = '',
  cover: existingCover = '',
  link: existingLink = '',
  images: existingImages = [],
  sorting: existingSorting = null,
  properties: existingProperties = {},
  genre: existingGenre = '',
}: BookProps) {
  const [title, setTitle] = useState(existingTitle);
  const [author, setAuthor] = useState(existingAuthor);
  const [year, setYear] = useState(existingYear);
  const [genre, setGenre] = useState(existingGenre);
  const [description, setDescription] = useState(existingDescription);
  const [cover, setCover] = useState(existingCover);
  const [link, setLink] = useState(existingLink);
  const [images, setImages] = useState(existingImages);
  const [sorting, setSorting] = useState(existingSorting);
  const [properties, setProperties] = useState(existingProperties);
  const [redirect, setRedirect] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [cGenre, setCGenre] = useState(existingGenre);

  const router = useRouter();

  useEffect(() => {
    axios.get('/api/sorting')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching sorting data:', error);
      });

    axios.get('/api/genres')
      .then(response => {
        setGenres(response.data);
      })
      .catch(error => {
        console.error('Error fetching genres data:', error);
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
      genre: cGenre,
    };

    try {
      if (_id) {
        await axios.put(`/api/newbook/${_id}`, data);
      } else {
        await axios.post('/api/newbook', data);
      }
      setRedirect(true);
    } catch (error) {
      console.error('Error submitting book:', error);
    }
  }

  if (redirect) {
    router.push('/dashboard/books');
  }

  async function uploadImages(ev: ChangeEvent<HTMLInputElement>) {
    const files = ev.target.files;

    if (files && files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      try {
        const { data } = await axios.post('/api/upload', formData);
        setImages(prevImages => [...prevImages, data.imageUrl]);
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    }
  }

  useEffect(() => {
    if (categories.length > 0 && sorting) {
      const selSortInfo = categories.find(cat => cat._id === sorting);
      if (selSortInfo) {
        const propertiesToFill = selSortInfo.properties;
        setProperties((prevProperties) => {
          const newProperties = { ...prevProperties };
          propertiesToFill.forEach(p => {
            if (!newProperties[p.name]) {
              newProperties[p.name] = '';
            }
          });
          return newProperties;
        });
      }
    }
  }, [categories, sorting]);

  return (
    <div className="bg-red-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl p-6 rounded-lg shadow-md bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-gray-700 text-2xl font-bold mb-4">Edit Book</h1>

          {/* Form Inputs */}
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              type='text'
              placeholder="Title"
              value={title}
              onChange={ev => setTitle(ev.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
              required
            />
          </div>

          {/* More form inputs like author, year, description, etc. */}

          {/* Upload Images */}
          <div>
            <label className="block text-gray-700">Upload Images</label>
            <div className="flex gap-2 flex-wrap">
              <label className="cursor-pointer w-24 h-24 flex items-center justify-center flex-col mt-1 bg-gray-700 rounded-lg text-white hover:bg-gray-900">
                <b>Upload</b>
                <input type='file' className="w-full h-full hidden" onChange={uploadImages} />
                <b>Images</b>
              </label>
              <div>
                {images.length > 0 && images.map((link, index) => (
                  <div key={index} className="my-2 h-24 w-24 inline-block">
                    <Image src={link} alt={`Image ${index}`} className="max-height-100% rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Select Property Values */}
          {properties && Object.keys(properties).length > 0 && Object.keys(properties).map((p, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-1/2">
                <div>{p}</div>
              </div>
              <div className="w-1/2">
                <Select
                  value={properties[p] || ''}
                  onValueChange={value => setProperties(prev => ({ ...prev, [p]: value }))}
                >
                  <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500">
                    <SelectValue placeholder="Select a Value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{p} Values</SelectLabel>
                      {Array.isArray(properties[p]) && properties[p].map((v: string, idx: number) => (
                        <SelectItem key={idx} value={v}>{v}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          {/* Select Genre */}
          <div>
            <label className="block text-gray-700">Genre</label>
            <Select
              value={cGenre}
              onValueChange={value => setCGenre(value)}
            >
              <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500">
                <SelectValue placeholder="Select a Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Genres</SelectLabel>
                  {genres.map(genre => (
                    <SelectItem key={genre._id} value={genre.name}>{genre.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="bg-gray-700 text-white w-full px-4 py-2 rounded-md hover:bg-gray-800">Submit</Button>
        </form>
      </div>
    </div>
  );
}
