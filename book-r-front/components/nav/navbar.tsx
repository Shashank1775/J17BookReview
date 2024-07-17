'use client'

import Link from "next/link";
import { useSession } from "next-auth/react"


export default function NavBar({children} : {children: React.ReactNode}) {
    const { data: session, status } = useSession();
    const clientName = session?.user?.name || 'Guest';

    return (
        <div className="bg-gray-200">
            <div className="bg-gray-200 text-black flex items-center h-16 px-4 gap-4 shadow-md">
                <h1 className="text-xl font-bold">QbBookReview</h1>
                <nav className="flex gap-4">
                    <Link href="/" className="text-gray-900 hover:text-gray-400 transition-colors duration-200">Home</Link>
                    <Link href="/book" className="text-gray-900 hover:text-gray-400 transition-colors duration-200">Books</Link>
                    <Link href="/review" className="text-gray-900 hover:text-gray-400 transition-colors duration-200">Review</Link>
                    <Link href="/lists" className="text-gray-900 hover:text-gray-400 transition-colors duration-200">Lists</Link>
                    <Link href="/about" className="text-gray-900 hover:text-gray-400 transition-colors duration-200">About</Link>
                    <Link href="/settings" className="text-gray-900 hover:text-gray-400 transition-colors duration-200">Settings</Link>
                </nav>
                {session ? (
                    <div className="ml-auto">
                        <p>Welcome, {clientName}</p>
                    </div>
                ) : (
                    <div className="ml-auto">
                        <Link href="/auth/login" className="text-gray-900 hover:text-gray-400 transition-colors duration-200">Sign In</Link>
                    </div>
                )}
            </div>
            <div className="bg-neutral-100 overflow-y-auto h-screen">
                {children}
            </div>
        </div>
    );
}
