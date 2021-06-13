import React from 'react';
import './MainBody.css';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import {getAnimations} from '../animation/animations.js';
import {playNote, getSynth} from '../sound/sounds.js';

let isRunning;
let initialPageLoad = true;
let currentArray = [];
let initialArray = [];

export default class MainBody extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      array: [],
      sort: 'Selection Sort',
      key: 'C',
      mode: 'Major',
      accidental: '-',
      speed: '50',
      size: '50',
      sound: true,
      audio: '',
    };
    this.updateSort = this.updateSort.bind(this);
    this.updateKey = this.updateKey.bind(this);
    this.updateMode = this.updateMode.bind(this);
    this.updateAccidental = this.updateAccidental.bind(this);
    this.updateSpeed = this.updateSpeed.bind(this);
    this.updateSize = this.updateSize.bind(this);
    this.updateSound = this.updateSound.bind(this);
    this.updatePlay = this.updatePlay.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() { 
    this.generateArray(this.state.size);
    this.setState({audio: getSynth()});
  }

  beginSorting() { 
    if (this.state.sound && initialPageLoad) { this.initializeSound(0); initialPageLoad = false; }
    else this.animateSort(0, getAnimations(currentArray, this.state.sort)); 
    
  }

  initializeSound(i){  // runs only once for when page is loaded for first time
    if (i < 3){
      setTimeout(() => {
        playNote(0, this.state);  // plays 'empty' note to initialize the tone js synth
        this.initializeSound(i+1);
      }, 200); // anything less than this might lead to overlapping starting notes and can cause a crash
    }
    else this.animateSort(0, getAnimations(currentArray, this.state.sort)); 
  }

  animateSort(i, arr){  // animations method inspired by Clement - https://github.com/clementmihailescu/Sorting-Visualizer-Tutorial
    if (i < arr.length){
      const arrayBars = document.getElementsByClassName('element');
      const [barOneIdx, barTwoIdx, valueOne, valueTwo, swap] = arr[i];
      const barOneStyle = arrayBars[barOneIdx].style;
      const barTwoStyle = arrayBars[barTwoIdx].style;
      if (!swap) {
        setTimeout(() => {
          this.clearColor();
          barOneStyle.backgroundColor = barTwoStyle.backgroundColor = '#016F54';
          if (this.state.sound) this.playSound(valueOne, valueTwo);
          if (!isRunning) this.pause();
          else this.animateSort(i+1, arr);
        }, (2000/(this.state.speed)));
      } 
      else {
        setTimeout(() => {
          if (!isRunning) this.pause();
          else {
            this.clearColor();
            barOneStyle.backgroundColor = barTwoStyle.backgroundColor = '#016F54';
            currentArray[barOneIdx] = valueOne; 
            currentArray[barTwoIdx] = valueTwo;
            barOneStyle.height = `${((valueOne/100)*65)+2}vh`;
            barTwoStyle.height = `${((valueTwo/100)*65)+2}vh`;
            arrayBars[barOneIdx].textContent = valueOne;
            arrayBars[barTwoIdx].textContent = valueTwo;
            if (this.state.sound) this.playSound(valueOne, valueTwo);
            this.animateSort(i+1, arr);
          }
        }, (2000/(this.state.speed)));
      }
    }
    else{
      this.clearColor();
      this.finisher(0);
    }
  }

  finisher(i){
    if (i < currentArray.length){
      const arrayBars = document.getElementsByClassName('element');
      setTimeout(() => {
        arrayBars[i].style.backgroundColor = '#016F54';
        if (this.state.sound) playNote(currentArray[i], this.state, this.state.audioContext);
        if (!isRunning) this.pause();
        else this.finisher(i+1);
      }, (2000/(this.state.speed)));
    }
    else{
      setTimeout(() => {
        this.clearColor();
        this.forceStop();
      }, 200);
    }
  }

  forceStop(){
    isRunning = false;
    this.forceUpdate();
  }

  playSound(leftValue, rightValue){
    if (this.state.sort === "Selection Sort") playNote(rightValue, this.state, this.state.audioContext);
    else playNote(leftValue, this.state, this.state.audioContext);
  }

  generateArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++){
      arr.push(Math.floor(Math.random() * 100) + 1);
      //arr.push(i+1);
    }
    /*for (let i = 100; i > 70; i--){
      arr.push(i);
    }*/
    currentArray = arr.slice(0);
    initialArray = currentArray.slice(0);
    this.setState({array: arr});
  }

  updateSort(sort) { this.setState({sort: sort}); }

  updateKey(key) { this.setState({key: key}); }

  updateMode(mode) { this.setState({mode: mode}); }

  updateAccidental(accidental) { this.setState({accidental: accidental}); }

  updateSpeed(speed) { this.setState({speed: speed}); }

  updateSize(size) { this.setState({size: size}); this.generateArray(size); }

  updateSound(sound){ this.setState({sound: sound}); }

  updatePlay(state) { 
    this.forceUpdate();
    isRunning = state;
    if (isRunning) this.beginSorting();
  }

  pause() { this.clearColor(); }

  clearColor(){
    const arrayBars = document.getElementsByClassName('element');
    for (let i = 0 ; i < this.state.array.length; i++){
      arrayBars[i].style.backgroundColor = '#C4C4C4';
    }
  }

  reset(){
    isRunning = false;
    const arrayBars = document.getElementsByClassName('element');
    for (let i = 0 ; i < this.state.array.length; i++){
      arrayBars[i].style.height = `${((initialArray[i]/100)*65)+2}vh`;
      arrayBars[i].textContent = initialArray[i];
    }
    currentArray = initialArray.slice(0);
    this.setState({array: initialArray});
  }

  render() {
    return(
      <>
        <TopNav 
          onSort={this.updateSort} 
          onKey={this.updateKey} 
          onMode={this.updateMode} 
          onAccidental={this.updateAccidental}
          isRunning={isRunning}
        />
        <div className="main-content">
          <div className="element-positioning-block"></div>
          {this.state.array.map((value, id) => (
            <div className="element" key={id} style={{
              height: `${((value/100)*65)+2}vh`, 
              width: `${50/this.state.array.length}vw`, 
              marginLeft: "2px",
              fontSize: `${110-this.state.array.length}%`
            }}>{value}</div>
          ))}
        </div>
        <BottomNav 
          onSoundChange={this.updateSound}
          onPlayChange={this.updatePlay}
          onReset={this.reset}  
          onSpeedChange={this.updateSpeed} 
          onSizeChange={this.updateSize}
          isRunning={isRunning}
        />
      </>
    );
  }
}