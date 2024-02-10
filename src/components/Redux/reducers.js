const initialStateLogin = {
  isLogin: false,
  name: '',
  isAdmin: false,
}

export const loginReducer = (state = initialStateLogin, action) => {
  switch (action.type) {
    case 'SET_ISLOGIN_VALUE':
      return {
        isLogin: action.payload.isLogin,
        name: action.payload.name,
        id: action.payload.id,
        isAdmin: action.payload.isAdmin,
      };
    default: return state;
  }
}

const initialStateRefreshFilesAdnFolders = {
  refresh: false,
}

export const refreshFilesAdnFoldersReducer = (state = initialStateRefreshFilesAdnFolders, action) => {
  switch (action.type) {
    case 'SET_REFRESHFILESANDFOLDERS_VALUE':
      return {
        refresh: action.payload.refresh,
      };
    default: return state;
  }
}

const initialStateParent = [{
  id: null,
  parentID: null,
}]

export const parentReducer = (state = initialStateParent, action) => {
  switch (action.type) {
    case 'ADD_PARENT_VALUE':
      return [...state, {
        id: action.payload.id,
        parentId: action.payload.parentId,
      }];

    case 'DELETE_PARENT_VALUE':
      return state.slice(0, state.length - 1);

    default: return state;
  }
}

const deleteFildFromObj = (obj, field) => {
  delete obj[field];

  return obj;
}

export const filesAndFoldersReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_FILESANDFOLDERS_STRUCT':
      return action.payload

    case 'SET_FILEORFOLDER_ACTIVE_STATE':
      return state.map(element =>
        element.id == action.payload.id ? { ...element, 'active': true } : element
      )

    case 'CLEAN_ALL_FILEORFOLDER_ACTIVE_STATE':
      return state.map(element =>
        'active' in element ? deleteFildFromObj(element, 'active') : element
      )

    case 'RENAME_FILEORFOLDER':
      return state.map(element =>
        'active' in element ? { ...element, 'name': action.payload.name } : element
      )

    case 'DELETE_FILEORFOLDER':
      return state.filter(element =>
        !('active' in element)
      )

    default: return state;
  }
}

export const diskModeReducer = (state = { active: false, user: '' }, action) => {
  switch (action.type) {
    case 'SET_DISKMODE_STATE':
      return action.payload
    default: return state;
  }
}

export const adminModeReducer = (state = { active: false}, action) => {
  switch (action.type) {
    case 'SET_ADMINMODE_STATE':
      return action.payload
    default: return state;
  }
}