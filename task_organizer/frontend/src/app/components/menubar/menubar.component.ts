import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { navigationData, NavigationOption } from './nav-data';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menubar',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss'
})
export class MenubarComponent {
  name = '';
  buttons: NavigationOption[] = navigationData
  isDark = localStorage.getItem('theme') === 'dark';

  ngOnInit(): void {
    document.documentElement.classList.toggle('dark-theme', this.isDark);
    this.name = "Marco Antônio Porsch Henck de Almeida"
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark-theme', this.isDark);
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }
}
