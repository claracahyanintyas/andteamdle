import React from 'react'
import { Song, SongWithRelations } from '../type/song'

export default function SongTable({songs} : {songs : SongWithRelations[]}) {
  return (
    <div className='flex flex-col flex-1 items-center justify-center'>
        <table className='table-auto align-middle mx-auto border-separate border'>
            <thead>
                <tr>
                    <th>id</th>
                    <th>title</th>
                    <th>language</th>
                    <th>album</th>
                    <th>music video</th>
                    <th>release date</th>
                    <th>starter</th>
                    <th>artist</th>
                    <th>edit</th>
                    <th>delete</th>
                </tr>
            </thead>
            <tbody>
                {songs.map((song) => (
                    <tr key={song.id}>
                        <td>{song.id}</td>
                        <td>{song.language}</td>
                        <td>{song.album.title}</td>
                        <td>{song.has_mv}</td>
                        <td>{song.release_date}</td>
                        <td>{song.starter.name}</td>
                        <td>{song.artist.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}
