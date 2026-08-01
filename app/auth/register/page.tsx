import RegisterForm from '@/app/components/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="w-screen flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}