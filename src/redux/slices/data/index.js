import { createSlice } from '@reduxjs/toolkit';
import SILENT_LOGIN from 'constants/silentLogin';

let Slices = [];
let dataReducers = {};
let dataActions = {};

export const gdSlice = createSlice({
  name: 'gd',
  initialState: false,
  reducers: {
    setGd: (state, action) => action.payload,
    setTranslations: (state, action) => ({
      ...state,
      translations: action.payload,
    }),
    setKeyValueObj: (state, action) => ({
      ...state,
      keyValueObj: action.payload,
    }),
    setStatusLeadColors: (state, action) => ({
      ...state,
      statusLeadColors: action.payload,
    }),
    setPermanentDeduction: (state, action) => ({
      ...state,
      permanentDeduction: action.payload,
    }),
  },
});
Slices.push(gdSlice);

/*---------------------------------------------------------------*/

export const userSlice = createSlice({
  name: 'userData',
  initialState: false,
  reducers: {
    setUser: (state, action) => action.payload,
    updateUserToken: (state, action) => {
      const userToken = action.payload;
      return { ...state, [SILENT_LOGIN.apiRequestKey]: userToken };
    },
  },
});

// Action creators are generated for each case reducer function
Slices.push(userSlice);

/*---------------------------------------------------------------*/

export const loginSlice = createSlice({
  name: 'didSilentLogin',
  initialState: false,
  reducers: {
    setSilentLogin: (state, action) => action.payload,
  },
});

// Action creators are generated for each case reducer function
Slices.push(loginSlice);

/*---------------------------------------------------------------*/

export const requestsDataSlice = createSlice({
  name: 'requestsData',
  initialState: {},
  reducers: {
    setRequestData: (state, action) => {
      const { request, data } = action.payload;
      return { ...state, [request]: data };
    },
  },
});

// Action creators are generated for each case reducer function
Slices.push(requestsDataSlice);

/*---------------------------------------------------------------*/

export const metaTagsSlice = createSlice({
  name: 'metaTags',
  initialState: false,
  reducers: {
    setMetaTags: (state, action) => action.payload,
  },
});

// Action creators are generated for each case reducer function
Slices.push(metaTagsSlice);

/*---------------------------------------------------------------*/

export const fieldsSlice = createSlice({
  name: 'fieldsData',
  initialState: {
    fields: [],
    newFieldForm: {},
    fieldsForm: {},
    flattenedFields: [],
  },
  reducers: {
    setNewFieldForm: (state, action) => {
      state.newFieldForm = action.payload;
    },
    setFieldsForm: (state, action) => {
      state.fieldsForm = action.payload;
    },
    setFields: (state, action) => {
      state.fields = action.payload;
    },
    setFlattenedFields: (state, action) => {
      state.flattenedFields = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
Slices.push(fieldsSlice);

/*---------------------------------------------------------------*/

export const distributorsSlice = createSlice({
  name: 'distributorData',
  initialState: [],
  reducers: {
    setDistributors: (state, action) => action.payload,
  },
});

// Action creators are generated for each case reducer function
Slices.push(distributorsSlice);

/*---------------------------------------------------------------*/

export const textsSlice = createSlice({
  name: 'textsData',
  initialState: [],
  reducers: {
    setTexts: (state, action) => action.payload,
  },
});

// Action creators are generated for each case reducer function
Slices.push(textsSlice);

/*---------------------------------------------------------------*/

export const providerNumbersSlice = createSlice({
  name: 'providerNumbersData',
  initialState: [],
  reducers: {
    setProviderNumbers: (state, action) => action.payload,
  },
});

// Action creators are generated for each case reducer function
Slices.push(providerNumbersSlice);

/*---------------------------------------------------------------*/

export const usersSlice = createSlice({
  name: 'usersData',
  initialState: [],
  reducers: {
    setUsers: (state, action) => action.payload,
  },
});

// Action creators are generated for each case reducer function
Slices.push(usersSlice);

/*---------------------------------------------------------------*/

export const homepageStatisticsSlice = createSlice({
  name: 'homepageStatisticsData',
  initialState: false,
  reducers: {
    setHomepageStatistics: (state, action) => action.payload,
  },
});

// Action creators are generated for each case reducer function
Slices.push(homepageStatisticsSlice);

/*---------------------------------------------------------------*/

export const translationsSlice = createSlice({
  name: 'translations',
  initialState: {
    texts: [],
    namespaces: [],
  },
  reducers: {
    setNamespaces: (state, action) => ({
      ...state,
      namespaces: action.payload,
    }),
    addNamespace: (state, action) => {
      state.namespaces.push(action.payload);
    },
    removeNamespace: (state, action) => {
      const newNamespaces = state.namespaces.filter(
        (namespace) => namespace.id !== action.payload,
      );
      return { ...state, namespaces: newNamespaces };
    },
    setTexts: (state, action) => ({
      ...state,
      texts: action.payload,
    }),
    updateText: (state, action) => {
      state.texts.find((text) => text.id === action.payload.id).value =
        action.payload.value;
    },
    addText: (state, action) => {
      state.texts.unshift(action.payload);
    },
    removeText: (state, action) => {
      const newTexts = state.texts.filter((text) => text.id !== action.payload);
      return { ...state, texts: newTexts };
    },
    removeTextsByNamespace: (state, action) => {
      const newTexts = state.texts.filter(
        (text) => text.namespaceId !== action.payload,
      );
      return { ...state, texts: newTexts };
    },
  },
});

// Action creators are generated for each case reducer function
Slices.push(translationsSlice);

/*---------------------------------------------------------------*/

export const mediaSlice = createSlice({
  name: 'mediaData',
  initialState: { images: [] },
  reducers: {
    setImages: (state, action) => {
      state.images = action.payload?.data;
    },
    addImage: (state, action) => {
      state.images.unshift(action.payload);
    },
    updateImage: (state, action) => {
      const updatedImage = action.payload;
      const index = state.images.findIndex((img) => img.id === updatedImage.id);
      if (index !== -1) {
        state.images[index] = { ...state.images[index], ...updatedImage };
      }
    },
    replaceImage: (state, action) => {
      const { id, url } = action.payload;
      const index = state.images.findIndex((img) => img.id === id);
      if (index !== -1) {
        state.images[index] = { ...state.images[index], url };
      }
    },
    removeImage: (state, action) => {
      const id = action.payload;
      state.images = state.images.filter((img) => img.id !== id);
    },
  },
});

// Action creators are generated for each case reducer function
Slices.push(mediaSlice);

/*---------------------------------------------------------------*/

//build export objects
for (const Slice of Slices) {
  dataActions = { ...dataActions, ...Slice.actions };
  let reducer = { [Slice.name]: Slice.reducer };
  dataReducers = { ...dataReducers, ...reducer };
}

export { dataActions, dataReducers };
