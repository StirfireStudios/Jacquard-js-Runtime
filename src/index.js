'use strict';

export class Runtime {
  constructor() {

  }

  openBytecode(data) {
    console.log("woo!");
  }

  get variables() { return ["one", "two", "three"] }

  get functions() { return ["one", "two", "three"] }
}

export { default as fileType } from './fileType';
