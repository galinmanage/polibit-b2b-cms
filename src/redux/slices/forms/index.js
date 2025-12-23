import { createSlice } from '@reduxjs/toolkit';

let Slices = [];
let formReducers = {};
let formActions = {};

export const contactSlice = createSlice({
  name: 'contactForm',
  initialState: {},
  reducers: {
    updateContactForm: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetContactForm: () => {
      return {};
    },
  },
});
Slices.push(contactSlice);

//build export objects
for (const Slice of Slices) {
  formActions = { ...formActions, ...Slice.actions };
  let reducer = { [Slice.name]: Slice.reducer };
  formReducers = { ...formReducers, ...reducer };
}

export { formActions };
export { formReducers };
