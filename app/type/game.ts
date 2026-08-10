export type AnswerStatus = 'correct' | 'incorrect' | 'higher' | 'lower'

export interface GuessResult {
  title_status: AnswerStatus
  album_status: AnswerStatus
  mv_status: AnswerStatus
  song_date_status: AnswerStatus
  starter_status: AnswerStatus
  language_status: AnswerStatus
  guessed_title: string
  guessed_album: string
  guessed_album_picture: string | null
  guessed_has_mv: boolean
  guessed_release_date: string
  guessed_starter: string
  guessed_starter_picture: string | null
  guessed_language: string
  is_correct: boolean
}

export interface AnswerReveal {
  song_title: string
  album_title: string
  album_picture: string | null
  release_date: string
  starter_name: string
  starter_picture: string | null
  language: string
}