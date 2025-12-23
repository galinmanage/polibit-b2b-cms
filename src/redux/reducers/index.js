import { stateReducers } from '../slices/state';
import { dataReducers } from '../slices/data';
import { formReducers } from '../slices/forms';

let Reducers = {};
for (let reducer in stateReducers) {
  Reducers[reducer] = stateReducers[reducer];
}
for (let reducer in dataReducers) {
  Reducers[reducer] = dataReducers[reducer];
}
for (let reducer in formReducers) {
  Reducers[reducer] = formReducers[reducer];
}
export default Reducers;
