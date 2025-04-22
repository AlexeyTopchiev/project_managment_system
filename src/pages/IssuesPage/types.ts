export interface AssignedUserForTask {
  id: number
  avatarUrl: string
  email: string
  fullName: string
}

export interface Task {
  id: number
  title: string
  description: string
  status: "Backlog" | "InProgress" | "Done"
  priority: "Low" | "Medium" | "High"
  boardId: number
  boardName: string
  assignee: AssignedUserForTask | null
}

export interface ApiResponse {
  data: Task[]
}

export interface ErrorResponse {
  error: string
  message: string
}
