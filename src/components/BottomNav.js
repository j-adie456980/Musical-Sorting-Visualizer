import React from 'react';
import './BottomNav.css';
import playIcon from "./../play.png"
import pauseIcon from "./../pause.png"
import resetIcon from "./../reset.png"
import soundOnIcon from "./../sound-on.png"
import soundOffIcon from "./../sound-off.png"

class BottomNav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isRunning: false,
      sound: true,
      speed: '55',
      size: '49',
      soundBtn: soundOnIcon,
      playBtn: playIcon
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSoundClick = this.onSoundClick.bind(this);
    this.onPlayClick = this.onPlayClick.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
  }

  handleChange(event) {
    if (!this.state.isRunning){
      if (event.target.id === "slider-speed"){
        this.setState({speed: event.target.value});
        this.props.onSpeedChange(event.target.value);
      }
      else{
        this.setState({size: event.target.value});
        this.props.onSizeChange(event.target.value);
      }
    }
  }

  onSoundClick() {
    if (!this.state.isRunning){
      if (this.state.sound){
        this.setState({soundBtn: soundOffIcon, sound: false}); 
        this.props.onSoundChange(false);
      }
      else{
        this.setState({soundBtn: soundOnIcon, sound: true}); 
        this.props.onSoundChange(true);
      }
    }
  }

  onPlayClick() {
    if (this.state.isRunning){
      this.setState({playBtn: playIcon, isRunning: false}); 
      this.props.onPlayChange(false);
    }
    else{
      this.setState({playBtn: pauseIcon, isRunning: true}); 
      this.props.onPlayChange(true);
    }
  }

  onResetClick() {
    this.props.onReset();
    this.setState({playBtn: playIcon, isRunning: false});
  }

  componentWillReceiveProps(updatedProps) {
    if (!updatedProps.isRunning && this.state.isRunning){  // update state to false only if app is running
      this.setState({playBtn: playIcon, isRunning: false});
    }
  }

  render() {
    return(
      <div className="bottom-nav">
      <div className="slider-left-container">
        <input type="range" min="10" max="100" value={this.state.speed} className="slider" id="slider-speed" onChange={this.handleChange}/>
        <p id="speed-text">Speed</p>
      </div>
      <div className="control-container">
        <button className="button-sound" style={{backgroundImage: `url(${this.state.soundBtn})`}} onClick={this.onSoundClick}></button>
        <button className="button-play"  style={{backgroundImage: `url(${this.state.playBtn})`}} onClick={this.onPlayClick}></button>
        <button className="button-reset"  style={{backgroundImage: `url(${resetIcon})`}} onClick={this.onResetClick}></button>
      </div>
      <div className="slider-right-container">
        <p id="size-text">Size</p>
        <input type="range" min="2" max="100" value={this.state.size} className="slider" id="slider-size" onChange={this.handleChange}/>
      </div>
    </div>
    );
  }
}

export default BottomNav;