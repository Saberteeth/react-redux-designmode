import Store from "../action/store";

/**
 * enum of load.
 */
export class LoadType {
  static get LOADING() {
    return 0;
  }
  static get LOADEND() {
    return 1;
  }
  static get LOADERR() {
    return 2;
  }
}

/**
 * add load type for obj.
 * @param {object} obj 
 */
export function statusFactory(obj) {
  obj.status = {};
  for (name in obj) {
    obj.status[name + "Status"] = LoadType.LOADEND;
  }
  return obj;
}

/**
 * init state.
 */
function initState() {
  return statusFactory({
    readme: null,
    user: null
  });
}

const reducer = (state = initState(), action) => {
  switch (action.type) {
    case Store.TYPE:
      const active = action.data;
      const newState = Object.assign({}, state);
      switch (active.type) {
        case Store.LOAD_README:
          newState.status.readmeStatus = LoadType.LOADING;
          return newState;
        case Store.ERROR_README:
          newState.status.readmeStatus = LoadType.LOADERR;
          return newState;
        case Store.SUCCESS_README:
          newState.status.readmeStatus = LoadType.LOADEND;
          newState.readme = active[0];
          return newState;
        default:
          return state;
      }
    default:
      return state;
  }
};

export default reducer;
