

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const [position, setPosition] = useState("");
  const [seniority, setSeniority] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.uid) {
      alert("User not found. Please log in again.");
      router.push("/login");
      return;
    }
    const googleUid = user.uid;
    try {
      const response = await fetch(`http://localhost:3001/users/${googleUid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ position, seniority }),
      });
      if (response.ok) {
        router.push("/home");
      } else {
        alert("Failed to update user info.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-neutral-900 gap-4">
      <h1 className="text-white text-2xl font-bold mb-4">Onboarding</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <label className="text-white">
          Position:
          <input
            type="text"
            value={position}
            onChange={e => setPosition(e.target.value)}
            className="mt-1 p-2 w-full rounded bg-neutral-700 text-white border border-neutral-600"
            required
          />
        </label>
        <label className="text-white">
          Seniority:
          <input
            type="text"
            value={seniority}
            onChange={e => setSeniority(e.target.value)}
            className="mt-1 p-2 w-full rounded bg-neutral-700 text-white border border-neutral-600"
            required
          />
        </label>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}