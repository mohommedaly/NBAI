import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  private requestCount = 0;

  show(): void {
    this.requestCount++;
    Promise.resolve().then(() => {
      if (this.requestCount > 0 && !this._loading.value) {
        this._loading.next(true);
      }
    });
  }

  hide(): void {
    this.requestCount = Math.max(0, this.requestCount - 1);
    Promise.resolve().then(() => {
      if (this.requestCount === 0 && this._loading.value) {
        this._loading.next(false);
      }
    });
  }
}
