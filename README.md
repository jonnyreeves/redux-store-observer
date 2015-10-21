# redux-store-observer
> Respond to Redux Store Stage Changes

Inspired by [@gaearon](https://github.com/gaearon)'s comment on [rackt/redux#303](https://github.com/rackt/redux/issues/303): 
> If you don't want to use RX and prefer a callback... again easy to do.

`redux-store-observer` provides a thin wrapper around Redux's `store#subscribe()` to allow you to respond to state changes.

## Usage
After you've created your store, create a new storeObserver instance by invoking `createStoreObserver(store)`.

#### `index.js`
```js
import { createStore, applyMiddleware, compose } from 'redux';
import createStoreObserver from 'redux-store-observer';

// Create your app's store in the usual way.
const store = applyMiddleware(/* your middleware */)(createStore)(reducer);

// Export a storeObserver for your app's store.
export const storeObserver = createStoreObserver(store);
```

You can now import the exported `storeObserver` from anywhere else in your project where you want to observe store changes (eg: thunk'd action creators, or middleware):

#### `actions.js`
```js
import { storeObserver } from './index';

export function reticulateSplines() {
  // Get notified when `store.isFinished === true`
  const unsubscribe = storeObserver.once(
    getState => getState().isFinished === true,
    () => console.log('Something else finished!');
  );
}
```

## API
#### createStoreObserver(store)
`createStoreObserver` creates and returns a new storeObserver instance which observes the supplied store instance.

#### storeObserver#on(predicate, callback)
`on` will invoke the supplied `callback` function each time the supplied `predicate` function returns true in response to store changes.  Use the predicate to determine when the callback is fired.  The predicate is invoked with store's `getState` function.  An `unsubscribe` function is returned which can be used to prevent further callbacks.

#### storeObserver#once(predicate, callback)
`once` will invoke the supplied callback once, and only once when the supplied predicate function returns true in response to store changes.  The predicate is invoked with store's `getState` function.  An `unsubscribe` function is returned which can be used to prevent further callbacks.
