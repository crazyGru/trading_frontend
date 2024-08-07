'use client'

import { useState } from 'react'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LoginForm = ({ setUser }) => {
  const { toast } = useToast()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const BASE_URL =process.env.BASE_URL|| 'http://localhost:5001';  // Update this to your backend's base URL
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, { username, password }, { withCredentials: true })
      toast({
        title: 'Login ',
        description: response.data.message,
        className: 'bg-green-600 text-white'
      })
      router.push('/')
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex flex-col items-center w-full justify-center min-h-screen">
      <div className="w-full max-w-md p-8  bg-white border rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="mb-3 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-3 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors">
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <p>Don't have an account? <Link href="/auth/signup" className="text-blue-500 hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
