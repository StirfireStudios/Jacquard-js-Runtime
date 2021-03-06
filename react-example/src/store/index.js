import { createStore, compose } from 'redux';

import rootReducer from '../reducers'

let enhancer = null
if (process.env.NODE_ENV !== 'production') {
  enhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

export default function configureStore(initialState) {
  if (process.env.NODE_ENV === 'production') {
    return createStore(rootReducer, initialState);
  }
  
  const store = createStore(rootReducer, initialState, enhancer())

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
