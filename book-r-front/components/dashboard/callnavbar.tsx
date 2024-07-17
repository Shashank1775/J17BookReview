// components/CallNavbar.tsx

import Nav from "./navbar";
import React from 'react'

interface CallNavbarProps {
    children: React.ReactNode;
}

export default function CallNavbar({ children }: CallNavbarProps) {
    return (
        <div className="bg-red-50 w-screen h-screen text-black flex">
            <Nav></Nav>
            <div className="ml-4 p-4">
                {children}
            </div>
        </div>
    );
}
