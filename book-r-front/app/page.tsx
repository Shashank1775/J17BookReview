'use client'

import NavBar from "@/components/nav/navbar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import HeroSection from "@/components/nav/heroSection";
import FeaturedSectionCard from "@/components/nav/featuredSectionCard";
import Footer from "@/components/nav/newletterFooter";
import { useRouter } from "next/navigation";

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const router = useRouter()

  useEffect(() => {
    axios.get('/api/bookID').then(response => {
      setBooks(response.data);
    });
  }, []);

  return (
    <div>
      <NavBar>
        <div>
          <div className="flex flex-col items-center justify-center p-20 font-mono">
            <h1 className="text-6xl"><b>Create,Review,Dominate</b></h1>
            <h2 className="mt-4 text-2xl">Make QuizBowl easy using QbBookReview</h2>
            <div className="mt-8 gap-4">
              <Button className="bg-gray-900" onClick={()=>router.push('/lists')}>Get Started</Button>
              <Button className="bg-clear ml-4 text-gray-900 hover:bg-gray-300" onClick={()=>router.push('/about')}>Learn More</Button>
            </div>
            <div className="mt-4 text-5xl">
            </div>
          </div>
        </div>
        <div>
          <div className="mr-auto">
            <HeroSection />
          </div>
        </div>
        <div className="flex items-center justify-center mt-8 font-mono">
          <h1 className="text-3xl pb-2">Todays Featured: </h1>
        </div>
        <div className="flex justify-center gap-2 pb-4">
          {books.slice(-5).map(book => (
            <div key={book.id} className='w-screen'>
              <FeaturedSectionCard
                title={book.title}
                author={book.author}
                year={book.year}
                description={book.description}
                cover={book.cover}
              />
            </div>
          ))}
        </div>
        <div>
        </div>
      </NavBar>
    </div>
  );
}
