import styles from "./TaskCard.module.scss"

interface Task {
  id: number
  title: string
  description: string
  priority: "Low" | "Medium" | "High"
  status: "Backlog" | "InProgress" | "Done"
  assignee: Assignee | null
}

interface Assignee {
  id: number
  avatarUrl: string
  email: string
  fullName: string
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
