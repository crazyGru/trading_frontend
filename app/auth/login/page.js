import LoginForm from '@/components/Login'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center w-full bg-[url('/bg.jpg')] h-screen">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
    </div>
  )
}
