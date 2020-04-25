import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import { observer } from 'mobx-react';
import { PhoneInputStore } from './phoneInputStore';
import { Colors } from '../../commons/colors';
import { defaultMargin } from '../../commons/constant';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import { defaultStyles } from '../../commons/defaultStyles';

interface Props {
    store?: PhoneInputStore,
    onChangePhoneWithCountryCode: (phoneWithCountryCode: string) => void,
    phone?: string,
    countryCode?: CountryCode,
    textAlginRight?: boolean,
    hideClearButton?: boolean,
    disabled?: boolean,
}

@observer
export default class PhoneInput extends Component<Props> {

    store: PhoneInputStore;

    constructor(props: Props) {
        super(props);
        this.store = props.store || new PhoneInputStore();
        this.store.setOnChangePhoneWithCountryCodeCallback(props.onChangePhoneWithCountryCode);
        const phone = props.phone;
        if (phone) {
            this.store.setPhone(phone);
        }
        const countryCode = props.countryCode;
        if (countryCode) {
            this.store.setCountryCode(countryCode);
        }
    };

    componentDidMount() {
    }

    render() {

        return (
            <View style={[styles.textInputContainer, this.props.disabled ? styles.disabled : styles.active]}>
                <View style={styles.textInputIcon}>
                    {
                        this.props.disabled ?
                            <View>
                                <Text style={defaultStyles.text}>+{this.store.countryCalling}</Text>
                            </View> :
                            <CountryPicker
                                countryCode={this.store.countryCode}
                                translation={'common'}
                                withAlphaFilter={true}
                                withFilter={true}
                                withCallingCode={true}
                                withCallingCodeButton={true}
                                withEmoji={false}
                                withModal={true}
                                visible={false}
                                onSelect={this.store.onSelectCountry}
                            />

                    }

                </View>
                <TextInput style={[styles.textInputInput, styles.phoneInput, this.props.textAlginRight ? styles.textAlginRight : styles.textAlignLeft]}
                    keyboardType='numeric'
                    returnKeyType='done'
                    editable={!this.props.disabled}
                    clearButtonMode={this.props.hideClearButton ? 'never' : 'always'}
                    value={this.store.phone}
                    onChangeText={this.store.onChangePhoneInput}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    textInputIcon: {
        backgroundColor: Colors.white,
        padding: defaultMargin,
    },
    textInputInput: {
        flex: 1,
        paddingLeft: 10,
        backgroundColor: Colors.white,
    },
    phoneInput: {
        fontSize: 16,
        paddingLeft: 10,
        borderLeftColor: Colors.lightGray,
        borderLeftWidth: 2,
    },
    textAlginRight: {
        textAlign: 'right',
    },
    textAlignLeft: {
        textAlign: 'left',
    },
    disabled: {
        opacity: 0.7,
    },
    active: {
        opacity: 1,
    }
});


