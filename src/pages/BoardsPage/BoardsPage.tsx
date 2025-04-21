import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "./BoardsPage.module.scss"

interface Board {
  id: number
  name: string
  description: string
  taskCount: number
}

// interface ErrorResponse {
//   error: string;
//   message: string;
// }

const BoardsPage = () => {
  const [boards, setBoards] = useState<Board[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("http://localhost:8080/api/v1/boards")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Не удалось загрузить проекты")
        }
        const data = await response.json()
        setBoards(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка")
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
        <p>{error}</p>
      </div>
    )
  }
  return (
    <div className={styles.boardsPage}>
      <div className={styles.pageHeader}>
        <h1>Проекты</h1>
        <div className={styles.headerActions}>
          <span className={styles.totalBoards}>
            Всего проектов: {boards.length}
          </span>
        </div>
      </div>
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
