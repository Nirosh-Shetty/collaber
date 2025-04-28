"use client";
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";
const page = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
        {}, // no body for logout
        {
          withCredentials: true, // Important for cookies/session handling
        }
      );

      // If successful, navigate
      router.push("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <>
      <div className="text-red text-9xl">Dashboaf rd</div>;
      <button
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
        onClick={handleLogout}
      >
        Logout
      </button>
    </>
  );
};

export default page;
