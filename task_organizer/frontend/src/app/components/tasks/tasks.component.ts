import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ListHeaderComponent } from '../list-header/list-header.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskService } from '../../services/task/task.service';
import { TaskResponseDTO, TaskUpdateDTO } from '../../DTOs/task-dtos';

@Component({
  selector: 'app-tasks',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    ListHeaderComponent,
    TaskCardComponent
],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
  filters = [
    {
      isActive: true
    },
    {
      isActive: false
    },
    {
      isActive: false
    },
    {
      isActive: false
    }
  ];
  tasks: TaskResponseDTO[] = [];
  pageIndex = 0;
  pageSize = 3;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe({
      next: res => {
        this.tasks = res
        console.log(this.tasks)
      },
      error: (error) => {
        const message = `Error during task listing`;
        console.log(message)
      }
    })
  }

  get listInfo() {
    let message = ''
    if (this.tasks && this.tasks.length > 0) {
      let completedTasks = this.tasks.filter(task => task.completed == true)
      message = `${this.tasks.length} tasks | ` +
        `${completedTasks.length} completed | ` +
        `${this.tasks.length - completedTasks.length} pending`
    }

    return message
  }

  get pagedTasks(): TaskResponseDTO[] {
    const start = this.pageIndex * this.pageSize;
    return this.tasks.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onStatusChange(id: number, status: boolean) {
    this.taskService.updateTask(id, {
    completed: status,
    }).subscribe({
      next: res => {
        const task = this.tasks.find(task => task.id == res.id);
        if (task) {
          task.completed = res.completed;
        }
      },
      error: () => {
        const message = `Error during task update`;
        console.log(message)
      },
    });
  }
}
