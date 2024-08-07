import SignupForm from '@/components/Signup'

export default function SignupPage() {
  return (
    <div className="flex w-full items-center bg-[url('/bg.jpg')] justify-center h-screen">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  )
}
