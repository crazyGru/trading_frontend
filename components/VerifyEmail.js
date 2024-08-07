'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchParams, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

const VerifyEmail = () => {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState('')
  const BASE_URL =process.env.BASE_URL|| 'http://localhost:5001';  // Update this to your backend's base URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/verify-email?token=${token}`)
      toast({
        title: 'Email verified',
        description: response.data.message,
        className:"bg-green-600 text-white"
      })
      router.push('/auth/login')
    } catch (error) {
      toast({
        title: 'Email verification failed',
        description: error.response?.data?.message || error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex bg-white flex-col p-4 border rounded">
      <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Verification Token" className="mb-2 p-2 border rounded" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Verify Email</button>
    </form>
  )
}

export default VerifyEmail
