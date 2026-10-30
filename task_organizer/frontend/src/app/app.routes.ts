import { Routes } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { TasksComponent } from './components/tasks/tasks.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    component: TasksComponent,
    // canActivate: [authGuard],
    children: [],
    data: {
      pageTitle: 'My Tasks',
      pageSubtitle: 'Organize your tasks by category and deadline.',
      actionLabel: 'task',
    },
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    // canActivate: [authGuard],
    children: [],
    data: {
      pageTitle: 'My Categories',
      pageSubtitle: 'Group your tasks the way you want.',
      actionLabel: 'category',
    },
  }
];
