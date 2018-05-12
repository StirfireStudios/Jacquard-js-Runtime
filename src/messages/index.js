'use strict';

import * as Text from './text';
import * as Command from './command';
import * as Options from './options';
import EndOfFile from './endoffile';

const ExternalMessages = {
  Text: Text.externals,
  Command: Command.externals,
  Options: Options.externals,
  EndOfFile: EndOfFile,
}

export {Text, Command, ExternalMessages, EndOfFile, Options};