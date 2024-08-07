'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'

const CreditManagement = ({ user, setUser }) => {
  const { toast } = useToast()
  const [credits, setCredits] = useState(user.credits)
  const [qrCode, setQrCode] = useState('')
  const BASE_URL =process.env.BASE_URL|| 'http://localhost:5001';  // Update this to your backend's base URL
  const initiatePayment = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/initiate-payment`, {}, { withCredentials: true })
      setQrCode(response.data.qrCodeDataUrl)
      toast({
        title: 'Payment initiated',
        description: 'Please complete the payment using the QR code',
        className: "bg-green-500 text-white"
      })
    } catch (error) {
      toast({
        title: 'Payment initiation failed',
        description: error.response?.data?.message || error.message,
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    setCredits(user.credits)
  }, [user])

  return (
    <div className="flex flex-col items-center">
      <div className="text-white text-xl">{credits}</div>
      {credits === 0 && (
        <>
          <button onClick={initiatePayment} className="bg-blue-500 text-white p-2 rounded-full mb-2">Buy Credits</button>
          {qrCode && <img src={qrCode} alt="QR Code" className="mt-2" />}
        </>
      )}
    </div>
  )
}

export default CreditManagement
