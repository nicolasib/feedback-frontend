import React from 'react'
import { auth } from '../../lib/firebase';
import { logout } from '../../hooks/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleLogout = async () => {
    await logout(auth);
    router.push("/");
  };
  return (
    <div>
      <h1>Hello World</h1>
      <p>Welcome to my website!</p>
      <Button variant={'destructive'} onClick={handleLogout}>Logout</Button>
    </div>
  )
}