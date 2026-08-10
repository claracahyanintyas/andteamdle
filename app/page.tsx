import Navbar from "@/app/components/Navbar"
import GameLoader from "./components/GameLoader";
export default function Home() {
  return (
    <div className="w-full flex flex-col flex-1 font-sans">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center mx-auto">
        <GameLoader />
      </div>
    </div>
  );
}