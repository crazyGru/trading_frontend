'use client'

import { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

const SignupForm = () => {
  const { toast } = useToast()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [gender, setGender] = useState('')

  const BASE_URL =process.env.BASE_URL|| 'http://localhost:5001';  // Update this to your backend's base URL
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, {
        fullName,
        username,
        password,
        confirmPassword,
        email,
        walletAddress,
        gender
      })
      toast({
        title: 'Signup successful',
        description: response.data.message,
        className: "bg-green-600 text-white"
      })
      console.log(response)
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error.response?.data?.message || error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex items-center justify-center  max-h-screen  p-4 ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl ">
        <h2 className="text-3xl font-bold mb-6 text-center">Signup</h2>
        <form onSubmit={handleSubmit} className="flex flex-col min-w-3xl space-y-4">
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="p-3 border rounded"/>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="p-3 border rounded"/>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-3 border rounded"/>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="p-3 border rounded"/>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="p-3 border rounded"/>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="p-3 border rounded">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="Wallet Address" className="p-3 border rounded"/>
          <button type="submit" className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600">Signup</button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600">Already have an account? <Link href="/auth/login" className="text-blue-500 hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default SignupForm
