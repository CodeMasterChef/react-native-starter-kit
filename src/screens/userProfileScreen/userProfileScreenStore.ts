import { UploadPhotoResponseData, UploadPhotoRequestData, mediaApi } from './../../api/mediaApi';
import { emailRegexp, defaultDateFormat } from './../../commons/constant';
import { toastHelper } from './../../helpers/toastHelper';
import { GenderSelectStore } from './../../components/genderSelect/genderSelectStore';
import { DatePickerStore } from './../../components/datePicker/datePickerStore';
import { CountryCode } from 'react-native-country-picker-modal';
import { StatusCodeEnum } from './../../enum/statusCodeEnum';
import { authApi } from './../../api/authApi';
import { Account } from './../../@model/account';
import { observable, autorun, computed } from 'mobx';
import { timeHelper } from '../../helpers/timeHelper';
import I18n from 'react-native-i18n';
import { ProvinceSelectStore } from '../../components/provinceSelect/provinceSelectStore';
import { localAppStorageHelper } from '../../helpers/localAppStorageHelper';
import { stores } from '../../stores';
import ImagePicker, { ImagePickerOptions, ImagePickerResponse } from 'react-native-image-picker';


export class UserProfileScreenStore {


    @observable
    account = {} as Account;

    cloneAccount!: Account;

    @observable
    editable = false;

    @observable
    isUpdating = false;

    @observable
    isRefreshing = false;

    countryCode: CountryCode = 'VN';
    callingCode = '+84';

    @observable
    phone = '';

    @observable
    selectedProvinceText = '';

    selectedPhone = '';

    uploadPhotoResponseData!: UploadPhotoResponseData;

    datePickerStore = new DatePickerStore();

    genderSelectStore = new GenderSelectStore();

    provinceSelectStore = new ProvinceSelectStore();

    private imagePickerOptions: ImagePickerOptions = {
        title: I18n.t('select_avatar'),
        cancelButtonTitle: I18n.t('cancel'),
        takePhotoButtonTitle: I18n.t('take_photo'),
        chooseFromLibraryButtonTitle: I18n.t('choose_from_library'),
        mediaType: 'photo',
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };

    @observable
    pickerImageBase64!: string;

    private imagePickerResponse!: ImagePickerResponse;

    constructor() {
        autorun(async () => {
            await this.onRefresh();
        });
    }

    @computed get getGenderText() {
        if (!this.account || (this.account && (this.account.gender === null || this.account.gender === undefined))) {
            return '';
        } else return (this.account.gender === 0) ? I18n.t('male') : (this.account.gender === 1 ? I18n.t('female') : I18n.t('other'));
    }


    onRefresh = async () => {
        this.isRefreshing = true;
        const response = await authApi.getUserProfile();
        if (response && response.status_code === StatusCodeEnum.success) {
            const account = response.data;
            if (account) {
                this.account = account;
                this.cloneAccount = account;
                this.phone = account.phone ? account.phone.substring(this.callingCode.length, account.phone.length) : '';
                if (account.dateOfBirth) {
                    this.datePickerStore.dateDisplay = timeHelper.convertTimestampToDayMonthYear(account.dateOfBirth);
                    this.datePickerStore.setSelectedDate(new Date(account.dateOfBirth));
                }
                if (account.gender !== null && account.gender >= 0) {
                    this.genderSelectStore.selectedGender = account.gender;
                }
                if (account.province) {
                    this.provinceSelectStore.selectedProvince = account.province;
                }
            }
        }
        this.isRefreshing = false;
    }

    onPressAvatar = () => {
        if (this.editable) {
            ImagePicker.showImagePicker(this.imagePickerOptions, async (response) => {
                if (response.didCancel) {
                    // console.log('User cancelled image picker');
                } else if (response.error) {
                    // console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    // console.log('User tapped custom button: ', response.customButton);
                } else {
                    this.pickerImageBase64 = 'data:image/jpeg;base64,' + response.data;
                    this.imagePickerResponse = response;
                }
            });
        }
    }

    onChangeNameInput = (text: string) => {
        this.account.name = text;
    }

    onChangeEmailInput = (text: string) => {
        this.account.email = text;
    }

    onChangeAddressInput = (text: string) => {
        this.account.address = text;
    }

    onChangePhoneInput = (text: string) => {
        this.selectedPhone = text;
    }

    onPressEditButton = async () => {
        if (this.account && this.account.email) {
            if (!emailRegexp.test(this.account.email)) {
                toastHelper.infoWithCenter(I18n.t('email_invalid'));
                return;
            }
        }

        if (!this.editable) {
            this.editable = true;
            return;
        } else {
            this.editable = false;
        }

        this.isUpdating = true;
        this.isRefreshing = true;
        if (this.imagePickerResponse && this.pickerImageBase64) {
            const requestData: UploadPhotoRequestData = {
                type: 'base64',
                fileType: this.imagePickerResponse.type ? this.imagePickerResponse.type.split('/')[1] : 'jpg',
                contentType: this.imagePickerResponse.type ? this.imagePickerResponse.type : 'image/jpg',
                image: this.imagePickerResponse.data,
            }

            const uploadResponse = await mediaApi.uploadPhoto(requestData);

            if (uploadResponse && uploadResponse.status_code === StatusCodeEnum.success && uploadResponse.data) {
                this.account.urlAvatar = uploadResponse.data.link;
            } else {
                toastHelper.infoWithCenter(I18n.t('can_not_upload_photo_now'));
            }
        }
        this.account.gender = this.genderSelectStore.selectedGender;
        if (this.datePickerStore.dateDisplay !== defaultDateFormat) {
            this.account.dateOfBirth = this.datePickerStore.selectedDate?.getTime();
        }
        this.account.provinceId = this.provinceSelectStore.selectedProvince?.id;
        this.account.province = this.provinceSelectStore.getSelectedProvince();
        const response = await authApi.updateProfile(this.account);
        if (response.status_code === StatusCodeEnum.success) {
            toastHelper.success(I18n.t('update_successfully'));
            await localAppStorageHelper.setAccount(response.data);
            stores.accountScreenStore?.setName(response.data.name);
            if (this.imagePickerResponse) {
                stores.accountScreenStore?.setUrlAvatar(response.data.urlAvatar);
            }
        }
        this.isUpdating = false;
        this.isRefreshing = false;
    }
}