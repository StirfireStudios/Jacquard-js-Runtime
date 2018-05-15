'use strict';

import * as Command from './command';
import EndOfFile from './endoffile';
import Halt from './halt';
import NodeChange from './nodeChange';
import * as Options from './options';
import * as Text from './text';
import * as Variable from './variable';

const ExternalMessages = {
  Command: Command.Command,
  EndOfFile: EndOfFile,
  Halt: Halt,
  NodeChange: NodeChange,
  Options: Options.Options,
  Text: Text.externals,
  Variable: Variable,
}

export {
  Command, 
  ExternalMessages, 
  EndOfFile, 
  Halt,
  NodeChange,
  Options, 
  Text,
  Variable,
};