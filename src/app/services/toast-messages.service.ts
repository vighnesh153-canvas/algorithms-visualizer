import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Toast } from '../models/Toast';

@Injectable({
  providedIn: 'root'
})
export class ToastMessagesService {
  toastMessageSubject: Subject<Toast>;

  constructor() {
    this.toastMessageSubject = new Subject<Toast>();
  }

  broadcast(message: string, type: string) {
    this.toastMessageSubject.next({ message, type });
  }
}
