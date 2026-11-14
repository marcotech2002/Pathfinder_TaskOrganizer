import { SnackBarService } from './../../services/common/snack-bar.service';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColorPickerDirective } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../services/category/category.service';
import { CategoryCreateDTO, CategoryResponseDTO } from '../../DTOs/category-dtos';
import { filter, finalize, of, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

export interface Category {
  isEditing: boolean;
  object: CategoryResponseDTO;
  tempName?: string;
  tempColor?: string
}

@Component({
  selector: 'app-categories',
  imports: [
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    ColorPickerDirective,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  categories: Category[] = [];
  newCategoryName: string = '';
  newCategoryColor: string = '#FFFFFF';
  isAddingCategory: boolean = false;
  isLoading = true;

  constructor(
    private categoryService: CategoryService,
    private snackBarService: SnackBarService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategories().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.categories = response.map((category) => ({
          isEditing: false,
          object: category
        }));
      },
      error: () => {
        const message = "Error during categories listing"
        this.snackBarService.openSnackBar(message);
      }
    });
  }

  startEditing(category: any): void {
    category.isEditing = true;
    category.tempName = category.object.name;
    category.tempColor = category.object.color;
  }

  saveCategoryName(category: any): void {
    if (!category.isEditing) return;

    if (
      category.tempName && category.tempName.trim() !== '' &&
      (category.tempName !== category.object.name || category.tempColor !== category.object.color)
    ) {
      category.object.name = category.tempName.trim();
      this.categoryService.updateCategory(category.object.id, { name: category.object.name, color: category.object.color }).subscribe({
        next: (updatedCategory) => {
          category.object = updatedCategory;
          const message = "Category updated successfully"
          this.snackBarService.openSnackBar(message);
        },
        error: () => {
          const message = 'Error updating category';
          this.snackBarService.openSnackBar(message);
          category.tempName = category.object.name;
        }
      });
    } else {
      category.tempName = category.object.name;
      category.tempColor = category.object.color;
    }

    category.isEditing = false;
  }

  cancelEditing(category: any): void {
    category.tempName = category.object.name;
    category.isEditing = false;
  }

  addCategory(): void {
    if (this.newCategoryName.trim() !== '') {
      const newCategory: CategoryCreateDTO = {
        name: this.newCategoryName.trim(),
        color: this.newCategoryColor
      };

      this.categoryService.createCategory(newCategory).pipe(
        finalize(() => this.cancelAddingCategory())
      ).subscribe({
        next: (createdCategory) => {
          this.categories.push({
            isEditing: false,
            object: createdCategory
          });
          const message = "Category created successfully"
          this.snackBarService.openSnackBar(message);
        },
        error: () => {
          const message = 'Error creating category';
          this.snackBarService.openSnackBar(message);
        }
      });
    }
  }

  cancelAddingCategory(): void {
    this.isAddingCategory = false;
    this.newCategoryName = '';
    this.newCategoryColor = '#FFFFFF';
  }

  deleteCategory(category: Category): void {
    const confirmation$ =
      category.object.tasks_count > 0
        ? this.dialog
          .open(DialogComponent, {
            width: '350px',
            data: {
              title: 'Delete category?',
              message: `This category has ${category.object.tasks_count} tasks. Continue?`,
            },
          })
          .afterClosed()
        : of(true);

    confirmation$
      .pipe(
        filter((confirmed): confirmed is true => confirmed === true),
        switchMap(() =>
          this.categoryService.deleteCategory(category.object.id)
        )
      )
      .subscribe({
        next: () => {
          this.categories = this.categories.filter(
            item => item.object.id !== category.object.id
          );
        },
        error: () => {
          this.snackBarService.openSnackBar(
            'Error during category deletion'
          );
        },
      });
  }
}
