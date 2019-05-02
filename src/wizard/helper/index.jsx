import { APP_MODE } from '../shared';
import { getAppInstance, getMap } from '../api';
import * as actions from '../actions';

export function defineAppMode(url, store) {
    //setting app mode new/edit 
    var urlParts = url.split("/");
    if (urlParts[urlParts.length - 1] == 'edit') {
        var appInstanceId = urlParts[urlParts.length - 2];
        store.dispatch(actions.setAppMode(APP_MODE.EDIT));

        //in edit mode so fetching the app instance from api and store it
        getAppInstance(appInstanceId).then(
            response => {
                store.dispatch(actions.setToEditInstance(response.data));
                store.dispatch(actions.setInitialData(response.data));

                //get app map for any use for ex. to set center and zoom for bookmarks initial map view
                getMap(response.data.app_map).then(app_map => {
                    store.dispatch(actions.setMapData(app_map.data));
                });
            });
    } else {
        store.dispatch(actions.setAppMode(APP_MODE.ADD_NEW));
    }
}