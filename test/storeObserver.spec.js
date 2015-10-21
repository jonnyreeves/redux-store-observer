import chai, { expect } from 'chai';
import { createStore } from 'redux';
import createStoreObserver from '../src/storeObserver'

describe('storeObserver', () => {
  const ACTION_A = 'ACTION_A';
  const ACTION_B = 'ACTION_B';

  function createDefaultStore() {
    return createStore((state = {}, action) => {
      if (action.type) {
        state = { last: action.type };
      }
      return state;
    });
  }

  let store;
  let storeObserver;

  beforeEach(() => {
    store = createDefaultStore();
    storeObserver = createStoreObserver(store);
  })

  describe('on', () => {
    it('should invoke the predicate with the store\'s getState method', () => {
      const predicate = chai.spy();

      storeObserver.on(predicate, () => null);
      store.dispatch({ type: ACTION_A });

      expect(predicate).to.have.been.called.with(store.getState);
    });

    it('should invoke the callback when the predicate matches a store update', () => {
      const spy = chai.spy();
      const predicate = (getState) => getState().last === ACTION_A;

      storeObserver.on(predicate, spy);
      store.dispatch({ type: ACTION_A });

      expect(spy).to.have.been.called();
    });

    it('should not invoke the callback when the predicate does not match a store update', () => {
      const spy = chai.spy();
      const predicate = (getState) => getState().last === ACTION_B;

      storeObserver.on(predicate, spy);
      store.dispatch({ type: ACTION_A });

      expect(spy).to.have.not.been.called();
    });

    it('should invoke the callback each time the predicate matches a store update', () => {
      const spy = chai.spy();
      const predicate = (getState) => getState().last === ACTION_A;

      storeObserver.on(predicate, spy);
      store.dispatch({ type: ACTION_A });
      store.dispatch({ type: ACTION_A });

      expect(spy).to.have.been.called.exactly(2);
    });

    it('should provide the means to unsubscribe from future store updates', () => {
      const spy = chai.spy();
      const predicate = (getState) => getState().last === ACTION_A;

      const unsubscribe = storeObserver.on(predicate, spy);
      store.dispatch({ type: ACTION_A });
      unsubscribe();
      store.dispatch({ type: ACTION_A });

      expect(spy).to.have.been.called.exactly(1);
    });
  });

  describe('once', () => {
    it('should invoke the predicate with the store\'s getState method', () => {
      const predicate = chai.spy();

      storeObserver.once(predicate, () => null);
      store.dispatch({ type: ACTION_A });

      expect(predicate).to.have.been.called.with(store.getState);
    });

    it('should invoke the callback when the predicate matches a store update', () => {
      const spy = chai.spy();
      const predicate = (getState) => getState().last === ACTION_A;

      storeObserver.once(predicate, spy);
      store.dispatch({ type: ACTION_A });

      expect(spy).to.have.been.called();
    });

    it('should not invoke the callback when the predicate does not match a store update', () => {
      const spy = chai.spy();
      const predicate = (getState) => getState().last === ACTION_B;

      storeObserver.once(predicate, spy);
      store.dispatch({ type: ACTION_A });

      expect(spy).to.have.not.been.called();
    });

    it('should invoke the callback only once when the predicate matches a store update', () => {
      const spy = chai.spy();
      const predicate = (getState) => getState().last === ACTION_A;

      storeObserver.once(predicate, spy);
      store.dispatch({ type: ACTION_A });
      store.dispatch({ type: ACTION_A });

      expect(spy).to.have.been.called.exactly(1);
    });

    it('should provide the means to unsubscribe from future store updates', () => {
      const spy = chai.spy();
      const predicate = (getState) => getState().last === ACTION_A;

      const unsubscribe = storeObserver.once(predicate, spy);
      unsubscribe();

      store.dispatch({ type: ACTION_A });
      store.dispatch({ type: ACTION_A });

      expect(spy).to.have.not.been.called();
    });
  })
});
