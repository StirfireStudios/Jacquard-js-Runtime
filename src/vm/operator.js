'use strict';

import * as FileIO from '../fileIO';

function fixOperand(value) {
  if (value == null) return 0;
  return value;
}

function getLeftRightOperands(ipState, handle, offset) {
  const leftIndex = FileIO.ReadByte(handle, offset);
  const rightIndex = FileIO.ReadByte(handle, offset + leftIndex.length);

  let left = fixOperand(ipState.args[leftIndex.data]);
  let right = fixOperand(ipState.args[rightIndex.data]);

  return {
    left: left,
    right: right,
    length: leftIndex.length + rightIndex.length,
  }
}

function getOperand(ipState, handle, offset) {
  const index = FileIO.ReadByte(handle, offset);

  return {
    value: ipState.args[index.data],
    length: index.length,
  }
}

export function Add(ipState, handle, offset) {
  const operands = getLeftRightOperands(ipState, handle, offset);
  ipState.args.unshift(operands.left + operands.right);
  return { length: operands.length };
}

export function Subtract(ipState, handle, offset) {
  const operands = getLeftRightOperands(ipState, handle, offset);
  ipState.args.unshift(operands.left - operands.right);
  return { length: operands.length };
}

export function Multiply(ipState, handle, offset) {
  const operands = getLeftRightOperands(ipState, handle, offset);
  ipState.args.unshift(operands.left * operands.right);
  return { length: operands.length };
}

export function Divide(ipState, handle, offset) {
  const operands = getLeftRightOperands(ipState, handle, offset);
  ipState.args.unshift(operands.left / operands.right);
  return { length: operands.length };
}

export function Modulus(ipState, handle, offset) {
  const operands = getLeftRightOperands(ipState, handle, offset);
  ipState.args.unshift(operands.left % operands.right);
  return { length: operands.length };
}

export function Equal(ipState, handle, offset) {
  const operands = getLeftRightOperands(ipState, handle, offset);
  ipState.args.unshift(operands.left == operands.right);
  return { length: operands.length };
}

export function Not(ipState, handle, offset) {
  const operand = getOperand(ipState, handle, offset);
  ipState.args.unshift(!operand.value);
  return { length: operand.length };
}

export function And(ipState, handle, offset) {
  const operands = getLeftRightOperands(ipState, handle, offset);
  ipState.args.unshift(operands.left && operands.right);
  return { length: operands.length };
}

export function Or(ipState, handle, offset) {
  const operands = getLeftRightOperands(ipState, handle, offset);
  ipState.args.unshift(operands.left || operands.right);
  return { length: operands.length };
}

export function Xor(ipState, handle, offset) {
  const operands = getLeftRightOperands(ipState, handle, offset);
  const or = operands.left || operands.right;
  const and = operands.left && operands.right;
  ipState.args.unshift(or && !and);
  return { length: operands.length };
}

export function GreaterThan(ipState, handle, offset) {
  const operands = getLeftRightOperands(ipState, handle, offset);
  ipState.args.unshift(operands.left > operands.right);
  return { length: operands.length };
}

export function LessThan(ipState, handle, offset) {
  const operands = getLeftRightOperands(ipState, handle, offset);
  ipState.args.unshift(operands.left < operands.right);
  return { length: operands.length };
}