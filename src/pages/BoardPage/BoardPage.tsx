import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import styles from "./BoardPage.module.scss"

interface Assignee {
  id: number
  avatarUrl: string
  email: string
  fullName: string
}

interface Task {
  id: number
  title: string
  description: string
  priority: "Low" | "Medium" | "High"
  status: "Backlog" | "InProgress" | "Done"
  assignee: Assignee | null
}

interface ErrorResponse {
  error: string
  message: string
}

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>()
  const [tasks, setTasks] = useState<Task[]>([])
  const [boardName, setBoardName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ErrorResponse | null>(null)

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

  console.log("tasks", tasks)
  console.log("groupedTasks", groupedTasks)

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
          <Link
            to={`/board/${boardId}/create-task`}
            className={styles.createButton}
          >
            Создать задачу
          </Link>
          <Link to="/boards" className={styles.backLink}>
            Все проекты
          </Link>
        </div>
      </div>

      <div className={styles.taskColumns}>
        {/* Колонка Backlog (To Do) */}
        <div className={styles.taskColumn}>
          <h3 className={styles.columnHeader}>To Do</h3>
          <div className={styles.tasksList}>
            {groupedTasks.Backlog.map(task => (
              <TaskCard key={task.id} task={task} boardId={boardId!} />
            ))}
          </div>
        </div>

        {/* Колонка InProgress */}
        <div className={styles.taskColumn}>
          <h3 className={styles.columnHeader}>In Progress</h3>
          <div className={styles.tasksList}>
            {groupedTasks.InProgress.map(task => (
              <TaskCard key={task.id} task={task} boardId={boardId!} />
            ))}
          </div>
        </div>

        {/* Колонка Done */}
        <div className={styles.taskColumn}>
          <h3 className={styles.columnHeader}>Done</h3>
          <div className={styles.tasksList}>
            {groupedTasks.Done.map(task => (
              <TaskCard key={task.id} task={task} boardId={boardId!} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface TaskCardProps {
  task: Task
  boardId: string
}

const TaskCard = ({ task, boardId }: TaskCardProps) => {
  return (
    <div className={styles.taskCard}>
      <div className={styles.taskHeader}>
        <h4>{task.title}</h4>
        <div className={styles.taskMeta}>
          <span
            className={`${styles.priority} ${
              styles[task.priority.toLowerCase()]
            }`}
          >
            {task.priority}
          </span>
        </div>
      </div>
      <p className={styles.taskDescription}>{task.description}</p>

      {task.assignee && (
        <div className={styles.assignee}>
          <img
            src={task.assignee.avatarUrl || "/default-avatar.png"}
            alt={task.assignee.fullName}
            className={styles.avatar}
          />
          <span>{task.assignee.fullName}</span>
        </div>
      )}

      <Link
        to={`/board/${boardId}/task/${task.id}`}
        className={styles.viewButton}
      >
        Подробнее →
      </Link>
    </div>
  )
}

export default BoardPage

// import { useState, useEffect } from "react"
// import { Link, useParams } from "react-router-dom"
// import styles from "./BoardPage.module.scss"

// interface Assignee {
//   id: number
//   avatarUrl: string
//   email: string
//   fullName: string
// }

// interface Task {
//   id: number
//   title: string
//   description: string
//   priority: "Low" | "Medium" | "High"
//   status: "Backlog" | "InProgress" | "Done"
//   assignee: Assignee | null
// }

// // interface BoardResponse {
// //   id: number
// //   name: string
// //   description: string
// //   tasks: Task[]
// // }

// interface ErrorResponse {
//   error: string
//   message: string
// }

// const BoardPage = () => {
//   const { boardId } = useParams<{ boardId: string }>()
//   const [boardData, setBoardData] = useState<Task[] | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<ErrorResponse | null>(null)

//   useEffect(() => {
//     const fetchBoardData = async () => {
//       try {
//         setIsLoading(true)
//         setError(null)

//         const response = await fetch(
//           `http://localhost:8080/api/v1/boards/${boardId}`
//         )

//         if (!response.ok) {
//           const errorData: ErrorResponse = await response.json()
//           throw {
//             error: errorData.error || "Ошибка загрузки доски",
//             message: errorData.message || "Не удалось загрузить данные доски"
//           }
//         }

//         const data = await response.json()
//         setBoardData(data.data) // Сохраняем все данные доски, включая задачи
//       } catch (err) {
//         if (typeof err === "object" && err !== null && "message" in err) {
//           setError(err as ErrorResponse)
//         } else {
//           setError({
//             error: "Неизвестная ошибка",
//             message: "Произошла непредвиденная ошибка"
//           })
//         }
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchBoardData()
//   }, [boardId])

//   if (isLoading) {
//     return (
//       <div className={styles.loadingContainer}>
//         <div className={styles.spinner}></div>
//         <p>Загрузка данных доски...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className={styles.errorContainer}>
//         <h3>{error.error}</h3>
//         <p>{error.message}</p>
//         <div className={styles.errorActions}>
//           <button
//             onClick={() => window.location.reload()}
//             className={styles.retryButton}
//           >
//             Попробовать снова
//           </button>
//           <Link to="/boards" className={styles.backButton}>
//             Вернуться к списку досок
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className={styles.boardPage}>
//       <div className={styles.pageHeader}>
//         <div className={styles.headerContent}>
//           {/* <h1>{boardData?.name}</h1>
//           <p className={styles.boardDescription}>{boardData?.description}</p> */}
//         </div>
//         <div className={styles.headerActions}>
//           <Link
//             to={`/board/${boardId}/create-task`}
//             className={styles.createButton}
//           >
//             Создать задачу
//           </Link>
//           <Link to="/boards" className={styles.backLink}>
//             Все проекты
//           </Link>
//         </div>
//       </div>

//       <div className={styles.tasksContainer}>
//         <h2 className={styles.tasksTitle}>
//           {/* Все задачи ({boardData?.tasks?.length || 0}) */}
//         </h2>
//         <div className={styles.tasksList}>
//           {boardData?.map(task => (
//             <TaskCard key={task.id} task={task} boardId={boardId!} />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// interface TaskCardProps {
//   task: Task
//   boardId: string
// }

// const TaskCard = ({ task, boardId }: TaskCardProps) => {
//   return (
//     <div className={styles.taskCard}>
//       <div className={styles.taskHeader}>
//         <h4>{task.title}</h4>
//         <div className={styles.taskMeta}>
//           <span
//             className={`${styles.status} ${styles[task.status.toLowerCase()]}`}
//           >
//             {task.status}
//           </span>
//           <span
//             className={`${styles.priority} ${
//               styles[task.priority.toLowerCase()]
//             }`}
//           >
//             {task.priority}
//           </span>
//         </div>
//       </div>
//       <p className={styles.taskDescription}>{task.description}</p>

//       {task.assignee && (
//         <div className={styles.assignee}>
//           <img
//             src={task.assignee.avatarUrl || "/default-avatar.png"}
//             alt={task.assignee.fullName}
//             className={styles.avatar}
//           />
//           <span>{task.assignee.fullName}</span>
//         </div>
//       )}

//       <Link
//         to={`/board/${boardId}/task/${task.id}`}
//         className={styles.viewButton}
//       >
//         Подробнее →
//       </Link>
//     </div>
//   )
// }

// export default BoardPage
