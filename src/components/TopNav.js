import React from 'react';
import './TopNav.css';

export default class TopNav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sort: 'Select Sort',
      key: 'Select Key',
      mode: 'Select Mode',
      accidental: '-',
      dropDownDisabled: false
    };
    this.onSortClick = this.onSortClick.bind(this);
    this.onKeyClick = this.onKeyClick.bind(this);
    this.onModeClick = this.onModeClick.bind(this);
    this.onAccidentalClick = this.onAccidentalClick.bind(this);
  }

  componentDidMount(){
    document.getElementById('dropdown').disabled = true;
  }

  onSortClick(event) { 
    if (!this.state.dropDownDisabled){
      this.setState({sort: event.target.value}); 
      this.props.onSort(event.target.value); 
    }
  }
  onKeyClick(event) { this.setState({key: event.target.value}); this.props.onKey(event.target.value); }
  onModeClick(event) { this.setState({mode: event.target.value}); this.props.onMode(event.target.value); }
  onAccidentalClick(event) { this.setState({accidental: event.target.value}); this.props.onAccidental(event.target.value); }

  updateStyles(enableDrop){
    const sort = document.getElementById('sort');
    const dropDown = document.getElementsByClassName('dropdown');

    if (enableDrop){
      sort.style.color = "white"
      sort.style.borderBottomColor = "white";
      dropDown[0].setAttribute('enabled', "true");
    }
    else{
      sort.style.color = "#b4b4b4";
      sort.style.borderBottomColor = "#b4b4b4";
      dropDown[0].setAttribute('enabled', "false");
    }
  }

  componentWillReceiveProps(updatedProps) {
    if (this.state.dropDownDisabled !== updatedProps.isRunning){  // prevents component from updating every time a prop is passed
      this.setState({dropDownDisabled: updatedProps.isRunning});
      if (updatedProps.isRunning == null) this.setState({dropDownDisabled: false});  // when website loads initially the dropdown is enabled
      else this.updateStyles(!updatedProps.isRunning);
    }
  }

  render() {
    return(
      <div className="top-nav">
        <h1 >Sorting Visualizer</h1>
        <div enabled="true" id="dropdown" className="dropdown">
          <button id="sort" className="dropbtn-sort">{this.state.sort}</button>
          <div className="dropdown-content">
            <button value="Selection Sort" onClick={this.onSortClick}>Selection Sort</button>
            <button value="Insertion Sort" onClick={this.onSortClick}>Insertion Sort</button>
            <button value="Bubble Sort" onClick={this.onSortClick}>Bubble Sort</button>
            <button value="Merge Sort" onClick={this.onSortClick}>Merge Sort</button>
          </div>
        </div>
        <div className="spacing"></div>
        <div enabled="true" id="dropdown" className="dropdown">
          <button id="key" className="dropbtn-key">{this.state.key}</button>
          <div className="dropdown-content">
            <button value="A" onClick={this.onKeyClick}>A</button>
            <button value="B" onClick={this.onKeyClick}>B</button>
            <button value="C" onClick={this.onKeyClick}>C</button>
            <button value="D" onClick={this.onKeyClick}>D</button>
            <button value="E" onClick={this.onKeyClick}>E</button>
            <button value="F" onClick={this.onKeyClick}>F</button>
            <button value="G" onClick={this.onKeyClick}>G</button>
          </div>
        </div>
        <div className="spacing"></div>
        <div enabled="true" id="dropdown" className="dropdown">
          <button id="mode" className="dropbtn-mode">{this.state.mode}</button>
          <div className="dropdown-content">
            <button value="Major" onClick={this.onModeClick}>Major</button>
            <button value="Minor" onClick={this.onModeClick}>Minor</button>
          </div>
        </div>
        <div className="spacing"></div>
        <div enabled="true" id="dropdown" className="dropdown">
          <button id="accent" className="dropbtn-accent">{this.state.accidental}</button>
          <div className="dropdown-content">
            <button value="-" onClick={this.onAccidentalClick}>-</button>
            <button value="#" onClick={this.onAccidentalClick}>#</button>
            <button value="b" onClick={this.onAccidentalClick}>b</button>
          </div>
        </div>
      </div>
    );
  }
}