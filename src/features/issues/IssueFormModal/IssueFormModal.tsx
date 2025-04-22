import { useState, useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { Users, Boards, TaskFormData } from "./types"
import styles from "./IssueFormModal.module.scss"
import { users, boards } from "../../../app/mockData"

interface IssueFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Partial<TaskFormData>
  // boards?: Board[] //обязательное
  // users?: User[] //обязательное
  currentBoardId?: number
}

const IssueFormModal = ({
  isOpen,
  onClose,
  initialData,
  // boards,
  // users,
  currentBoardId
}: IssueFormModalProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  // const isBoardPage = location.pathname.startsWith("/board/")

  const userList: Users = users
  const boardsList: Boards = boards

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    boardId: currentBoardId || initialData?.boardId || null,
    priority: initialData?.priority || "Medium",
    status: initialData?.status || "Backlog",
    assigneeId: initialData?.assigneeId || null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        boardId: currentBoardId ? currentBoardId : initialData.boardId || null
      }))
    }
  }, [initialData, currentBoardId])

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

    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        boardId: formData.boardId, // уже число или null
        priority: formData.priority,
        assigneeId: formData.assigneeId, // уже число или null
        status: formData.status
      }
      const response = await fetch(
        "http://localhost:8080/api/v1/tasks/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestData)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Ошибка при создании задачи")
      }

      const data = await response.json()
      onClose()
      // Можно добавить редирект или обновление списка задач
      // navigate(`/board/${formData.boardId}/task/${data.id}`)
      navigate(`/board/${formData.boardId}`)
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
          <h2>
            {initialData?.title ? "Редактирование задачи" : "Создание задачи"}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

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
              value={formData.boardId ?? ""}
              onChange={handleChange}
              // disabled={isBoardPage}
              required
            >
              <option value="">Выберите проект</option>
              {boardsList?.data.map(board => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
            {/* {isBoardPage && (
              <div className={styles.note}>
                Проект определяется текущей доской
              </div>
            )} */}
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
            <label htmlFor="assigneeId">Исполнитель</label>
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
                : initialData?.title
                ? "Обновить"
                : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IssueFormModal
