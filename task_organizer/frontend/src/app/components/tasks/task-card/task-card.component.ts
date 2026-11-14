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
  task!: TaskResponseDTO

  ngOnInit() {
    this.task = this.taskSignal()
  }

  changeTaskStatus() {
    this.task.completed = !this.task.completed;
    this.statusChange.emit(this.task.completed);
  }

  getContrastColor(hexColor: string): string {
    if (!hexColor) return '#000000';

    const hex = hexColor.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    return yiq >= 128 ? '#000000' : '#ffffff';
  }

}
