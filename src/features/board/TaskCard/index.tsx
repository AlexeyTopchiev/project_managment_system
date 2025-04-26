import { TaskCardProps } from "./types"
import styles from "./TaskCard.module.scss"

const TaskCard = ({ task, boardId, onDragStart, onClick }: TaskCardProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move"
    onDragStart()
  }

  return (
    <div
      className={styles.taskCard}
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
    >
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

      {/* <Link
        to={`/board/${boardId}/task/${task.id}`}
        className={styles.viewButton}
      >
        Подробнее →
      </Link> */}
    </div>
  )
}

export default TaskCard
