import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ListHeaderComponent } from '../../list-header/list-header.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskResponseDTO } from '../../../DTOs/task-dtos';
import { TaskService } from '../../../services/task/task.service';

type StatusFilter = 'all' | 'pending' | 'completed';

@Component({
  selector: 'app-task-main',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    ListHeaderComponent,
    TaskCardComponent
  ],
  templateUrl: './task-main.component.html',
  styleUrl: './task-main.component.scss'
})
export class TaskMainComponent {
  tasks: TaskResponseDTO[] = [];

  statusFilter: StatusFilter = 'all';
  selectedCategoryId: number | null = null;

  pageIndex = 0;
  pageSize = 3;

  constructor(
    private taskService: TaskService,
  ) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe({
      next: res => {
        this.tasks = res;
      },
      error: (error) => {
        const message = `Error during task listing`;
        console.log(message);
      }
    });
  }

  get filteredTasks(): TaskResponseDTO[] {
    return this.tasks.filter(task => {
      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'pending' && !task.completed) ||
        (this.statusFilter === 'completed' && task.completed);

      const matchesCategory =
        this.selectedCategoryId === null ||
        task.category_id === this.selectedCategoryId;

      return matchesStatus && matchesCategory;
    });
  }

  get listInfo(): string {
    const completed = this.filteredTasks.filter(task => task.completed).length;
    const pending = this.filteredTasks.length - completed;

    return `${this.filteredTasks.length} tasks | ${completed} completed | ${pending} pending`;
  }

  get pagedTasks(): TaskResponseDTO[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredTasks.slice(start, start + this.pageSize);
  }

  setStatusFilter(filter: StatusFilter): void {
    this.statusFilter = filter;
    this.pageIndex = 0;
  }

  setCategoryFilter(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.pageIndex = 0;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onStatusChange(id: number, status: boolean) {
    this.taskService.updateTask(id, {
      completed: status
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

  onTaskDeleted(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
      },
      error: () => {
        const message = `Error during task deletion`;
        console.log(message)
      },
    });
  }
}
