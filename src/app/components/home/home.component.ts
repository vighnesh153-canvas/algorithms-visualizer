import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { environment } from '../../../environments/environment';

import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  algorithmsVisualizerComponents: {
    title: string,
    link: string,
    image: string
  }[];

  constructor(private utilityService: UtilityService) {
    this.algorithmsVisualizerComponents =
      environment.algorithmsVisualizer.components;
  }

  ngOnInit(): void {
    this.utilityService.displayBackButton.next(false);
  }

  ngOnDestroy(): void {
    this.utilityService.displayBackButton.next(true);
  }

}
