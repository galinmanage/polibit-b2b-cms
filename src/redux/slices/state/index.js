import { createSlice } from '@reduxjs/toolkit';
import { generateUniqueId } from '../../../app/functions';

let Slices = [];
let stateReducers = {};
let stateActions = {};

export const deviceSlice = createSlice({
  name: 'deviceState',
  initialState: false,
  reducers: {
    setDeviceState: (state, action) => action.payload,
  },
});

// Action creators are generated for each case reducer function
Slices.push(deviceSlice);

/*---------------------------------------------------------------*/

export const loaderSlice = createSlice({
  name: 'loaderState',
  initialState: false,
  reducers: {
    setLoader: (state, action) => action.payload,
  },
});

// Action creators are generated for each case reducer function
Slices.push(loaderSlice);

/*---------------------------------------------------------------*/

export const homePageBurger = createSlice({
  name: 'homePageBurger',
  initialState: false,
  reducers: {
    toggleBurger: (state, action) => !state,
  },
});

// Action creators are generated for each case reducer function
Slices.push(homePageBurger);

/*---------------------------------------------------------------*/

export const popupsSlice = createSlice({
  name: 'popupsArray',
  initialState: [],
  reducers: {
    addPopup: (state, action) => {
      state = state.push({ key: generateUniqueId(), ...action.payload });
    },
    removePopup: (state, action) => {
      if (action.payload?.id) {
        return state.filter((popup) => popup.key !== action.payload.id);
      }

      state = state.pop();
    },
  },
});

// Action creators are generated for each case reducer function
Slices.push(popupsSlice);

/*---------------------------------------------------------------*/

export const requestingSlice = createSlice({
  name: 'requestingState',
  initialState: [],
  reducers: {
    requestStarted: (state, action) => [...state, generateUniqueId(25)],
    requestEnded: (state, action) => {
      state = state.pop();
    },
  },
});

// Action creators are generated for each case reducer function
Slices.push(requestingSlice);

/*---------------------------------------------------------------*/

export const burgerSlice = createSlice({
  name: 'burgerState',
  initialState: false,
  reducers: {
    setBurger: (state, action) => action.payload,
  },
});

// Action creators are generated for each case reducer function
Slices.push(burgerSlice);

/*---------------------------------------------------------------*/

export const pageScrollerSlice = createSlice({
  name: 'pageScrollerState',
  initialState: false,
  reducers: {
    setPageScroller: (state, action) => action.payload,
  },
});

// Action creators are generated for each case reducer function
Slices.push(pageScrollerSlice);

/*---------------------------------------------------------------*/

for (const Slice of Slices) {
  stateActions = { ...stateActions, ...Slice.actions };
  let reducer = { [Slice.name]: Slice.reducer };
  stateReducers = { ...stateReducers, ...reducer };
}

export { stateActions };
export { stateReducers };
