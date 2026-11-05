import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TaskResponseDTO } from '../../../DTOs/task-dtos';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-card',
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    RouterLink
],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  taskSignal = input.required<TaskResponseDTO>();
  statusChange = output<boolean>();
  deleted = output<void>();

  get task(): TaskResponseDTO {
    return this.taskSignal()
  }

  changeTaskStatus() {
    this.task.completed = !this.task.completed;
    this.statusChange.emit(this.task.completed);
  }
}
