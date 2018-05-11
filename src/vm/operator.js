'use strict';

import * as FileIO from '../fileIO';

function getLeftRightOperands(handle, offset) {
  const leftIndex = FileIO.ReadVarInt(handle, offset);
  const rightIndex = FileIO.ReadVarInt(handle, offset + leftIndex.length);

  return {
    left: leftIndex.data,
    right: rightIndex.data,
    length: leftIndex.length + rightIndex.length,
  }
}

function getOperand(handle, offset) {
  const index = FileIO.ReadVarInt(handle, offset);

  return {
    value: index.data,
    length: index.length,
  }
}

export function Add(state, handle, offset) {
  const operands = getLeftRightOperands(handle, offset);
  return {
    data: operands.left + operands.right,
    length: operands.length,
  }
}

export function Subtract(state, handle, offset) {
  const operands = getLeftRightOperands(handle, offset);
  return {
    data: operands.left - operands.right,
    length: operands.length,
  }
}

export function Multiply(state, handle, offset) {
  const operands = getLeftRightOperands(handle, offset);
  return {
    data: operands.left * operands.right,
    length: operands.length,
  }
}

export function Divide(state, handle, offset) {
  const operands = getLeftRightOperands(handle, offset);
  return {
    data: operands.left / operands.right,
    length: operands.length,
  }
}

export function Modulus(state, handle, offset) {
  const operands = getLeftRightOperands(handle, offset);
  return {
    data: operands.left % operands.right,
    length: operands.length,
  }
}

export function Equal(state, handle, offset) {
  const operands = getLeftRightOperands(handle, offset);
  return {
    data: operands.left == operands.right,
    length: operands.length,
  }
}

export function Not(state, handle, offset) {
  const operand = getOperand(handle, offset);
  return {
    data: !operand.value,
    length: operand.length,
  }
}

export function And(state, handle, offset) {
  const operands = getLeftRightOperands(handle, offset);
  return {
    data: operands.left && operands.right,
    length: operands.length,
  }
}

export function Or(state, handle, offset) {
  const operands = getLeftRightOperands(handle, offset);
  return {
    data: operands.left || operands.right,
    length: operands.length,
  }
}

export function Xor(state, handle, offset) {
  const operands = getLeftRightOperands(handle, offset);
  const or = operands.left || operands.right;
  const and = operands.left && operands.right;

  return {
    data: (or && !and),
    length: operands.length,
  }
}

export function GreaterThan(state, handle, offset) {
  const operands = getLeftRightOperands(handle, offset);

  return {
    data: operands.left > operands.right,
    length: operands.length,
  }
}

export function LessThan(state, handle, offset) {
  const operands = getLeftRightOperands(handle, offset);

  return {
    data: operands.left < operands.right,
    length: operands.length,
  }
}