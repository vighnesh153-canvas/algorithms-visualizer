import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  displayBackButton = new BehaviorSubject<boolean>(true);

  constructor() { }
}
