"use client"
import { Button } from '../../components/ui/button'
import React, { useState } from 'react'
import { auth } from "../../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { logout } from "../../hooks/auth";
import { LoaderCircle } from 'lucide-react';

export default function Login() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      fetch('http://localhost:3001/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleUid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          photo: result.user.photoURL,
        })
      }).then(
        (response) => {
          if (response.ok) {
            router.push("/home");
            console.log("Usuário cadastrado com sucesso");
            localStorage.setItem("user", JSON.stringify(result.user));
          } else {
            alert("Erro ao cadastrar usuário");
            console.error(response);
          }
        }
      );
    } catch (err) {
      alert("Erro no login: " + err.message);
    }
  };

  const handleLogout = async () => {
    await logout(auth);
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-neutral-900 gap-4">
      {
        user ? (
          <LoaderCircle className='animate-spin'/>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-white text-xl font-semibold">Não está logado</h1>
            <Button onClick={login}variant={"outline"} >Login</Button>
          </div>
        )
      }
    </div>
  )
}