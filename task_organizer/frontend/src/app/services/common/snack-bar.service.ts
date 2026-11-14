import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService implements OnDestroy {
  private readonly queue: string[] = [];
  private currentSnackBar?: MatSnackBarRef<unknown>;
  private isShowing = false;
  private destroyed = false;

  constructor(private readonly snackBar: MatSnackBar) {}

  openSnackBar(message: string): void {
    this.queue.push(message);
    this.showNext();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.queue.length = 0;
    this.currentSnackBar?.dismiss();
  }

  private showNext(): void {
    if (this.destroyed || this.isShowing || this.queue.length === 0) {
      return;
    }

    const message = this.queue.shift()!;
    this.isShowing = true;

    const ref = this.snackBar.open(message, 'close', {
      duration: 3000,
    });

    this.currentSnackBar = ref;

    ref.afterDismissed()
      .pipe(take(1))
      .subscribe(() => {
        if (this.currentSnackBar === ref) {
          this.currentSnackBar = undefined;
          this.isShowing = false;
          this.showNext();
        }
      });
  }
}
