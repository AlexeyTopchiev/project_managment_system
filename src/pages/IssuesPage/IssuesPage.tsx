import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import CreateIssueButton from "../../features/issues/CreateIssueButton/"
import IssueFormModal from "../../features/issues/IssueFormModal/IssueFormModal" // Импортируем модалку редактирования
import { Task, ApiResponse, ErrorResponse } from "./types"
import styles from "./IssuesPage.module.scss"

const IssuesPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [assigneeSearch, setAssigneeSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [boardFilter, setBoardFilter] = useState<string>("")
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

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

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsEditModalOpen(true)
  }

  const handleTaskUpdated = () => {
    // Обновляем список задач после редактирования
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/tasks")
        if (!response.ok) throw new Error("Failed to fetch tasks")
        const data: ApiResponse = await response.json()
        setTasks(data.data)
      } catch (err) {
        console.error("Error refreshing tasks:", err)
      }
    }
    fetchTasks()
    setIsEditModalOpen(false)
  }

  // Получаем уникальные доски для фильтра
  const uniqueBoards = Array.from(new Set(tasks.map(task => task.boardId))).map(
    boardId => {
      const task = tasks.find(t => t.boardId === boardId)
      return {
        id: boardId,
        name: task?.boardName || `Board ${boardId}`
      }
    }
  )

  const filteredTasks = tasks.filter(task => {
    // Поиск по названию и описанию задачи
    const matchesSearch = searchTerm
      ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true

    // Поиск по исполнителю
    const matchesAssignee = assigneeSearch
      ? task.assignee?.fullName
          .toLowerCase()
          .includes(assigneeSearch.toLowerCase())
      : true

    // Фильтр по статусу
    const matchesStatus = statusFilter ? task.status === statusFilter : true

    // Фильтр по доске
    const matchesBoard = boardFilter
      ? task.boardId === Number(boardFilter)
      : true

    return matchesSearch && matchesAssignee && matchesStatus && matchesBoard
  })

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка задач...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Ошибка загрузки задач</h3>
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
          placeholder="Название/описание задачи"
          className={styles.searchInput}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <input
          type="text"
          placeholder="Исполнитель"
          className={styles.searchInput}
          value={assigneeSearch}
          onChange={e => setAssigneeSearch(e.target.value)}
        />

        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="Backlog">Backlog</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select
          className={styles.filterSelect}
          value={boardFilter}
          onChange={e => setBoardFilter(e.target.value)}
        >
          <option value="">Все доски</option>
          {uniqueBoards.map(board => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
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
                  <span>Доска: </span>
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
            <div
              className={styles.viewButton}
              onClick={() => handleTaskClick(task)}
            >
              Подробнее →
            </div>
          </div>
        ))}
      </div>
      <div className={styles.bottomActions}>
        <CreateIssueButton />
      </div>

      {/* Модальное окно редактирования */}
      {selectedTask && (
        <IssueFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={selectedTask}
          taskId={selectedTask.id}
          currentBoardId={selectedTask.boardId}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  )
}

export default IssuesPage
