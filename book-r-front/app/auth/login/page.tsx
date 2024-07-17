'use client';

import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";

export default function SignIn() {
  const router = useRouter();

  const handleSignInGoogle = async () => {
    const result = await signIn("google", {
      callbackUrl: "/book",
    });
    if (result?.error) {
      console.error(result.error);
    }
  };

  const handleSignInResend = async (email: any) => {
    const result = await signIn("resend", {
      email,
      callbackUrl: "/",
    });
    if (result?.error) {
      console.error(result.error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    if (email) {
      await handleSignInResend(email.toString());
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-red-50">
      <div className="p-6 max-w-md w-full bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>
        <Button
          onClick={handleSignInGoogle}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Sign In with Google
        </Button>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex items-center justify-center p-2 font-mono">OR</div>
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Sign In with Resend
          </button>
        </form>
      </div>
    </div>
  );
}
