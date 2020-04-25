import { Brand } from './../../@model/brand';
import { observable, action } from 'mobx';
import { LinkMemberStore } from './linkMember/linkMemberStore';
import { RegisterMemberStore } from './registerMember/registerMemberStore';

export class LinkOrRegisterMemberModalStore {

    @observable
    brand!: Brand;

    @observable
    isVisible = false;

    @observable
    isRegisterMember = false;

    linkMemberStore!: LinkMemberStore;
    registerMemberStore!: RegisterMemberStore;

    constructor(brand?: Brand) {
        if (brand) {
            this.initStore(brand);      
        }
    }

    initStore = (brand: Brand) => {
        this.brand = brand;
        this.linkMemberStore = new LinkMemberStore(brand);
        this.registerMemberStore = new RegisterMemberStore(brand);
    }

    @action
    show = () => {
        this.isVisible = true;
    }

    @action
    hide = () => {
        this.isVisible = false;
    }

    @action
    setIsRegisterMember(isRegisterMember: boolean) {
        this.isRegisterMember = isRegisterMember;
    }

    onSwitchRegisterMember = () => {
        this.isRegisterMember = true;
    }

    onSwitchLinkMember = () => {
        this.isRegisterMember = false;
    }

    onLinkMemberSuccess = ()=>{
        this.hide();
    }

    onRegisterSuccess = () => {
        this.hide();
    }
}