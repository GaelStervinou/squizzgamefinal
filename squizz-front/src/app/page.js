'use client';

import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

export default function Home() {
  const [userToken, setUserToken] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  useEffect(() => {
    setUserToken(localStorage.getItem('token'));
  }, []);
  useEffect(() => {
    if (userToken) {
      setDecodedToken(jwtDecode(userToken));
    }
  }, [userToken]);
  return <>
    {!userToken && <Link href="/login">Se connecter</Link>}
    {decodedToken && decodedToken.role === 'teacher' &&
      <div>
        <Link href="/quizz/create">Créer un quizz</Link>
        <Link href="/quizz/list">Voir mes quizz</Link>
        <Link href="/logout">Se déconnecter</Link>
      </div>
    }
    {decodedToken && decodedToken.role === 'student' &&
      <div>
        <Link href="/quizz/play">Jouer</Link>
        <Link href="/logout">Se déconnecter</Link>
      </div>
    }
  </>;
}
