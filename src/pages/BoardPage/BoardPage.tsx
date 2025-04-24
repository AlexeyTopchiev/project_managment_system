import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import CreateIssueButton from "../../features/issues/CreateIssueButton/"
import TaskCard from "../../features/board/TaskCard/index"
import { Task, ErrorResponse } from "./types"
import styles from "./BoardPage.module.scss"

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>()
  const [tasks, setTasks] = useState<Task[]>([])
  const [boardName, setBoardName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(
          `http://localhost:8080/api/v1/boards/${boardId}`
        )

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json()
          throw {
            error: errorData.error || "Ошибка загрузки доски",
            message: errorData.message || "Не удалось загрузить данные доски"
          }
        }

        const data = await response.json()
        setBoardName(data.data.name || `Доска ${boardId}`)
        setTasks(data.data || [])
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

    fetchBoardData()
  }, [boardId])

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = async (status: "Backlog" | "InProgress" | "Done") => {
    if (!draggedTask || draggedTask.status === status) {
      setDraggedTask(null)
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/tasks/updateStatus/${draggedTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status })
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        throw {
          error: errorData.error || "Ошибка обновления статуса",
          message: errorData.message || "Не удалось обновить статус задачи"
        }
      }

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === draggedTask.id ? { ...task, status } : task
        )
      )
    } catch (err) {
      console.error("Error updating task status:", err)
    } finally {
      setDraggedTask(null)
    }
  }

  const groupTasksByStatus = () => {
    const grouped = {
      Backlog: [] as Task[],
      InProgress: [] as Task[],
      Done: [] as Task[]
    }

    tasks.forEach(task => {
      grouped[task.status].push(task)
    })

    return grouped
  }

  const groupedTasks = groupTasksByStatus()

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка данных доски...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>{error.error}</h3>
        <p>{error.message}</p>
        <div className={styles.errorActions}>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Попробовать снова
          </button>
          <Link to="/boards" className={styles.backButton}>
            Вернуться к списку досок
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.boardPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1>{boardName}</h1>
        </div>
        <div className={styles.headerActions}>
          <CreateIssueButton />
          <Link to="/boards" className={styles.backLink}>
            Все доски
          </Link>
        </div>
      </div>

      <div className={styles.taskColumns}>
        {/* Колонка Backlog (To Do) */}
        <div
          className={styles.taskColumn}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("Backlog")}
        >
          <h3 className={styles.columnHeader}>To Do</h3>
          <div className={styles.tasksList}>
            {groupedTasks.Backlog.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                boardId={boardId!}
                onDragStart={() => handleDragStart(task)}
              />
            ))}
          </div>
        </div>

        {/* Колонка InProgress */}
        <div
          className={styles.taskColumn}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("InProgress")}
        >
          <h3 className={styles.columnHeader}>In Progress</h3>
          <div className={styles.tasksList}>
            {groupedTasks.InProgress.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                boardId={boardId!}
                onDragStart={() => handleDragStart(task)}
              />
            ))}
          </div>
        </div>

        {/* Колонка Done */}
        <div
          className={styles.taskColumn}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("Done")}
        >
          <h3 className={styles.columnHeader}>Done</h3>
          <div className={styles.tasksList}>
            {groupedTasks.Done.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                boardId={boardId!}
                onDragStart={() => handleDragStart(task)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardPage
