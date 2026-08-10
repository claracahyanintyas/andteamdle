import Navbar from "@/app/components/Navbar"
import { getOrCreateTodaysSession, getSongsForGroup, getSessionAttempts } from '@/app/actions/game'
import GuessForm from "./components/GuessForm";
import GameLoader from "./components/GameLoader";

export default async function Home() {
  // const { success, error, session } = await getOrCreateTodaysSession()

  // if (!success || !session) {
  //   return <div>Error loading today&apos;s puzzle: {error}</div>
  // }

  // const [{ songs }, { guesses }] = await Promise.all([
  //   getSongsForGroup(), // defaults to &TEAM
  //   getSessionAttempts(session.id),
  // ])

  return (
    <div className="w-full flex flex-col flex-1 items-center justify-center font-sans">
      <Navbar></Navbar>
      <div className='mx-auto'>
        <GameLoader></GameLoader>
        {/* <GuessForm sessionId={session.id} songs={songs} initialGuesses={guesses} isCompleted={session.is_completed} /> */}
      </div>
    </div>
  );
}