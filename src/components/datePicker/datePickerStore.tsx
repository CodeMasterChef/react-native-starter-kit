import { Platform } from "react-native";
import { observable, action } from "mobx";
import { timeHelper } from "../../helpers/timeHelper";
import { defaultDateFormat } from "../../commons/constant";

export class DatePickerStore {

    @observable
    isVisibleDateModal = false;

    @observable
    dateDisplay = defaultDateFormat;

    @observable
    isVisibleDatePickerOnAndroid = false;

    selectedDate = new Date();

    onSelect!: (selectedDate: Date) => void;

    constructor() {
        this.dateDisplay = defaultDateFormat;
        this.selectedDate = new Date();
    }

    @action
    setSelectedDate = (date: Date) => {
        this.selectedDate = date;
        this.dateDisplay = timeHelper.convertDateToDayMonthYear(this.selectedDate);
    }

    getSelectedDate = () => {
        return this.selectedDate;
    }

    getDateDisplay = () => {
        return this.dateDisplay;
    }

    onPressDatePicker = () => {
        if (Platform.OS === 'ios') {
            this.isVisibleDateModal = true;
        } else {
            this.isVisibleDatePickerOnAndroid = true;
        }
    }

    onPressCloseDateModal = () => {
        this.isVisibleDateModal = false;
    }

    onPressChooseDateModal = () => {
        if (this.selectedDate) {
            this.dateDisplay = timeHelper.convertDateToDayMonthYear(this.selectedDate);
            if (this.onSelect !== undefined) {
                this.onSelect(this.selectedDate);
            }
        }
        this.isVisibleDateModal = false;
    }

    onChangeDate = (event: any, date?: Date) => {
        if (event.type === 'dismissed') {
            this.isVisibleDatePickerOnAndroid = false;
        }
        if (date) {
            this.selectedDate = date;
            if (Platform.OS === 'android') {
                // on Android, the value changes when we click OK but on iOS, the value change when we scroll.
                this.isVisibleDatePickerOnAndroid = false;
                this.onPressChooseDateModal();
            }
        }
    }

}