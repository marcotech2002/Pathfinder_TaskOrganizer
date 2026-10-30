import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskResponseDTO, TaskUpdateDTO } from '../../DTOs/task-dtos'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = '/mock/TASK_MOCK_DATA.json';
  private httpHeaders = new HttpHeaders({ 'content-type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  getTasks(): Observable<TaskResponseDTO[]> {
    return this.httpClient.get<TaskResponseDTO[]>(this.baseUrl, {
      headers: this.httpHeaders
    });
  }

  updateTask(id: number, updateTask: TaskUpdateDTO): Observable<TaskResponseDTO> {
    return this.httpClient.patch(`${this.baseUrl}/${id}`, updateTask, {
      headers: this.httpHeaders
    })
  }
}
