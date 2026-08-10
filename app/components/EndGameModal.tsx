'use client'

import { useEffect, useState } from 'react'
import { getAnswerReveal } from '@/app/actions/game'
import type { AnswerReveal } from '@/app/type/game'

export default function EndGameModal({
  sessionId,
  isCorrect,
  attemptsUsed,
  onClose,
}: {
  sessionId: string
  isCorrect: boolean
  attemptsUsed: number
  onClose: () => void
}) {
  const [answer, setAnswer] = useState<AnswerReveal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { answer } = await getAnswerReveal(sessionId)
      setAnswer(answer)
      setLoading(false)
    }
    load()
  }, [sessionId])

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-secondary rounded-lg p-6 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()} // don't close when clicking inside the card
      >
        <h2 className="text-2xl font-bold mb-2">
          {isCorrect ? 'You got it! 🎉' : 'Out of guesses'}
        </h2>
        <p className="mb-4 opacity-80">
          {isCorrect ? `Solved in ${attemptsUsed} ${attemptsUsed === 1 ? 'try' : 'tries'}` : `Better luck tomorrow!`}
        </p>

        {loading && <p>Loading answer...</p>}

        {answer && (
          <div className="flex flex-col items-center gap-2 mb-4">
            {answer.album_picture && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={answer.album_picture}
                alt={answer.album_title}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <p className="font-bold text-lg">{answer.song_title}</p>
            <p className="text-sm opacity-75">{answer.album_title}</p>
            <p className="text-sm opacity-75">{answer.release_date}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary rounded-sm"
        >
          Close
        </button>
      </div>
    </div>
  )
}