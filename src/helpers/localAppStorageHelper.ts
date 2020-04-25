import { Account } from './../@model/account';
import AsyncStorage from '@react-native-community/async-storage';

enum LocalStorageKeyEnum {
    accessToken = 'AT',
    fcmToken = 'FT',
    account = 'A',
    isReadIntro = 'IRN',
    savedDeepLinkBrandId = 'SDLBI',
}

class LocalAppStorageHelper {

    private async set(key: LocalStorageKeyEnum, value: any) {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    }

    private async get(key: LocalStorageKeyEnum) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
            return JSON.parse(value);
        } else {
            return null;
        }
    }

    async delete(key: LocalStorageKeyEnum) {
        await AsyncStorage.removeItem(key);
    }

    async clear() {
        for (let key in LocalStorageKeyEnum) {
            if (key !== 'fcmToken' && key !== 'isReadIntro') {
                await AsyncStorage.removeItem((LocalStorageKeyEnum as any)[key]);
            }
        }
    }

    async getAccessToken(): Promise<string> {
        return await this.get(LocalStorageKeyEnum.accessToken);
    }

    async setAccessToken(accessToken: string) {
        await this.set(LocalStorageKeyEnum.accessToken, accessToken);
    }

    async getAccount(): Promise<Account> {
        return await this.get(LocalStorageKeyEnum.account);
    }

    async setAccount(account: Account) {
        await this.set(LocalStorageKeyEnum.account, account);
    }

    async getIsReadIntro(): Promise<boolean> {
        return await this.get(LocalStorageKeyEnum.isReadIntro);
    }

    async setIsReadIntro(isRead: boolean) {
        await this.set(LocalStorageKeyEnum.isReadIntro, isRead);
    }

    async getSavedDeepLinkBrandId(): Promise<string> {
        return await this.get(LocalStorageKeyEnum.savedDeepLinkBrandId);
    }

    async setSavedDeepLinkBrandId(savedDeepLinkBrandId: string | null) {
        await this.set(LocalStorageKeyEnum.savedDeepLinkBrandId, savedDeepLinkBrandId);
    }

}

export const localAppStorageHelper = new LocalAppStorageHelper();