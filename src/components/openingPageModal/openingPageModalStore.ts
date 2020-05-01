import { observable, action } from 'mobx';
export class OpeningPageModalStore {

    @observable
    isVisible = false;

    @action
    hide = () => {
        this.isVisible = false;
    }

    @action
    show = () => {
        this.isVisible = true;
    }
}