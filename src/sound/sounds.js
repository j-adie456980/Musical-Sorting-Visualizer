import * as Tone from "tone";

export function getSynth(){
    const synth = new Tone.Synth({
        volume: 0,
        detune: 0,
        portamento: 0.05,
        envelope: {
            attack: 0.05,
            attackCurve: "exponential",
            decay: 0.2,
            decayCurve: "exponential",
            release: 1.5,
            releaseCurve: "exponential",
            sustain: 0.2
        },
        oscillator: {
            partialCount: 0,
            partials: [],
            phase: 0,
            type: "amtriangle",
            harmonicity: 0.5,
            modulationType: "square"
        }
    }).toDestination();
    return synth;
}

export function playNote(value, state){
    state.audio.triggerAttack(getNote(value, state), '64n');
    state.audio.triggerRelease();
}

function getNote(value, state){
    const notes = generateNotes(state);
    return notes[value-1];
}

function generateNotes(state){
    const scale = getScale(state);
    const notes = [];
    let octave = 1;
    let octavePivotIdx = 0;
    
    // Tone js is C centric so octave must be shifted up 1
    if (scale[0][0] === 'C') octavePivotIdx = -1;
    else{
        for (let i = 0; i < scale.length; i++){  
            if (scale[i][0] === 'C') { octavePivotIdx = i; break; }
        }
    }
    if (octavePivotIdx === 0){  // for scales that don't have C, use alternative pivot of D
        for (let i = 0; i < scale.length; i++){  
            if (scale[i][0] === 'D') { octavePivotIdx = i; break; }
        }
    }
    
    while (notes.length < 100){
        for (let i = 0; i < scale.length; i++){
            if (i >= octavePivotIdx){
                notes.push(`${scale[i]}${octave+1}`);
                notes.push(`${scale[i]}${octave+1}`);
            }
            else{
                notes.push(`${scale[i]}${octave}`);
                notes.push(`${scale[i]}${octave}`);
            }
        }
        octave+=1;
    }
    return notes;
}

function getScale(state){
    let accidental = '';  // needs to be left blank for searching for notes without a sharp or flat
    if (state.accidental === '#') accidental = '#';
    if (state.accidental === 'b') accidental = 'b';

    const tempChromScale = getChromaticScale(accidental);
    const steps = getModeSteps(state.mode);
    let rootNote = `${state.key}${accidental}`

    // Odd Notation Handling
    switch(rootNote) {
        case 'E#':
            rootNote = 'F'; break;  
        case 'Fb':
            rootNote = 'E'; break; 
        case 'B#':
            rootNote = 'C'; break;  
        case 'Cb':
            rootNote = 'B'; break; 
        default: break;
    }

    let noteIdx = tempChromScale.indexOf(rootNote);
    const notes = [ tempChromScale[noteIdx] ];  // initial value is root note of key

    while (steps.length > 0){
        (steps[0] === "W") ? noteIdx += 2 : noteIdx += 1;
        notes.push(tempChromScale[noteIdx]);
        steps.shift();
    }

    return notes;
}

function getChromaticScale(accidental){
    return (accidental === "b") ? 
    
    ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", 
     "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"] // marked with '+' because the octave needs to be raised
                                   : 
    ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", 
     "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
}

function getModeSteps(mode){
    switch(mode) {
        case 'Major':
          return ['W','W','H','W','W','W'];  
        case 'Minor':
          return ['W','H','W','W','H','W'];
        default:
            return ['W','W','H','W','W','W']; // Default to Major
    }
}