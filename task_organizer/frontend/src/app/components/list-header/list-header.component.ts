import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-header',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './list-header.component.html',
  styleUrl: './list-header.component.scss'
})
export class ListHeaderComponent {
  private readonly route = inject(ActivatedRoute);

  get title(): string {
    return this.route.snapshot.data['pageTitle'] ?? '';
  }

  get subtitle(): string {
    return this.route.snapshot.data['pageSubtitle'] ?? '';
  }

  get actionLabel(): string {
    return this.route.snapshot.data['actionLabel'] ?? '';
  }
}
