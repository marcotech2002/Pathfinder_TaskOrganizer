import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskCreateDTO, TaskResponseDTO, TaskUpdateDTO } from '../../DTOs/task-dtos';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:5000/api/tasks/';
  private httpHeaders = new HttpHeaders({ 'content-type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  getTasks(): Observable<TaskResponseDTO[]> {
    return this.httpClient.get<TaskResponseDTO[]>(this.baseUrl, {
      headers: this.httpHeaders
    });
  }

  getTaskById(id: number): Observable<TaskResponseDTO> {
    return this.httpClient.get<TaskResponseDTO>(`${this.baseUrl}${id}`, {
      headers: this.httpHeaders
    });
  }

  createTask(task: TaskCreateDTO): Observable<TaskResponseDTO> {
    return this.httpClient.post<TaskResponseDTO>(this.baseUrl, task, {
      headers: this.httpHeaders
    });
  }

  updateTask(id: number, updateTask: TaskUpdateDTO): Observable<TaskResponseDTO> {
    return this.httpClient.patch<TaskResponseDTO>(`${this.baseUrl}${id}`, updateTask, {
      headers: this.httpHeaders
    })
  }

  deleteTask(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}${id}`, {
      headers: this.httpHeaders
    });
  }
}
