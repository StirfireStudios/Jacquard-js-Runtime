import { Messages } from '../../jacquard-js-runtime'

import handleShowText from './showText';
import handleCommand from './command';
import handleVariable from './variable';

export default function handle(textArray, message) {
  const text = [];
  for(let subMessage of message.messages) {
    switch(subMessage.constructor) {
      case Messages.Text.Show:
        handleShowText(text, subMessage);
        break;
      case Messages.Command:
        handleCommand(text, subMessage);
        break;
      case Messages.Variable.Load:
        handleVariable(text, subMessage);
        break;  
    }
  }

  textArray.push({ 
    dialogSegment: `0x${message.id.toString(16)}`,
    characterIndex: message.characterIndex,
    text: text,
  });
}
