'use strict';

import * as Text from './text';
import * as Command from './command';
import * as Options from './options';

const ExternalMessages = {
  Text: Text.externals,
  Command: Command.externals,
  Options: Options.externals,
}

export {Text, Command, ExternalMessages, Options};