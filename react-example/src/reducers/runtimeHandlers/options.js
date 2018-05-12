import handleShowText from './showText';
import handleCommand from './command';

export default function handle(state, message, runtime) {
  debugger;
  state.originalIP = runtime.currentInstructionPointer;
  state.options = [];
  const options = message.options;
  for(let optionIP of options) {
    const option = {IP: optionIP, text: []};
    runtime.moveInstructionPointerTo(optionIP);
    let keepRunning = true;
    while(keepRunning) {
      runtime.run();
      if (runtime.currentMessage != null) {
        switch(runtime.currentMessage.constructor.name) {
          case "ShowText":
            handleShowText(option.text, runtime.currentMessage);
            keepRunning = false;
            break;
          case "Command":
            handleCommand(option.text, runtime.currentMessage);
            break;
          default:
            throw new Error("Can't display option due to bad command");
        }
      }  
    }
    state.options.push(option);
  }
}