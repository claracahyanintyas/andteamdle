'use client'

import { useState } from 'react'
import { submitGuess } from '@/app/actions/game'
import type { GuessResult, AnswerStatus } from '@/app/type/game'
import EndGameModal from './EndGameModal'

interface Song {
  id: number
  title: string
}

// higher/lower always show yellow, regardless of the status enum's other colors
function statusColor(status: AnswerStatus) {
  if (status === 'correct') return 'bg-green-500'
  if (status === 'higher' || status === 'lower') return 'bg-yellow-500'
  return 'bg-red-500'
}

function dateArrow(status: AnswerStatus) {
  if (status === 'higher') return ' ↓' // guessed song is later than the answer
  if (status === 'lower') return ' ↑' // guessed song is earlier than the answer
  return ''
}

export default function GuessForm({
  sessionId,
  songs,
  initialGuesses,
  isCompleted,
}: {
  sessionId: string
  songs: Song[]
  initialGuesses: GuessResult[]
  isCompleted: boolean
}) {
  const [inputValue, setInputValue] = useState('')
  // history comes back oldest-first from the DB; show newest guess at the top
  const [guesses, setGuesses] = useState<GuessResult[]>([...initialGuesses].reverse())
  const [completed, setCompleted] = useState(isCompleted)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGuess = async () => {
    const matched = songs.find(
      (s) => s.title.toLowerCase() === inputValue.trim().toLowerCase()
    )

    if (!matched) {
      setError('Pick a song from the list')
      return
    }

    setError(null)
    setIsSubmitting(true)

    const { success, error: submitError, result } = await submitGuess(sessionId, matched.id)

    setIsSubmitting(false)

    if (!success || !result) {
      setError(submitError ?? 'Something went wrong')
      return
    }

    setGuesses((prev) => [result, ...prev])
    setCompleted(result.is_completed)
    setInputValue('')

    if (result.is_completed) {
      setShowModal(true)
    }
  }

  return (
    <div className="mx-auto my-4 w-full max-w-2xl px-2">
      {!completed && (
        <div className="flex gap-2 mb-4">
          <input
            list="song-options"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a song title..."
            className="bg-accent rounded-sm text-primary p-2 flex-1 min-w-0 text-sm sm:text-base"
          />
          <datalist id="song-options">
            {songs.map((song) => (
              <option key={song.id} value={song.title} />
            ))}
          </datalist>
          <button
            onClick={handleGuess}
            disabled={isSubmitting || !inputValue}
            className="px-3 sm:px-4 py-2 bg-primary rounded-sm shrink-0 text-sm sm:text-base"
          >
            {isSubmitting ? 'Guessing...' : 'Guess'}
          </button>
        </div>
      )}

      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

      <div className="overflow-x-auto">
        <table className="table-auto align-middle mx-auto border-separate border text-xs sm:text-base w-full">
          <thead>
            <tr className="justify-items-center text-center bg-primary">
              <th className="p-1 sm:p-4">Album</th>
              <th className="p-1 sm:p-4">Song Title</th>
              <th className="p-1 sm:p-4">Official MV</th>
              <th className="p-1 sm:p-4">Release Date</th>
              <th className="p-1 sm:p-4">Language</th>
            </tr>
          </thead>
          <tbody>
            {guesses.map((g, i) => (
              <tr key={i} className="text-center">
                <td className={`p-1 sm:p-4 ${statusColor(g.album_status)}`}>
                  {g.guessed_album_picture && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={g.guessed_album_picture}
                      alt={g.guessed_album}
                      className="w-8 h-8 sm:w-12 sm:h-12 object-cover mx-auto mb-1 rounded"
                    />
                  )}
                  {g.guessed_album}
                </td>
                <td className={`p-1 sm:p-4 ${statusColor(g.title_status)}`}>{g.guessed_title}</td>
                <td className={`p-1 sm:p-4 ${statusColor(g.mv_status)}`}>{g.guessed_has_mv ? 'Yes' : 'No'}</td>
                <td className={`p-1 sm:p-4 ${statusColor(g.song_date_status)}`}>
                  {g.guessed_release_date}{dateArrow(g.song_date_status)}
                </td>
                <td className={`p-1 sm:p-4 ${statusColor(g.language_status)}`}>{g.guessed_language}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {completed && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-primary rounded-sm font-bold"
          >
            View result
          </button>
        </div>
      )}

      {showModal && (
        <EndGameModal
          sessionId={sessionId}
          isCorrect={guesses[0]?.is_correct ?? false}
          attemptsUsed={guesses.length}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}