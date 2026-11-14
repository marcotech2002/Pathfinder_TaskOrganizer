import { SnackBarService } from './../../../services/common/snack-bar.service';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskResponseDTO } from '../../../DTOs/task-dtos';
import { TaskService } from '../../../services/task/task.service';
import { CategoryService } from '../../../services/category/category.service';
import { CategoryResponseDTO } from '../../../DTOs/category-dtos';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

type StatusFilter = 'all' | 'pending' | 'completed';

@Component({
  selector: 'app-task-main',
  imports: [
    RouterLink,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    TaskCardComponent
  ],
  templateUrl: './task-main.component.html',
  styleUrl: './task-main.component.scss'
})
export class TaskMainComponent {
  tasks: TaskResponseDTO[] = [];
  categories: CategoryResponseDTO[] = [];

  statusFilter: StatusFilter = 'all';
  selectedCategoryId: number | null = null;

  pageIndex = 0;
  pageSize = 3;

  isLoading = true;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.taskService.getTasks().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: res => {
        this.tasks = res;
      },
      error: () => {
        const message = `Error during tasks listing`;
        this.snackBarService.openSnackBar(message);
      }
    });

    this.categoryService.getCategories().subscribe({
      next: res => {
        this.categories = res;
      },
      error: (error) => {
        const message = `Error during category listing`;
        this.snackBarService.openSnackBar(message);
      }
    });
  }

  get pendingFilterCounter(): number | null {
    const filter = this.tasks.filter(task => !task.completed)
    if (filter.length > 0)
      return filter.length
    else
      return null
  }

  get completedFilterCounter(): number | null {
    const filter = this.tasks.filter(task => task.completed)
    if (filter.length > 0)
      return filter.length
    else
      return null
  }

  get filteredTasks(): TaskResponseDTO[] {
    return this.tasks.filter(task => {
      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'pending' && !task.completed) ||
        (this.statusFilter === 'completed' && task.completed);

      const matchesCategory =
        this.selectedCategoryId === null ||
        task.category?.id === this.selectedCategoryId;

      return matchesStatus && matchesCategory;
    });
  }

  get listInfo(): string {
    const completed = this.filteredTasks.filter(task => task.completed).length;
    const pending = this.filteredTasks.length - completed;

    return `${this.filteredTasks.length} tasks | ${completed} completed | ${pending} pending`;
  }

  get pagedTasks(): TaskResponseDTO[] {
    const sortedTasks = [...this.filteredTasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

    const start = this.pageIndex * this.pageSize;
    return sortedTasks.slice(start, start + this.pageSize);
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
        this.snackBarService.openSnackBar(message);
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
        this.snackBarService.openSnackBar(message);
      },
    });
  }
}
