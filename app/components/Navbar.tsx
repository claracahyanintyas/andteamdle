import Link from 'next/link'
import Image from 'next/image'
import AuthButton from '@/app/components/AuthButton'

export default function Navbar() {
  return (
    <div className='w-screen bg-primary text-xl top-0 fixed'>
      <div className='overflow-x-auto'>
        <nav className='flex items-center justify-between p-2'>
          <div>
            <Link href='/'>
              <Image src='/logo.png' alt='Logo' width={60} height={60} className='rounded-full'/>
            </Link>
          </div>
          <div>
            <AuthButton />
          </div>
        </nav>
      </div>
    </div>
  )
}