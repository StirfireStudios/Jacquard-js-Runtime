'use strict';

import * as Command from './command';
import * as DialogueSegment from './dialogueSegment';
import * as Function from './function';
import EndOfFile from './endoffile';
import Halt from './halt';
import NodeChange from './nodeChange';
import * as Options from './options';
import * as Text from './text';
import * as Variable from './variable';

const ExternalMessages = {
  Command: Command.Command,
  DialogueSegment: DialogueSegment.DialogueSegment,
  EndOfFile: EndOfFile,
  Function: Function.Function,
  Halt: Halt,
  NodeChange: NodeChange,
  Options: Options.Options,
  Text: Text.externals,
  Variable: Variable,
}

export {
  Command, 
  DialogueSegment,
  ExternalMessages, 
  Function,
  EndOfFile, 
  Halt,
  NodeChange,
  Options, 
  Text,
  Variable,
};
