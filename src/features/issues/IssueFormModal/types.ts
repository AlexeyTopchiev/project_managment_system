export interface User {
  id: number
  fullName: string
}

export interface Users {
  data: User[]
}

export interface Board {
  id: number
  name: string
}

export interface Boards {
  data: Board[]
}

export interface TaskFormData {
  title: string
  description: string
  boardId: number | null
  priority: "Low" | "Medium" | "High"
  status: "Backlog" | "InProgress" | "Done"
  assigneeId: number | null
}

// type Assignee = {
//   id: 1
//   fullName: string
//   email: string
//   avatarUrl: string
// }
