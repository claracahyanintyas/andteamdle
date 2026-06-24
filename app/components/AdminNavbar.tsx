import Link from 'next/link'
import React from 'react'

export default function AdminNavbar() {
  return (
        <div className='h-screen bg-primary text-xl min-w-max'>
            <div className='overflow-y-auto'>
                <nav className='flex flex-col space-y-2 p-2'>
                    <Link href='/admin/song' className='py-2 px-4 mx-2 border-2 bg-secondary rounded-sm hover:text-accent'>Songs</Link>
                    <Link href='/admin/artist' className='py-2 px-4 mx-2 border-2 bg-secondary rounded-sm hover:text-accent'>Artists</Link>
                    <Link href='/admin/album' className='py-2 px-4 mx-2 border-2 bg-secondary rounded-sm hover:text-accent'>Albums</Link>
                </nav>
            </div>
        </div>
  )
}
