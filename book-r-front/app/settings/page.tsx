// pages/settings.js

'use client'; // Assuming this is a comment, otherwise it should be 'use strict';

import NavBar from '../../components/nav/navbar'
import { useSession, signOut } from "next-auth/react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../components/ui/avatar"; // Corrected import path and component name
import { Button } from "../../components/ui/button"; // Corrected import path and component name
import { useState } from 'react';
import axios from 'axios';

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const clientName = session?.user?.name || 'Guest';
    const clientEmail = session?.user?.email || 'Guest';
    const clientImage = session?.user?.image || '/default-avatar.jpg'; // Provide a default image path
    const clientID = session?.user?.id || 'Guest';
    const [popup, setPopup] = useState(false);

    const handleSignOut = async () => {
        await signOut(); // Calls the signOut function from next-auth/react
    };

    function handleDataDelete() {
        setPopup(false);
        axios.delete('/api/delete')
            .then(response => {
                console.log(response.data);
                // Handle success if needed
            })
            .catch(error => {
                console.error('Error deleting data:', error);
                // Handle error if needed
            });
    }

    return (
        <div>
            <NavBar>
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Settings</h1>
                    <div className="bg-white p-4 rounded shadow-lg">
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage src={clientImage} alt={clientName} />
                                <AvatarFallback>{clientName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <h2 className="text-lg font-bold">{clientName}</h2>
                                <p className="text-gray-500">{clientEmail}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-600">ID: {clientID}</p>
                        </div>
                        <Button onClick={handleSignOut} className="mt-4">
                            Logout
                        </Button>
                    </div>
                </div>
                <div className="p-4">
                    <Button onClick={() => setPopup(true)}>
                        Delete All Data
                    </Button>
                </div>
            </NavBar>
            {popup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Are you sure you want to delete all your data?</h2>
                        <span className="flex items-center justify-center">
                            <p className="text-gray-600 mb-4 text-center">This action cannot be undone.</p>
                        </span>
                        <div className="flex justify-center gap-4">
                            <Button className="bg-gray-500" onClick={() => setPopup(false)}>
                                Cancel
                            </Button>
                            <Button className="bg-red-500" onClick={handleDataDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
