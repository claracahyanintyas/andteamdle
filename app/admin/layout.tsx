import Link from "next/link";
import AdminNavbar from "../components/AdminNavbar";

function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex'>
        <AdminNavbar></AdminNavbar>
        <div>{children}</div>
    </div>
  );
}
export default Page