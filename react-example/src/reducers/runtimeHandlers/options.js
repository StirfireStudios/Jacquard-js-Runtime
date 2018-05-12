export default function handle(state, message, runtime) {
  state.originalIP = runtime.currentInstructionPointer;
  state.options = [];
  for(let Option of message.options) {
    
  }
}