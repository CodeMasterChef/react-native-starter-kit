import { observable } from 'mobx';
import I18n from 'react-native-i18n';


export class GenderSelectStore {

    @observable
    isVisibleGenderModal = false;

    @observable
    selectedGenderText = '';

    @observable
    selectedGender!: number;

    genders = [
        { value: 0, label: I18n.t('male') },
        { value: 1, label: I18n.t('female') },
        { value: 2, label: I18n.t('other') },
    ]

    setSelectedGenderText = (label: string) => {
        this.selectedGenderText = label;
    }

    onPressGenderInput = () => {
        this.isVisibleGenderModal = true;
    }

    onPressGenderListItem = (gender: { label: string, value: number }) => {
        this.selectedGenderText = gender.label;
        this.selectedGender = gender.value;
        this.isVisibleGenderModal = false;
    }

}