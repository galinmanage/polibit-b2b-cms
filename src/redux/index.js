import { configureStore } from '@reduxjs/toolkit';
import Reducers from './reducers';

const Store = configureStore({
  reducer: Reducers,
  /* remove warning for non serialized data in store */
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default Store;
