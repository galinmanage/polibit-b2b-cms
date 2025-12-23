import { stateActions } from '../slices/state';
import { formActions } from '../slices/forms';
import { dataActions } from '../slices/data';

const Actions = { ...stateActions, ...formActions, ...dataActions };
export default Actions;
