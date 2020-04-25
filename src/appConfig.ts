
const appVersion = '0.0.1';
const buildVersion = 1;

const config = {
    development: {
        name: 'development',
        appVersion: appVersion,
        buildVersion: buildVersion,
        apiDomain: ' ',
    },
    staging: {
        name: 'staging',
        appVersion: appVersion,
        buildVersion: buildVersion,
        apiDomain: ' ',

    },
    production: {
        name: 'production',
        appVersion: appVersion,
        buildVersion: buildVersion,
        apiDomain: '',
    }
}

class AppConfig {

    config = config.development;

    constructor() {
    }

}

export const appConfig = new AppConfig();

