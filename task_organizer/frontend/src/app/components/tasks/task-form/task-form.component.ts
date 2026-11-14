import { Component, input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../../services/task/task.service';
import { TaskCreateDTO, TaskResponseDTO } from '../../../DTOs/task-dtos';
import { Router, RouterLink } from '@angular/router';
import { CategoryResponseDTO } from '../../../DTOs/category-dtos';
import { CategoryService } from '../../../services/category/category.service';
import { SnackBarService } from '../../../services/common/snack-bar.service';
import { DatePipe } from '@angular/common';

export interface CategoryOption {
  id: number;
  name: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: Date | null;
  categoryId: number | null;
  completed: boolean;
  completionDate: Date | null;
}

export interface TaskFormSubmit {
  id: number | null;
  task: TaskFormData;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  id = input<number | undefined>();
  categories: CategoryResponseDTO[] = [];
  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(150)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dueDate: new FormControl<Date | null>(null),
    categoryId: new FormControl<number | null>(null),
    completed: new FormControl(false, { nonNullable: true }),
    completionDate: new FormControl<Date | null>({
      value: null,
      disabled: true,
    }),
  });
  task: TaskResponseDTO | undefined

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private router: Router,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    if (this.id()) {
      this.taskService.getTaskById(this.id()!).subscribe({
        next: (task) => {
          this.form.patchValue({
            title: task.title,
            description: task.description,
            dueDate: task.due_date,
            categoryId: task.category?.id,
            completed: task.completed,
            completionDate: task.completion_date
          });
          this.task = task
        },
        error: () => {
          const message = 'Error fetching task';
          this.snackBarService.openSnackBar(message);
        }
      });
    }

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        const message = 'Error fetching categories';
        this.snackBarService.openSnackBar(message);
      }
    });
  }

  changeCompletionDate(value: boolean): void {
    if (value) {
      const today = new Date()
      this.form.controls.completionDate.enable()
      this.form.controls.completionDate.setValue(today)
    } else {
      this.form.controls.completionDate.disable()
      this.form.controls.completionDate.setValue(null)
    }
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.id()) {
      this.taskService.updateTask(this.id()!, {
        title: this.form.controls.title.value,
        description: this.form.controls.description.value,
        due_date: this.form.controls.dueDate.value,
        category_id: this.form.controls.categoryId.value,
        completed: this.form.controls.completed.value,
        completion_date: this.form.controls.completionDate.value
      }).subscribe({
        next: (res) => {
          const message = 'Task updated successfully';
          this.snackBarService.openSnackBar(message);
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          const message = 'Error updating task';
          this.snackBarService.openSnackBar(message);
        }
      });
    } else {
      let taskDTO: TaskCreateDTO = {
        title: this.form.controls.title.value,
        description: this.form.controls.description.value,
        due_date: this.form.controls.dueDate.value,
        category_id: this.form.controls.categoryId.value
      };

      this.taskService.createTask(taskDTO).subscribe({
        next: (res) => {
          const message = 'Task created successfully';
          this.snackBarService.openSnackBar(message);
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          const message = 'Error creating task';
          this.snackBarService.openSnackBar(message);
        }
      });
    }
  }
}
