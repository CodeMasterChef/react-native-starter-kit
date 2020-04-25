import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { utilityApi } from './../../api/utilityApi';
import { observable, autorun, action } from 'mobx';
import { Province } from '../../@model/province';


export class ProvinceSelectStore {

    @observable
    isVisibleProvinceModal = false;

    @observable
    selectedProvince!: Province;

    @observable
    selectedProvinceText = '';

    @action
    setSelectedProvinceText = (name: string) => {
        this.selectedProvinceText = name;
    }

    getSelectedProvince = () => {
        return this.selectedProvince;
    }

    provinces = [] as Province[];

    constructor() {
        autorun(async () => {
            await this.getProvinces();
        })
    }

    getProvinces = async () => {
        const response = await utilityApi.getProvinces('VN');
        if (response && response.data && response.status_code === StatusCodeEnum.success) {
            this.provinces = response.data.items;
        }
    }

    onPressProvinceInput = () => {
        this.isVisibleProvinceModal = true;
    }

    onPressProvinceListItem = (province: Province) => {
        this.selectedProvince = province;
        this.selectedProvinceText = province.name;
        this.isVisibleProvinceModal = false;
    }

}