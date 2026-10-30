import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TaskResponseDTO } from '../../../DTOs/task-dtos';

@Component({
  selector: 'app-task-card',
  imports: [
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  taskSignal = input.required<TaskResponseDTO>();
  statusChange = output<boolean>();

  get task(): TaskResponseDTO {
    return this.taskSignal()
  }

  changeTaskStatus() {
    this.task.completed = !this.task.completed;
    this.statusChange.emit(this.task.completed);
  }
}
