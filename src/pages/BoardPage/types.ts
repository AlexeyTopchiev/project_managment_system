export interface Assignee {
  id: number
  avatarUrl: string
  email: string
  fullName: string
}

export interface Task {
  id: number
  title: string
  description: string
  priority: "Low" | "Medium" | "High"
  status: "Backlog" | "InProgress" | "Done"
  assignee: Assignee | null
}

export interface ErrorResponse {
  error: string
  message: string
}
