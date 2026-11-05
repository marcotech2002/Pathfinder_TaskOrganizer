export interface TaskCreateDTO {
  title: string
  description: string
  due_date: Date | null
  category_id: number | null
}

export interface TaskUpdateDTO {
  title?: string
  description?: string
  completed?: boolean
  due_date?: Date | null
  completion_date?: Date | null
  category_id?: number | null
}

export interface TaskResponseDTO {
  id: number
  title: string
  description: string
  completed: boolean
  due_date: Date | null
  completion_date: Date | null
  category_id: number | null
  creation_date: Date
  update_date: Date
}
