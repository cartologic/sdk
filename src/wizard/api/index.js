import axios from 'axios';


function getCRSFToken() {
    let csrfToken, csrfMatch = document.cookie.match(/csrftoken=(\w+)/)
    if (csrfMatch && csrfMatch.length > 0) {
        csrfToken = csrfMatch[1]
    }
    return csrfToken
}

const apiInstance = axios.create({
    baseURL: `${window.location.origin}/api/`,
    timeout: 1000,
    headers: { "X-CSRFToken": getCRSFToken() }
})


function getCurrentUser() {
    return apiInstance.get(`users/current_user/`);
}

export function getMaps(offset, limit, showOnlyUserMaps, filter = null) {
    let filterPart = '';
    if (filter != null) {
        filterPart = '&' + filter.name + '=' + filter.value;
    }
    if (showOnlyUserMaps) {
        return getCurrentUser().then(
            response => {
                return apiInstance.get(`maps/?offset=${offset}&limit=${limit}&owner=${response.data.username}` + filterPart);
            });
    } else {
        return apiInstance.get(`maps/?offset=${offset}&limit=${limit}` + filterPart);
    }
}

export function getMap(mapId) {
    return apiInstance.get('maps/' + mapId);
};

export function getMapsByTitle(offset, limit, title, showOnlyUserMaps, filter) {
    let filterPart = '';
    if (filter != null) {
        filterPart = '&' + filter.name + '=' + filter.value;
    }
    if (showOnlyUserMaps) {
        return getCurrentUser().then(
            response => {
                return apiInstance.get(`maps/?offset=${offset}&limit=${limit}&title__icontains=${title}&owner=${response.data.username}` + filterPart);
            });
    } else {
        return apiInstance.get(`maps/?offset=${offset}&limit=${limit}&title__icontains=${title}` + filterPart);
    }
}

export function getUsers() {
    return apiInstance.get(`users`);
}


export function getAppInstance(appInstanceId) {
    return apiInstance.get('appinstance/' + appInstanceId);
};
