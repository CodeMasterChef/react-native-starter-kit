import { appConfig } from './../appConfig';
import { localAppStorageHelper } from '../helpers/localAppStorageHelper';
import { Alert } from 'react-native';
import { appRoutes } from '../navigators/appRoutes';
import I18n from 'i18n-js';
import { stores } from '../stores';

class Http {

    async get(url: string, headers: any) {
        url = this.handelUrl(url);
        if (!headers) {
            headers = this.getUnAuthorizedHeader();
        }
        try {
            let response = await fetch(url, {
                method: 'GET',
                headers: headers
            });
            let responseJson = await response.json();
            this.handleResponse(responseJson, url);
            return responseJson;
        } catch (error) {
            return error;
        }
    }

    async post(url: string, body: any, headers: any) {
        url = this.handelUrl(url);
        if (!headers) {
            headers = this.getUnAuthorizedHeader();
        }
        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });
            let responseJson = await response.json();
            this.handleResponse(responseJson, url);
            return responseJson;
        } catch (error) {
            return error;
        }
    }

    async put(url: string, body: any, headers: any) {
        url = this.handelUrl(url);
        if (!headers) {
            headers = this.getUnAuthorizedHeader();
        }
        try {
            let response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(body)
            });
            let responseJson = await response.json();
            this.handleResponse(responseJson, url);
            return responseJson;
        } catch (error) {
            return error;
        }
    }

    async delete(url: string, headers: any) {
        url = this.handelUrl(url);
        if (!headers) {
            headers = this.getUnAuthorizedHeader();
        }
        try {
            let response = await fetch(url, {
                method: 'DELETE',
                headers: headers,
            });
            let responseJson = await response.json();
            this.handleResponse(responseJson, url);
            return responseJson;
        } catch (error) {
            return error;
        }
    }


    private handelUrl(url: string) {
        if (!url.includes('http')) {
            url = (url[0] === '/') ? `${appConfig.config.apiDomain}${url}` : `${appConfig.config.apiDomain}/${url}`;
        }
        return url;
    }

    getUnAuthorizedHeader() {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        return headers;
    }

    async getAuthorizedHeader() {
        const accessToken = await localAppStorageHelper.getAccessToken();
        const authorization = accessToken;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': authorization
        }
        return headers;
    }

    /**
     * 
     * @param object : example {
        parameter1: 'value_1',
        parameter2: 'value 2',
        parameter3: 'value&3' 
        }
    * The result: "parameter1=value_1&parameter2=value%202&parameter3=value%263"
    * 
     */

    objectToQueryParams(object: Object) {
        const esc = encodeURIComponent;
        const query = Object.keys(object)
            .map(k => `${esc(k)}=${esc((object as any)[k])}`)
            .join('&');
        return query;

    }

    private handleResponse = async (response: any, url?: string) => {
        if (response.status === 403) {
            console.log('http: ', url, response);
            Alert.alert(
                I18n.t('confirm'),
                I18n.t('login_session_expired'),
                [
                    {
                        text: I18n.t('login_again'),
                        onPress: this.logout,
                    },
                ],
                { cancelable: false },
            );



        }
    }

    private logout = async () => {
        await localAppStorageHelper.clear();
        stores.navigation?.navigate(appRoutes.authNavigator);
    }
}

export const http = new Http();