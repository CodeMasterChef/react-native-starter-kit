
const appVersion = '0.0.8';
const buildVersion = 1;

const config = {
    development: {
        name: 'development',
        appVersion: appVersion,
        buildVersion: buildVersion,
        apiDomain: 'http://development.loyaworld.com:4000',
    },
    staging: {
        name: 'staging',
        appVersion: appVersion,
        buildVersion: buildVersion,
        apiDomain: 'https://staging.loyaworld.com:4001',

    },
    production: {
        name: 'production',
        appVersion: appVersion,
        buildVersion: buildVersion,
        apiDomain: 'https://api.loya.one:4001',
    }
}

class AppConfig {

    config = config.staging;

    constructor() {
    }

}

export const appConfig = new AppConfig();

