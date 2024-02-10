import { combineReducers, legacy_createStore, compose } from "redux";
import { loginReducer, refreshFilesAdnFoldersReducer, parentReducer, filesAndFoldersReducer, diskModeReducer, adminModeReducer } from "./reducers";

const ReactReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

function configureStore() {
    return legacy_createStore(
        combineReducers({
            isLogin: loginReducer,
            isRefreshFilesAndFolfers: refreshFilesAdnFoldersReducer,
            parent: parentReducer,
            filesAndFolders: filesAndFoldersReducer,
            diskMode: diskModeReducer,
            adminMode: adminModeReducer,
        }),
        compose(ReactReduxDevTools)
    )
}

export default configureStore;