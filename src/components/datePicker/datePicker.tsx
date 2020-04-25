import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { observer } from 'mobx-react';
import { defaultMargin } from '../../commons/constant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DatePickerStore } from './datePickerStore';
import { defaultStyles } from '../../commons/defaultStyles';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import I18n from 'react-native-i18n';
import { Colors } from '../../commons/colors';

interface Props {
    store: DatePickerStore,
    hideIcon?: boolean,
    textAlign?: 'right' | 'left' | 'center',
    onSelect?: (selectedDate: Date) => void,
}

@observer
export default class DatePicker extends Component<Props> {

    store: DatePickerStore;

    constructor(props: Props) {
        super(props);
        this.store = props.store;
        if (props.onSelect) {
            this.store.onSelect = props.onSelect;
        }
    }

    render() {
        return (
            <View style={defaultStyles.container}>
                <TouchableOpacity style={styles.textInputContainer} onPress={this.store.onPressDatePicker}>
                    <View style={styles.textInputIconContainer}>
                        {!this.props.hideIcon &&
                            <MaterialIcons
                                name='date-range'
                                size={32}
                                color={Colors.gray} />
                        }
                    </View>
                    <View style={styles.textInputTextContainer}>
                        <Text style={[styles.dateText, { textAlign: this.props.textAlign ? this.props.textAlign : 'left' }]}>{this.store.dateDisplay}</Text>
                    </View>
                </TouchableOpacity>

                {
                    (Platform.OS === 'ios') &&
                    <Modal isVisible={this.store.isVisibleDateModal}>
                        <View style={styles.dateModal}>
                            <RNDateTimePicker value={this.store.selectedDate} onChange={this.store.onChangeDate} />
                            <View style={styles.dateModalFooter}>
                                <TouchableOpacity style={[defaultStyles.lightButton, defaultStyles.margin]}
                                    onPress={this.store.onPressCloseDateModal}
                                >
                                    <Text style={defaultStyles.lightButtonText}>{I18n.t('cancel')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[defaultStyles.highlightButton, defaultStyles.margin]}
                                    onPress={this.store.onPressChooseDateModal}
                                >
                                    <Text style={defaultStyles.hightButtonText}>{I18n.t('choose')}</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>
                }
                {
                    (Platform.OS === 'android') &&
                    <View>
                        {
                            this.store.isVisibleDatePickerOnAndroid &&
                            <RNDateTimePicker value={this.store.selectedDate} onChange={this.store.onChangeDate} />
                        }
                    </View>
                }
            </View>
        );
    }

};



const styles = StyleSheet.create({
    textInputContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        minHeight: 45,
    },
    textInputIconContainer: {
        padding: defaultMargin,
    },
    textInputTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    dateText: {
        ...defaultStyles.text,
    },
    dateModal: {
        backgroundColor: Colors.white,
    },
    dateModalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});
