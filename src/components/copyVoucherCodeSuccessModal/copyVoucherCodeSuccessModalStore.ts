import { observable, action } from 'mobx';
import { Clipboard, Linking } from 'react-native';

export class CopyVoucherCodeSuccessModalStore {

    @observable
    isVisible = false;

    code?: string;

    url?: string;

    init = (code?: string, url?: string) => {
        this.code = code;
        this.url = url;
    }

    @action
    hide = () => {
        this.isVisible = false;
    }

    @action
    show = () => {
        this.isVisible = true;
    }

    navigate = () => {
        setTimeout(() => {
            if (this.url) {
                setTimeout(() => {
                    this.hide();
                    Linking.openURL(this.url as string).then(() => {
                    }).catch(() => { });
                }, 1500);
            } else {
                this.hide();
            }
        }, 3000)
    }
}