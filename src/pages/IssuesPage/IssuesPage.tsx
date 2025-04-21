// IssuesPage.tsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "./IssuesPage.module.scss"

interface AssignedUserForTask {
  id: number
  avatarUrl: string
  email: string
  fullName: string
}

interface Task {
  id: number
  title: string
  description: string
  status: "Backlog" | "InProgress" | "Done"
  priority: "Low" | "Medium" | "High"
  boardId: number
  boardName: string
  assignee: AssignedUserForTask | null
}

interface ApiResponse {
  data: Task[]
}

interface ErrorResponse {
  error: string
  message: string
}

const IssuesPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("http://localhost:8080/api/v1/tasks")

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json()
          throw new Error(
            errorData.message || errorData.error || "Failed to fetch tasks"
          )
        }

        const data: ApiResponse = await response.json()
        setTasks(data.data)
      } catch (err) {
        const error = err as Error
        setError(error.message)
        console.error("Fetch error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter ? task.status === statusFilter : true
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading tasks...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Error loading tasks</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className={styles.issuesPage}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search tasks..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Backlog">Backlog</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className={styles.tasksList}>
        {filteredTasks.map(task => (
          <div key={task.id} className={styles.taskCard}>
            <div className={styles.taskContent}>
              <div className={styles.taskHeader}>
                <h3>{task.title}</h3>
                <div className={styles.taskMeta}>
                  <span
                    className={`${styles.status} ${
                      styles[task.status.toLowerCase()]
                    }`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`${styles.priority} ${
                      styles[task.priority.toLowerCase()]
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
              <p className={styles.description}>{task.description}</p>

              <div className={styles.taskFooter}>
                <div className={styles.boardInfo}>
                  <span>Board: </span>
                  <Link
                    to={`/board/${task.boardId}`}
                    className={styles.boardLink}
                  >
                    {task.boardName}
                  </Link>
                </div>

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
              </div>
            </div>
            <Link to={`/tasks/${task.id}`} className={styles.viewButton}>
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IssuesPage
