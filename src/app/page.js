"use client"
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { LoaderCircle } from "lucide-react";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        router.push("/dashboard");
      }else{
        router.push("/login");
      }
    }
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-neutral-900 gap-4">
      <LoaderCircle color="white" className='animate-spin'/>
    </div>
  );
}
