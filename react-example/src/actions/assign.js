import { assignAll } from 'redux-act';

import * as Data from './data'
import * as Runtime from './runtime';

const actions = [Data, Runtime];

export default function(store) {
  actions.forEach((actionType) => {
    assignAll(actionType, store);
  })
}
