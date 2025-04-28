import { useState, useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { Users, Boards, TaskFormData } from "./types"
import styles from "./IssueFormModal.module.scss"
import { users, boards } from "../../../app/mockData"

interface IssueFormModalProps {
  isCreate?: boolean
  isOpen: boolean
  onClose: () => void
  initialData?: Partial<TaskFormData>
  currentBoardId?: number
  taskId?: number | null
  onTaskUpdated?: () => void
}

interface TaskResponse {
  data: {
    id: number
    title: string
    description: string
    boardId: number
    priority: "Low" | "Medium" | "High"
    status: "Backlog" | "InProgress" | "Done"
    assigneeId: number | null
    assignee: {
      id: number
      fullName: string
      email: string
      avatarUrl: string
    } | null
    boardName: string
  }
}

const IssueFormModal = ({
  isCreate,
  isOpen,
  onClose,
  initialData,
  currentBoardId,
  taskId,
  onTaskUpdated
}: IssueFormModalProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const userList: Users = users
  const boardsList: Boards = boards

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    boardId: currentBoardId || initialData?.boardId || null,
    priority: initialData?.priority || "Medium",
    status: initialData?.status || "Backlog",
    assigneeId: initialData?.assigneeId || null,
    assignee: initialData?.assignee || null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)

  const isFromBoardPage = location.pathname.startsWith("/board/")

  useEffect(() => {
    if (!isOpen) return

    const fetchTaskData = async () => {
      setIsLoadingData(true)
      try {
        if (taskId) {
          const response = await fetch(
            `http://localhost:8080/api/v1/tasks/${taskId}`
          )
          if (!response.ok) {
            throw new Error("Не удалось загрузить данные задачи")
          }
          const data: TaskResponse = await response.json()

          setFormData({
            title: data.data.title,
            description: data.data.description,
            boardId: data.data.boardId,
            priority: data.data.priority,
            status: data.data.status,
            assigneeId: data.data.assignee?.id || data.data.assigneeId,
            assignee: data.data.assignee
          })
        } else if (initialData) {
          setFormData(prev => ({
            ...prev,
            ...initialData,
            boardId: currentBoardId || initialData.boardId || null,
            assigneeId: initialData.assignee?.id || initialData.assigneeId
          }))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки задачи")
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchTaskData()
  }, [taskId, initialData, currentBoardId, isOpen])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    const numericValue =
      name === "boardId" || name === "assigneeId"
        ? value === ""
          ? null
          : Number(value)
        : value

    // Обновляем состояние формы
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: numericValue
      }

      // Если изменяем assigneeId, обновляем также объект assignee
      if (name === "assigneeId") {
        updatedData.assignee =
          userList.data.find(user => user.id === Number(value)) || null
      }

      return updatedData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        boardId: formData.boardId,
        priority: formData.priority,
        assigneeId: formData.assigneeId,
        status: formData.status
      }

      const url = taskId
        ? `http://localhost:8080/api/v1/tasks/update/${taskId}`
        : "http://localhost:8080/api/v1/tasks/create"

      const method = taskId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Ошибка при сохранении задачи")
      }

      onClose()

      if (taskId) {
        onTaskUpdated?.()
      } else {
        const data = await response.json()
        navigate(`/board/${formData.boardId}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка")
    } finally {
      setIsSubmitting(false)
    }
  }

  console.log("formData", formData)
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{taskId ? "Редактирование задачи" : "Создание задачи"}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        {isLoadingData ? (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.taskForm}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Название *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={500}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="boardId">Проект *</label>
              <select
                id="boardId"
                name="boardId"
                // value={formData.boardId ?? ""}
                defaultValue={currentBoardId ?? ""}
                onChange={handleChange}
                // disabled={isFromBoardPage}
                disabled={!isCreate}
              >
                <option value="">Выберите проект</option>
                {boardsList?.data.map(board => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="priority">Приоритет</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Низкий</option>
                  <option value="Medium">Средний</option>
                  <option value="High">Высокий</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="status">Статус</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Backlog">Backlog</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="assigneeId">Исполнитель*</label>
              <select
                id="assigneeId"
                name="assigneeId"
                value={formData.assigneeId ?? ""}
                onChange={handleChange}
              >
                <option value="">Не назначено</option>
                {userList?.data.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>

            {formData.boardId && (
              <div className={styles.boardLinkContainer}>
                <Link
                  to={`/board/${formData.boardId}`}
                  className={styles.boardLink}
                >
                  Перейти на доску
                </Link>
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
              >
                Отмена
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Сохранение..."
                  : taskId
                  ? "Обновить"
                  : "Создать"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default IssueFormModal
