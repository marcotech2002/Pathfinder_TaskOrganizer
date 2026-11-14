export interface CategoryCreateDTO {
  name: string
  color: string
}

export interface CategoryUpdateDTO {
  name: string
  color: string
}

export interface CategoryResponseDTO {
  id: number
  name: string
  color: string
  tasks_count: number
}
