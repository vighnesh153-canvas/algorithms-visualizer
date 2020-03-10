import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';

import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {
  displayBackButton: boolean;

  displayBackButtonSubscription: Subscription;

  constructor(private utilityService: UtilityService) {
    this.displayBackButtonSubscription = this.utilityService.displayBackButton
      .subscribe(value => {
        this.displayBackButton = value;
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.displayBackButtonSubscription.unsubscribe();
  }

}
