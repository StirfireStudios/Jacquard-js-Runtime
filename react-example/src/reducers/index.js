import { combineReducers } from 'redux'
import Data from './data';
import Runtime from './runtime';

const rootReducer = combineReducers({
  Data,
  Runtime,
})

export default rootReducer
