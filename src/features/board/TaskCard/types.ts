export interface Task {
  id: number
  title: string
  description: string
  priority: "Low" | "Medium" | "High"
  status: "Backlog" | "InProgress" | "Done"
  assignee: Assignee | null
}

export interface Assignee {
  id: number
  avatarUrl: string
  email: string
  fullName: string
}

export interface TaskCardProps {
  task: Task
  boardId: string
  onDragStart: () => void
  onClick: () => void
}
