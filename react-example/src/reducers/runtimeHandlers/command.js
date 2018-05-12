export default function handle(textArray, message) {
  textArray.push(`<< Run Engine command: '${message.args.join("','")}' >>`);
}