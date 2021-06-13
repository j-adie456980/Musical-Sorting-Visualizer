export function getAnimations(array, type){
  let newArray = array.slice(0);
  //console.log(type, newArray);
  switch(type) {
    case 'Selection Sort':
      return getSelectionSort(newArray);
    case 'Insertion Sort':
      return getInsertionSort(newArray);
    case 'Bubble Sort':
      return getBubbleSort(newArray);
    case 'Merge Sort':
      return getMergeSort(newArray);
    default:
  }
}

function getSelectionSort(array){
  const animations = [];  // element structure -> [left idx, right idx , left val, right val, swap]
  const length = array.length;
  for(let i = 0; i < length; i++) {
    let min = i;
    for(let j = i+1; j < length; j++){
      if(array[j] < array[min]) {
        min=j; 
        //animations.push([i, j, array[i], array[j], false]);
      }
      animations.push([i, j, array[i], array[j-1], false]);  
    }
    if (min !== i) {
      let tmp = array[i]; 
      array[i] = array[min];
      array[min] = tmp;  
      animations.push([i, min, array[i], array[min], true]);   
    }
  }
  return animations;
}

function getInsertionSort(array){
  const animations = [];
  const length = array.length;
  for (let i = 1; i < length; i++) {
    let current = array[i];
    let j = i-1; 
    while ((j > -1) && (current < array[j])) {
      array[j+1] = array[j];
      animations.push([j+1, i, array[j+1], current, true]);
      j--;
    }
    array[j+1] = current;
    animations.push([j+1, i, current, array[i], true]);
  }
  return animations;
}

function getBubbleSort(array){
  const animations = [];  
  const length = array.length;
  for(var i = 0; i < length; i++){ 
    for(var j = 0; j < ( length - i -1 ); j++){
      if(array[j] > array[j+1]){
        var temp = array[j]
        array[j] = array[j + 1]
        array[j+1] = temp
        animations.push([j, j+1, array[j], array[j+1], true]);
      }
      else animations.push([j, j+1, array[j], array[j+1], false]);
    }
  }
  return animations;
}

function getMergeSort(array){
  const animations = [];
  if (array.length <= 1) return array;
  const auxiliaryArray = array.slice();
  mergeSort(array, 0, array.length - 1, auxiliaryArray, animations);
  return animations;
}

function mergeSort(
  mainArray,
  startIdx,
  endIdx,
  auxiliaryArray,
  animations,
) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSort(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSort(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  merge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function merge(
  mainArray,
  startIdx,
  middleIdx,
  endIdx,
  auxiliaryArray,
  animations,
) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    animations.push([i, j, auxiliaryArray[i], auxiliaryArray[j], false]);
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      mainArray[k] = auxiliaryArray[i];
      animations.push([k, k, mainArray[k], mainArray[k], true]);
      k++; i++;
    } else {
      mainArray[k] = auxiliaryArray[j]; 
      animations.push([k, k, mainArray[k], mainArray[k], true]);
      k++; j++;
    }
  }
  while (i <= middleIdx) {
    animations.push([i, i, auxiliaryArray[i], auxiliaryArray[i], false]);
    mainArray[k] = auxiliaryArray[i];
    animations.push([k, k, mainArray[k], mainArray[k], true]);
    k++; i++;
  }
  while (j <= endIdx) {
    animations.push([j, j, auxiliaryArray[j], auxiliaryArray[j], false]);
    mainArray[k] = auxiliaryArray[j];
    animations.push([k, k, mainArray[k], mainArray[k], true]);
    k++; j++;
  }
}