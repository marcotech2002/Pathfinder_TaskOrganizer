export class TaskCreateDTO {
  title?: string
  description?: string
  due_date?: Date
  category_id?: number
}

export class TaskUpdateDTO {
  title?: string
  description?: string
  completed?: boolean
  due_date?: Date
  completion_date?: Date
  category_id?: number
}

export class TaskResponseDTO {
  id?: number
  title?: string
  description?: string
  completed?: boolean
  due_date?: Date
  completion_date?: Date
  category_id?: number
  creation_date?: Date
  update_date?: Date
}
