import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { RegisterMemberStore } from './registerMemberStore';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Platform, ScrollView, RefreshControl } from 'react-native';
import { RegisterMemberType } from '../../../@model/brand';
import { defaultStyles } from '../../../commons/defaultStyles';
import I18n from 'react-native-i18n';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { defaultBorderWidth, defaultBorderRadius, defaultMargin, deviceHeight, loadingCircleSize, processCircleSnailColors, processCircleSnailSpinDuration } from '../../../commons/constant';
import { Colors } from '../../../commons/colors';
import PhoneInput from '../../../components/phoneInput/phoneInput';
import CheckBox from 'react-native-check-box';
import Toast from '../../../components/toast';
import Modal from 'react-native-modal';
import WebView from 'react-native-webview';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { RegisterMemberStatus } from '../../../api/pointApi';
import * as Progress from 'react-native-progress';
import LottieView from 'lottie-react-native';

interface Props {
    store: RegisterMemberStore,
    onSwitchLinkMember: any,
    onRegisterSuccess?: any,
}

@observer
export default class RegisterMember extends Component<Props> {

    store = {} as RegisterMemberStore;

    constructor(props: Props) {
        super(props);
        if (props && props.store) {
            this.store = props.store;
            if (props.onRegisterSuccess) {
                this.store.onRegisterSuccess = props.onRegisterSuccess;
            }
        }

    };

    render() {
        return (
            <ScrollView>
                <Text style={styles.title}>{I18n.t('register_member')}</Text>
                {
                    !this.store.isResubmit &&
                    <View style={[styles.statusPanel]}>
                        {
                            (this.store.registerMemberInformation && this.store.registerMemberInformation.status === RegisterMemberStatus.pending) &&
                            <View style={defaultStyles.centerCenter}>
                                <LottieView style={styles.animation} source={require('../../../assets/animations/reading.json')} autoPlay />
                                <Text style={[styles.statusPanelText]}>{I18n.t('your_membership_request_is_being_reviewed')}</Text>
                            </View>

                        }
                        {
                            (this.store.registerMemberInformation && this.store.registerMemberInformation.status === RegisterMemberStatus.verified) &&
                            <View style={defaultStyles.centerCenter}>
                                <LottieView style={styles.animation} source={require('../../../assets/animations/congratulation.json')} autoPlay />
                                <Text style={[styles.statusPanelText]}>{I18n.t('you_are_current_member')}</Text>
                                <TouchableOpacity style={defaultStyles.horizontalCenter} onPress={() => { this.store.onPressLinkButton(this.props.onSwitchLinkMember) }}>
                                    <Text style={[defaultStyles.textLink]}>{I18n.t('link_wallet_now')}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {
                            (this.store.registerMemberInformation && this.store.registerMemberInformation.status === RegisterMemberStatus.rejected) &&
                            <View>
                                <Text style={[styles.statusPanelText]}>{I18n.t('your_register_member_request_is_cancel')} <Text style=
                                    {defaultStyles.textRed}>{this.store.registerMemberInformation.reason}</Text></Text>
                                <TouchableOpacity
                                    onPress={this.store.onPressResubmitButton}
                                    style={[defaultStyles.highlightButton, defaultStyles.horizontalCenter, defaultStyles.margin]}
                                >
                                    <Text style={defaultStyles.hightButtonText}>{I18n.t('register_member_again')}</Text>
                                </TouchableOpacity>
                            </View>

                        }
                    </View>
                }
                {
                    (this.store.isRefreshing) &&
                    <View style={{ height: loadingCircleSize }}>
                        <View style={defaultStyles.horizontalCenter}>
                            <View style={{ width: loadingCircleSize }}>
                                <Progress.CircleSnail
                                    size={loadingCircleSize}
                                    color={processCircleSnailColors}
                                    spinDuration={processCircleSnailSpinDuration}
                                />
                            </View>
                        </View>
                    </View>
                }

                {
                    ((this.store.brand && this.store.brand.registerMemberTypes && !this.store.registerMemberInformation)
                        || (this.store.brand && this.store.brand.registerMemberTypes && this.store.isResubmit)) &&
                    <View>
                        {
                            this.store.brand?.registerMemberTypes?.map(registerMemberType => {
                                return (
                                    <View key={registerMemberType}>
                                        {
                                            (registerMemberType === RegisterMemberType.name || registerMemberType === RegisterMemberType.nameRequired) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('name')}:
                                                    {
                                                        (registerMemberType === RegisterMemberType.nameRequired) &&
                                                        <Text style={defaultStyles.textRed}>*</Text>
                                                    }
                                                </Text>
                                                <View style={styles.textInputContainer}>
                                                    <View style={styles.textInputIcon}>
                                                        <AntDesign
                                                            name='user'
                                                            size={32}
                                                            color={Colors.gray} />
                                                    </View>
                                                    <TextInput style={defaultStyles.container}
                                                        returnKeyType='done'
                                                        clearButtonMode='always'
                                                        value={this.store.fieldValues[registerMemberType]}
                                                        onChangeText={text => this.store.updateAndValidateText(text, registerMemberType)}
                                                    />
                                                </View>
                                            </View>
                                        }
                                        {
                                            (registerMemberType === RegisterMemberType.birthday || registerMemberType === RegisterMemberType.birthdayRequired) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('birthday')}:
                                                {
                                                        (registerMemberType === RegisterMemberType.birthdayRequired) &&
                                                        <Text style={defaultStyles.textRed}>*</Text>
                                                    }
                                                </Text>
                                                <TouchableOpacity style={styles.textInputContainer} onPress={this.store.onPressDatePicker}>
                                                    <View style={styles.textInputIcon}>
                                                        <MaterialIcons
                                                            name='date-range'
                                                            size={32}
                                                            color={Colors.gray} />
                                                    </View>
                                                    <View style={[defaultStyles.container, defaultStyles.verticalCenter]}>
                                                        <Text style={defaultStyles.text}>{this.store.dateDisplay}</Text>
                                                    </View>
                                                </TouchableOpacity>

                                                {
                                                    (Platform.OS === 'ios') &&
                                                    <Modal isVisible={this.store.isVisibleDateModal}>
                                                        <View style={styles.datePickerContainer}>
                                                            <RNDateTimePicker value={new Date()} onChange={this.store.onChangeDate} />
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
                                                            <RNDateTimePicker value={new Date()} onChange={this.store.onChangeDate} />
                                                        }
                                                    </View>
                                                }

                                            </View>

                                        }
                                        {
                                            (registerMemberType === RegisterMemberType.idCard || registerMemberType === RegisterMemberType.idCardRequired) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('id_card')}:
                                                {
                                                        (registerMemberType === RegisterMemberType.idCardRequired) &&
                                                        <Text style={defaultStyles.textRed}>*</Text>
                                                    }
                                                </Text>
                                                <View style={styles.textInputContainer}>
                                                    <View style={styles.textInputIcon}>
                                                        <AntDesign
                                                            name='idcard'
                                                            size={32}
                                                            color={Colors.gray} />
                                                    </View>
                                                    <TextInput style={defaultStyles.container}
                                                        returnKeyType='done'
                                                        clearButtonMode='always'
                                                        value={this.store.fieldValues[registerMemberType]}
                                                        onChangeText={text => this.store.updateAndValidateText(text, registerMemberType)}
                                                    />
                                                </View>
                                            </View>
                                        }
                                        {
                                            (registerMemberType === RegisterMemberType.phone || registerMemberType === RegisterMemberType.phoneRequired) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('phone_number')}:
                                                {
                                                        (registerMemberType === RegisterMemberType.phoneRequired) &&
                                                        <Text style={defaultStyles.textRed}>*</Text>
                                                    }
                                                </Text>
                                                <View style={styles.phoneInput}>
                                                    <PhoneInput
                                                        store={this.store.phoneInputStore}
                                                        disabled={true}
                                                        onChangePhoneWithCountryCode={phoneWithCountryCode => this.store.updateAndValidateText(phoneWithCountryCode, registerMemberType)} />
                                                </View>
                                                {
                                                    this.store.isInvalidPhoneInput &&
                                                    <Text style={defaultStyles.textRed}>{I18n.t('invalid_phone')}</Text>
                                                }
                                            </View>
                                        }
                                        {
                                            (registerMemberType === RegisterMemberType.email || registerMemberType === RegisterMemberType.emailRequired) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('email')}:
                                                {
                                                        (registerMemberType === RegisterMemberType.emailRequired) &&
                                                        <Text style={defaultStyles.textRed}>*</Text>
                                                    }
                                                </Text>
                                                <View style={styles.textInputContainer}>
                                                    <View style={styles.textInputIcon}>
                                                        <MaterialCommunityIcons
                                                            name='email-outline'
                                                            size={32}
                                                            color={Colors.gray} />
                                                    </View>
                                                    <TextInput style={defaultStyles.container}
                                                        returnKeyType='done'
                                                        clearButtonMode='always'
                                                        value={this.store.fieldValues[registerMemberType]}
                                                        onChangeText={text => this.store.updateAndValidateText(text, registerMemberType)}
                                                    />
                                                </View>
                                                {
                                                    this.store.isInvalidEmailInput &&
                                                    <Text style={defaultStyles.textRed}>{I18n.t('email_invalid')}</Text>
                                                }

                                            </View>
                                        }
                                        {
                                            (registerMemberType === RegisterMemberType.address || registerMemberType === RegisterMemberType.addressRequired) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('address')}:
                                                    {
                                                        (registerMemberType === RegisterMemberType.addressRequired) &&
                                                        <Text style={defaultStyles.textRed}>*</Text>
                                                    }
                                                </Text>
                                                <View style={styles.textInputContainer}>
                                                    <View style={styles.textInputIcon}>
                                                        <MaterialIcons
                                                            name='location-city'
                                                            size={32}
                                                            color={Colors.gray} />
                                                    </View>
                                                    <TextInput style={defaultStyles.container}
                                                        returnKeyType='done'
                                                        clearButtonMode='always'
                                                        value={this.store.fieldValues[registerMemberType]}
                                                        onChangeText={text => this.store.updateAndValidateText(text, registerMemberType)}
                                                    />

                                                </View>
                                            </View>
                                        }
                                        {
                                            (registerMemberType === RegisterMemberType.gender || registerMemberType === RegisterMemberType.genderRequired) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('gender')}:
                                                    {
                                                        (registerMemberType === RegisterMemberType.genderRequired) &&
                                                        <Text style={defaultStyles.textRed}>*</Text>
                                                    }
                                                </Text>
                                                <TouchableOpacity style={styles.textInputContainer}
                                                    onPress={this.store.onPressGenderInput}
                                                >
                                                    <View style={styles.textInputIcon}>
                                                        <AntDesign
                                                            name='user'
                                                            size={32}
                                                            color={Colors.gray} />
                                                    </View>
                                                    <View style={[defaultStyles.container, defaultStyles.verticalCenter]}>
                                                        <Text style={defaultStyles.text}>{this.store.genderDisplay}</Text>
                                                    </View>

                                                </TouchableOpacity>

                                                <Modal isVisible={this.store.isVisibleGenderModal}>
                                                    <View style={styles.datePickerContainer}>
                                                        {
                                                            this.store.genders.map((gender) => {
                                                                return (
                                                                    <TouchableOpacity
                                                                        style={styles.listItem}
                                                                        onPress={() => this.store.onPressGenderListItem(gender, registerMemberType)}>
                                                                        <Text style={[defaultStyles.text, defaultStyles.margin]}>{gender.label}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            })
                                                        }

                                                    </View>
                                                </Modal>

                                            </View>
                                        }
                                    </View>
                                )

                            })
                        }

                        {
                            !!(this.store.brand.policy) &&
                            <View>
                                <View style={[defaultStyles.marginVertical, defaultStyles.horizontalCenter]}>
                                    <TouchableOpacity style={styles.policyLink}
                                        onPress={this.store.onPressPolicyLink}
                                    >
                                        <Text style={defaultStyles.textLink}>{I18n.t('terms_of_use')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[defaultStyles.marginVertical]}>
                                    <CheckBox
                                        style={defaultStyles.container}
                                        onClick={this.store.onPressCheckBox}
                                        isChecked={this.store.policyChecked}
                                        checkBoxColor={Colors.primary}
                                        rightText={I18n.t('i_agree_with_brand_policy')}
                                        rightTextStyle={defaultStyles.text}

                                    />
                                </View>

                            </View>
                        }

                        <View style={[defaultStyles.marginVertical]}>
                            <CheckBox
                                style={defaultStyles.container}
                                onClick={this.store.onPressAgreeUpdateCheckBox}
                                isChecked={this.store.agreeUpdateChecked}
                                checkBoxColor={Colors.primary}
                                rightText={I18n.t('use_provided_info_to_update_profile')}
                                rightTextStyle={defaultStyles.text}

                            />
                        </View>

                        <View style={defaultStyles.marginVertical}>
                            <TouchableOpacity
                                style={[styles.submitButton, (this.store.invalidForm || (!!this.store.brand.policy && !this.store.policyChecked)) ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate]}
                                disabled={(this.store.invalidForm || (!!this.store.brand.policy && !this.store.policyChecked))}
                                onPress={this.store.onPressSubmitButton}>
                                <Text style={[defaultStyles.textWhite, styles.submitText]}>{I18n.t('register_member')}</Text>
                            </TouchableOpacity>
                        </View>

                        <Modal
                            isVisible={this.store.isVisiblePolicyModal}
                        >
                            <View style={styles.modalContent}>
                                <View style={defaultStyles.container}>
                                    <View style={styles.termsOfUseText}>
                                        <Text style={[defaultStyles.margin, defaultStyles.textBold]}>{I18n.t('terms_of_use')}</Text>
                                    </View>
                                    {
                                        !!(this.store.brand.policy) &&
                                        <WebView
                                            style={[defaultStyles.margin]}
                                            source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${this.store.brand.policy}</body></html>` }}
                                        >
                                        </WebView>
                                    }
                                    <TouchableOpacity
                                        style={[defaultStyles.margin, styles.submitButton]}
                                        onPress={this.store.onPressClosePolicyModal}>
                                        <Text style={[defaultStyles.textWhite, styles.submitText]}>{I18n.t('close')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>


                        <Toast ref={(ref: Toast) => this.store.successToast = ref}
                            position='top'
                            positionValue={-80}
                            style={defaultStyles.successToast}
                            textStyle={{
                                color: Colors.white,
                            }} />


                        <Toast ref={(ref: Toast) => this.store.errorToast = ref}
                            position='top'
                            positionValue={-80}
                            style={defaultStyles.errorToast}
                            textStyle={{
                                color: Colors.white,
                            }} />
                    </View>
                }
                {
                    (!this.store.registerMemberInformation
                        || (this.store.registerMemberInformation && this.store.registerMemberInformation.status !== RegisterMemberStatus.verified)) &&
                    <View style={[defaultStyles.horizontalCenter, defaultStyles.margin]}>
                        <Text style={[defaultStyles.text]}>{I18n.t('are_you_member')}</Text>
                        <TouchableOpacity onPress={() => { this.store.onPressLinkButton(this.props.onSwitchLinkMember) }}>
                            <Text style={[defaultStyles.textLink, defaultStyles.margin]}>{I18n.t('link_wallet_now')}</Text>
                        </TouchableOpacity>
                    </View>
                }

            </ScrollView>



        )
    }


}

const styles = StyleSheet.create({
    input: {
        borderColor: Colors.primary,
        borderWidth: defaultBorderWidth,
    },
    phoneInput: {
        borderColor: Colors.lightGray,
        borderWidth: defaultBorderWidth,
        borderRadius: defaultBorderRadius,
        height: 47.5,
        justifyContent: 'center',
    },
    textInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: Colors.primary,
        borderWidth: defaultBorderWidth,
        borderRadius: defaultBorderRadius,
    },
    textInputIcon: {
        padding: defaultMargin,
    },
    policyLink: {
        justifyContent: 'center',
        left: -2,
    },
    termsOfUseText: {
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: Colors.highlight,
        alignItems: 'center',
        borderRadius: defaultBorderRadius,
        paddingBottom: defaultMargin,
    },
    submitText: {
        padding: defaultMargin,
    },
    title: {
        ...defaultStyles.textBold,
        fontSize: 20,
        margin: defaultMargin,
        textAlign: 'center',
    },
    modalContent: {
        flex: 1,
        backgroundColor: Colors.white,
        minHeight: deviceHeight * 0.94,
        borderRadius: defaultBorderRadius,
    },
    listItem: {
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: 1,
        padding: defaultMargin,
    },
    datePickerContainer: {
        backgroundColor: Colors.white,
    },
    dateModalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    statusPanel: {
        marginHorizontal: defaultMargin,
        marginVertical: defaultMargin * 3,
        alignItems: 'center',
    },
    animation: {
        width: 200,
        height: 200,
    },
    statusPanelText: {
        ...defaultStyles.text,
        textAlign: 'center',
    }
})