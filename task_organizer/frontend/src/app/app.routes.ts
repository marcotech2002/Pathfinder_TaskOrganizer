import { Routes } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { TaskFormComponent } from './components/tasks/task-form/task-form.component';
import { TaskMainComponent } from './components/tasks/task-main/task-main.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    component: TasksComponent,
    // canActivate: [authGuard],
    children: [
      { path: '', component: TaskMainComponent },
      { path: 'form', component: TaskFormComponent },
      { path: 'form/:id', component: TaskFormComponent },
    ],
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
