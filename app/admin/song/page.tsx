import SongTable from "@/app/components/SongTable";
import { SongWithRelations } from "@/app/type/song";
import { createClient } from "@/app/utils/supabase/server";

export default async function SongPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('songs')
    .select(`*, album(*), artist(*)`)
  
  const songs = (data as SongWithRelations[]) ?? []

  return (
    <div className='flex'>
      <div className="text-lg font-medium text-center text-body border-b border-default">
        <SongTable songs={songs} />
      </div>
    </div>
  )
}