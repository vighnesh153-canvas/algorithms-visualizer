import { SortingVisualizerComponent } from './sorting-visualizer.component';

export const getBubbleSortGenerator = (object: SortingVisualizerComponent) => {
  function *bubbleSortGenerator() {
    for (let i = 0; i < object.array.length; i++) {
      for (let j = 0; j < object.array.length - i - 1; j++) {
        const v1 = object.array[j];
        const v2 = object.array[j + 1];

        if (v1 > v2) {
          [object.array[j], object.array[j + 1]] =
            [object.array[j + 1], object.array[j]];
          object.color[j] = object.color[j + 1] = 'red';
          object.plotArray();
          yield;
          object.color[j] = object.color[j + 1] = 'white';
        }
      }
    }
    object.plotArray();
  }
  return bubbleSortGenerator();
};

export const getMergeSortGenerator = (object: SortingVisualizerComponent) => {
  function plotArray(array: number[],
                     s1: number, e2: number) {
    const tempArr = [...object.array];
    array.forEach((value, index) => {
      tempArr[index + s1] = value;
    });
    let i = array.length + s1 - 1;
    while (i <= e2) {
      tempArr[i] = object.array[i];
      i++;
    }
    object.plotArray(tempArr);
  }

  function *mergeSortGenerator(start, end) {
    if (start === end) {
      return;
    }

    const mid = Math.floor((start + end) / 2);
    for (const temp of mergeSortGenerator(start, mid)) { yield; }
    for (const temp of mergeSortGenerator(mid + 1, end)) { yield; }
    for (const temp of merge(start, mid, mid + 1, end)) { yield; }
    object.plotArray();
  }

  function *merge(s1: number, e1: number, s2: number, e2: number) {
    const newArray = [];
    let i = s1;
    let j = s2;

    while (i <= e1 && j <= e2) {
      if (object.array[i] < object.array[j]) {
        newArray.push(object.array[i++]);
      } else {
        newArray.push(object.array[j++]);
      }
      object.color[i] = object.color[j] = 'red';
      plotArray(newArray, s1, e2);
      object.color[i] = object.color[j] = 'white';
      yield;
    }

    while (i <= e1) {
      newArray.push(object.array[i++]);
      object.color[i] = 'red';
      plotArray(newArray, s1, e2);
      object.color[i] = 'white';
      yield;
    }

    while (j <= e2) {
      newArray.push(object.array[j++]);
      object.color[j - 1] = 'red';
      plotArray(newArray, s1, e2);
      object.color[j - 1] = 'white';
      yield;
    }

    newArray.forEach((value, index) => {
      object.array[index + s1] = value;
    });
  }

  return mergeSortGenerator(0, object.array.length - 1);
};
