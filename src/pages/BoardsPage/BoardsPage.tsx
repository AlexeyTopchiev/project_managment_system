import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Board, ErrorResponse } from "./types"
import styles from "./BoardsPage.module.scss"

const BoardsPage = () => {
  const [boards, setBoards] = useState<Board[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ErrorResponse | null>(null)

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("http://localhost:8080/api/v1/boards")

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json()
          throw {
            error: errorData.error || "Ошибка сервера",
            message: errorData.message || "Не удалось загрузить проекты"
          }
        }

        const data = await response.json()
        setBoards(data.data)
      } catch (err) {
        if (typeof err === "object" && err !== null && "message" in err) {
          setError(err as ErrorResponse)
        } else {
          setError({
            error: "Неизвестная ошибка",
            message: "Произошла непредвиденная ошибка"
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchBoards()
  }, [])

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка проектов...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Ошибка загрузки проектов</h3>
        <p className={styles.errorTitle}>{error.error}</p>
        <p className={styles.errorMessage}>{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className={styles.boardsPage}>
      <div className={styles.boardsGrid}>
        {boards.map(board => (
          <div key={board.id} className={styles.boardCard}>
            <div className={styles.boardContent}>
              <h3 className={styles.boardName}>{board.name}</h3>
              <p className={styles.boardDescription}>{board.description}</p>
              <div className={styles.taskCount}>
                Задач: <span>{board.taskCount}</span>
              </div>
            </div>
            <Link to={`/board/${board.id}`} className={styles.viewBoardButton}>
              Перейти к доске →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BoardsPage
