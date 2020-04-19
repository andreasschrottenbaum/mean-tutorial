import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeadlineService {
  private currentTitle = '';
  private currentDescription = '';

  get title() {
    return this.currentTitle;
  }
  set title(title: string) {
    this.currentTitle = title;
    this.currentDescription = null;

    if (title) {
      document.title = `${title} | MEAN Auth Tutorial`;
    } else {
      document.title = 'MEAN Auth Tutorial';
    }
  }

  get description() {
    return this.currentDescription;
  }
  set description(description: string) {
    this.currentDescription = description;
  }
}
