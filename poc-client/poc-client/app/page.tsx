'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const handleLoginRequest = () => {
    console.log('Sending login request')

  axios.get('http://localhost:8000/auth/login/no-redirect', {
  })
    .then(function (response) {
      console.log(response.data.url);
      router.push(response.data.url, { scroll: false })
    }).catch(() => {
      console.log('Request failed');
    })
  }

  return (
    <main >
      <button onClick={handleLoginRequest}>Login button</button>
    </main>
  );
}