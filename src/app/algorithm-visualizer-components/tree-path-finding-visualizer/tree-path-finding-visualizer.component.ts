import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

import { Canvas } from '../../scripts/Canvas';
import { ToastMessagesService } from '../../services/toast-messages.service';

class Cell {
  static readonly defaultRadius = 4;

  get x() {
    return (this.leftMax + this.rightMax) / 2;
  }

  radius = Cell.defaultRadius;
  color = colors.defaultCell;
  exists = true;

  leftMax: number;
  rightMax: number;

  leftChild: Cell;
  rightChild: Cell;

  startFound = false;
  endFound = false;

  liesOnPath = false;

  constructor(
    public y: number,
    private canvas: Canvas
  ) {
  }

  draw() {
    if (this.exists) {
      const { x, y, color, radius } = this;
      this.canvas.drawFilledCircle(x, y, radius, color);
    }
  }
}

const colors = {
  defaultCell: 'lightgreen',
  start: 'red',
  end: 'red',
  branch: 'lightblue',
  pathColor: 'yellow',
  visited: 'darkgreen'
};

@Component({
  selector: 'app-tree-path-finding-visualizer',
  templateUrl: './tree-path-finding-visualizer.component.html',
  styleUrls: ['./tree-path-finding-visualizer.component.scss']
})
export class TreePathFindingVisualizerComponent implements
  OnInit, AfterViewInit {

  canvas: Canvas;
  animationRunning = false;

  tree: Cell[];
  start: Cell;
  end: Cell;

  interval;

  bothFound = false;

  @ViewChild('canvas') canvasElementRef: ElementRef<HTMLCanvasElement>;

  constructor(private toastMessagesService: ToastMessagesService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.canvas = new Canvas(this.canvasElementRef.nativeElement);
    this.generateAllNodes();
    this.generateRandomStartAndEnd();
    this.dfsFindStartAndEndInitializer();
    this.plot();
  }

  startAnimation() {
    this.bothFound = false;
    this.resetNodes();
    this.setStartAndEndColor();
    this.animationRunning = true;
    const generatorObject = this.dfsFindStartAndEndInitializer();

    this.interval = setInterval(() => {
      this.plot();
      if (generatorObject.next().done) {
        this.stopAnimation();
      }
    }, 100);
  }

  stopAnimation() {
    clearInterval(this.interval);
    clearInterval(this.interval);
    this.animationRunning = false;
    this.plot();
  }

  *dfsFindStartAndEndInitializer() {
    for (const item of this.dfsFindStartAndEnd(this.tree[0])) {
      yield;
    }
  }

  *dfsFindStartAndEnd(node: Cell) {
    if (node && node.exists) {
      node.color = colors.visited;
      if (this.bothFound) {
        return;
      }

      for (const item of this.dfsFindStartAndEnd(node.leftChild)) {
        yield;
      }
      if (this.bothFound === false) {
        for (const item of this.dfsFindStartAndEnd(node.rightChild)) {
          yield;
        }
      }

      const { leftChild, rightChild } = node;

      node.startFound =
        (node === this.start) ||
        (leftChild && leftChild.startFound) ||
        (rightChild && rightChild.startFound);

      node.endFound =
        (node === this.end) ||
        (leftChild && leftChild.endFound) ||
        (rightChild && rightChild.endFound);

      if (node.startFound || node.endFound) {
        node.color = colors.pathColor;
        node.liesOnPath = true;
      }

      if (node.startFound && node.endFound) {
        this.bothFound = true;
      }

      if (
        (leftChild && leftChild.startFound && leftChild.endFound) ||
        (rightChild && rightChild.startFound && rightChild.endFound)) {
        node.color = colors.visited;
        node.liesOnPath = false;
      }

      this.setStartAndEndColor();
      node.radius = Cell.defaultRadius * 2;
      yield;
      if (node.liesOnPath === false) {
        node.radius = Cell.defaultRadius;
      }
    }
  }

  clearBackground() {
    this.canvas.drawFilledRect(
      0, 0, this.canvas.width, this.canvas.height, 'black'
    );
  }

  setStartAndEndColor() {
    this.start.color = colors.start;
    this.end.color = colors.end;
  }

  generateRandomStartAndEnd() {
    this.stopAnimation();
    this.resetNodes();

    const { tree } = this;
    const randomFunc = (n: number) => {
      return Math.floor(Math.random() * n);
    };

    if (this.start) {
      this.start.color = colors.defaultCell;
    }

    if (this.end) {
      this.end.color = colors.defaultCell;
    }

    this.start = null;
    while (this.start === null || this.start.exists === false) {
      this.start = tree[randomFunc(tree.length)];
    }
    this.end = null;
    while (this.end === null || this.end === this.start ||
    this.end.exists === false) {
      this.end = tree[randomFunc(tree.length)];
    }

    this.setStartAndEndColor();
    this.plot();
  }

  plot() {
    this.clearBackground();
    this.drawBranches();
    this.drawTreeNodes();
  }

  generateAllNodes() {
    const root = new Cell(30, this.canvas);
    root.leftMax = 0;
    root.rightMax = this.canvas.width;

    this.tree = [];
    this.tree.push(root);

    const totalNodes = 2 ** 7;
    const yDifference = 40;
    let i = 0;
    while (++i < totalNodes - 1) {
      const parentIndex = Math.floor((i - 1) / 2);
      const parent = this.tree[parentIndex];
      const child = new Cell(parent.y + yDifference, this.canvas);

      if (i % 2 === 1) {
        child.leftMax = parent.leftMax;
        child.rightMax = parent.x;
        parent.leftChild = child;
      } else {
        child.leftMax = parent.x;
        child.rightMax = parent.rightMax;
        parent.rightChild = child;
      }
      this.tree.push(child);
    }
  }

  drawBranches() {
    this.tree.forEach((cell, index) => {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.tree[parentIndex];

      if (parent && cell.exists) {
        this.canvas.drawLine(
          cell.x, cell.y, parent.x, parent.y, 1, colors.branch
        );
      }
    });
  }

  drawTreeNodes() {
    this.tree.forEach(c => c.draw());
  }

  resetNodes() {
    this.tree.forEach(cell => {
      cell.color = colors.defaultCell;
      cell.startFound = false;
      cell.endFound = false;
      cell.radius = Cell.defaultRadius;
      cell.liesOnPath = false;
    });
  }

  generateRandomTree() {
    this.tree.forEach((cell, index) => {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.tree[parentIndex];
      cell.exists = true;

      if (parent === undefined || parent.exists === false) {
        cell.exists = false;
      } else {
        cell.exists = Math.random() < 0.9;
      }
      this.tree[0].exists = true;
    });
    this.generateRandomStartAndEnd();
  }

}
