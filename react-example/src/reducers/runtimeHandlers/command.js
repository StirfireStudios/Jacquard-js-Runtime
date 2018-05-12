export default function handle(state, message) {
  state.text.push(`<< Run Engine command: '${message.args.join("','")}' >>`);
}