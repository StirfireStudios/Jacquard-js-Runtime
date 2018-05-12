'use strict';

export default function addNewText(state, message) {
  for(let line of message.parts) {
    let textString = "";
    if (line.localizedCharacterName != null) {
      textString += line.localizedCharacterName + ": ";
    }
    textString += line.text;
    state.text.push(textString);  
  }
}