const OS = require('os');
const Path = require('path');
const ChildProcess = require('child_process');

const destination = Path.join("src", "jacquard-js-runtime");
const source = Path.join("..", "..", "dist");

if (OS.type() === "Windows_NT") {
  const command = `mklink /D ${destination} ${source}`;
  ChildProcess.exec(command);
} else {

  console.log(`Command is: ln -s ${destination} ${source}`);
}
