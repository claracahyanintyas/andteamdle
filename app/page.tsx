import Image from "next/image";
import Navbar from "@/app/components/Navbar"

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <Navbar></Navbar>
    <div className='mx-auto'>
        <table className='table-auto align-middle mx-auto border-separate border'>
          <thead>
            <tr className='justify-items-center text-center bg-primary'>
                <th className='p-4'>Album</th>
                <th className='p-4'>Song Title</th>
                <th className='p-4'>Official MV</th>
                <th className='p-4'>Release Date</th>
                <th className='p-4'>Song Starter</th>
                <th className='p-4'>Language</th>
            </tr>
            </thead>
        </table>
    </div>
    </div>
  );
}
