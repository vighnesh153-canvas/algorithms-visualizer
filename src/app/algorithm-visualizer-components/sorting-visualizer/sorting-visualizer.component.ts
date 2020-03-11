import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { Canvas } from '../../scripts/Canvas';
import { ToastMessagesService } from '../../services/toast-messages.service';
import {
  getBubbleSortGenerator,
  getMergeSortGenerator,
  getSelectionSortGenerator,
  getInsertionSortGenerator
} from './sorting-visualizer.logic';

class SortAlgorithmMeta {
  function: (o: SortingVisualizerComponent) => Generator;
  timer: number;
}

@Component({
  selector: 'app-sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.scss']
})
export class SortingVisualizerComponent
  implements OnInit, AfterViewInit, OnDestroy {
  canvas: Canvas;

  arraySize = 166;
  minimumLength = 2;
  array: number[];
  color: string[];

  offsetFromGround = 10;
  selectedSortAlgorithm = 'bubble';
  animationRunning = false;

  interval;

  map: { [key: string]: SortAlgorithmMeta} = {
    bubble: {
      function: getBubbleSortGenerator,
      timer: 10
    },
    merge: {
      function: getMergeSortGenerator,
      timer: 30
    },
    selection: {
      function: getSelectionSortGenerator,
      timer: 10
    },
    insertion: {
      function: getInsertionSortGenerator,
      timer: 10
    }
  };

  @ViewChild('canvas') canvasElementRef: ElementRef<HTMLCanvasElement>;

  constructor(private toastMessagesService: ToastMessagesService) {
    this.color = [];
    this.array = [];
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.canvas = new Canvas(this.canvasElementRef.nativeElement);
    this.randomizeArray();
  }

  isArraySorted() {
    let prev = -Infinity;
    let isSorted = true;

    this.array.forEach(value => {
      if (value < prev) {
        isSorted = false;
      }
      prev = value;
    });

    return isSorted;
  }

  startAnimation() {
    if (this.isArraySorted()) {
      this.toastMessagesService.broadcast(
        'Array is already sorted', 'INFO'
      );
      return;
    }

    this.animationRunning = true;
    const generatorObject =
      this.map[this.selectedSortAlgorithm].function(this);
    const timer = this.map[this.selectedSortAlgorithm].timer;

    this.interval = setInterval(() => {
      if (generatorObject.next().done) {
        this.stopAnimation();
      }
    }, timer);
  }

  clearBackground() {
    this.canvas.drawFilledRect(
      0, 0, this.canvas.width, this.canvas.height, 'black'
    );
  }

  generateRandomArray() {
    this.stopAnimation();
    this.array = [];
    this.color = [];
    const maxHeight = this.canvas.height - 50 - this.offsetFromGround;
    const { floor, random } = Math;

    for (let i = 0; i < this.arraySize; i++) {
      this.array.push(floor(random() * maxHeight) + this.offsetFromGround);
      this.color.push('white');
    }
  }

  plotArray(array?: number[]) {
    if (array === undefined) {
      array = this.array;
    }
    this.clearBackground();
    array.forEach((value: number, index: number) => {
      value += this.minimumLength;
      this.canvas.drawFilledRect(
        index * 3,
        this.canvas.height - value,
        2,
        value - this.offsetFromGround,
        this.color[index]
      );
    });
  }

  randomizeArray() {
    this.generateRandomArray();
    this.plotArray();
  }

  stopAnimation() {
    this.animationRunning = false;
    clearInterval(this.interval);
    clearInterval(this.interval);
    this.resetColor();
    this.plotArray();
  }

  resetColor() {
    this.color.forEach((v, i) => {
      this.color[i] = 'white';
    });
  }

  ngOnDestroy() {
    this.stopAnimation();
  }

}
