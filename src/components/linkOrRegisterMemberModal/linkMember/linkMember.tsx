import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AuthType } from '../../../@model/brand';
import { defaultStyles } from '../../../commons/defaultStyles';
import PhoneInput from '../../../components/phoneInput/phoneInput';
import I18n from 'react-native-i18n';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PasswordInput from '../../../components/passwordInput/passwordInput';
import { observer } from 'mobx-react';
import { defaultBorderWidth, defaultBorderRadius, defaultMargin, deviceHeight } from '../../../commons/constant';
import CheckBox from 'react-native-check-box';
import Toast from '../../../components/toast';
import { Colors } from '../../../commons/colors';
import { WebView } from 'react-native-webview';
import Modal from 'react-native-modal';
import { LinkMemberStore } from './linkMemberStore';
import LottieView from 'lottie-react-native';
import Loading from '../../loading/loading';

interface Props {
    store: LinkMemberStore,
    onSwitchRegisterMember: any,
    onLinkMemberSuccess: any,
}

@observer
export default class LinkMember extends Component<Props> {

    store!: LinkMemberStore;

    constructor(props: Props) {
        super(props);
        if (props && props.store) {
            this.store = props.store;
            if (props.onLinkMemberSuccess) {
                this.store.onLinkMemberSuccess = props.onLinkMemberSuccess;
            }
        }
    };


    render() {
        return (
            <View>

                <Text style={styles.title}>{I18n.t('link_wallet')}</Text>
                {
                    this.store.isLoading &&
                    <Loading />
                }
                {
                    (!this.store.isLoading && this.store.isLinked) &&
                    <View style={defaultStyles.centerCenter}>
                        <LottieView style={styles.animation} source={require('../../../assets/animations/congratulation.json')} autoPlay />
                        <Text style={[styles.statusPanelText]}>{I18n.t('you_are_current_member')}</Text>
                    </View>
                }
                {
                    (!this.store.isLoading && !this.store.isLinked) &&
                    <View>
                        {
                            this.store.brand?.authTypes?.map(authType => {
                                return (
                                    <View key={authType}>
                                        {
                                            (authType === AuthType.phone) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('phone_number')}:</Text>
                                                <View style={styles.input}>
                                                    <PhoneInput onChangePhoneWithCountryCode={phoneWithCountryCode => this.store.onChangeText(phoneWithCountryCode, authType)} />
                                                </View>
                                            </View>
                                        }
                                        {
                                            (authType === AuthType.password) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('password')}:</Text>
                                                <View style={styles.input}>
                                                    <PasswordInput onChangePassword={text => this.store.onChangeText(text, authType)} />
                                                </View>
                                            </View>
                                        }
                                        {
                                            (authType === AuthType.username) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('username')}:</Text>
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
                                                        value={this.store.fieldValues[authType]}
                                                        onChangeText={text => this.store.onChangeText(text, authType)}
                                                    />
                                                </View>
                                            </View>
                                        }
                                        {
                                            (authType === AuthType.fullName) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('full_name')}:</Text>
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
                                                        value={this.store.fieldValues[authType]}
                                                        onChangeText={text => this.store.onChangeText(text, authType)}
                                                    />
                                                </View>
                                            </View>
                                        }
                                        {
                                            (authType === AuthType.email) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('email')}:</Text>
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
                                                        value={this.store.fieldValues[authType]}
                                                        onChangeText={text => this.store.onChangeText(text, authType)}
                                                    />

                                                </View>
                                            </View>
                                        }
                                        {
                                            (authType === AuthType.memberId) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('member_id')}:</Text>
                                                <View style={styles.textInputContainer}>
                                                    <View style={styles.textInputIcon}>
                                                        <MaterialCommunityIcons
                                                            name='barcode'
                                                            size={32}
                                                            color={Colors.gray} />
                                                    </View>
                                                    <TextInput style={defaultStyles.container}
                                                        returnKeyType='done'
                                                        clearButtonMode='always'
                                                        value={this.store.fieldValues[authType]}
                                                        onChangeText={text => this.store.onChangeText(text, authType)}
                                                    />
                                                </View>
                                            </View>
                                        }
                                        {
                                            (authType === AuthType.firstName) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('first_name')}:</Text>
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
                                                        value={this.store.fieldValues[authType]}
                                                        onChangeText={text => this.store.onChangeText(text, authType)}
                                                    />

                                                </View>
                                            </View>
                                        }
                                        {
                                            (authType === AuthType.lastName) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('last_name')}:</Text>
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
                                                        value={this.store.fieldValues[authType]}
                                                        onChangeText={text => this.store.onChangeText(text, authType)}
                                                    />

                                                </View>
                                            </View>
                                        }
                                        {
                                            (authType === AuthType.pin) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('pin')}:</Text>
                                                <View style={styles.textInputContainer}>
                                                    <View style={styles.textInputIcon}>
                                                        <MaterialCommunityIcons
                                                            name='textbox-password'
                                                            size={32}
                                                            color={Colors.gray} />
                                                    </View>
                                                    <TextInput style={defaultStyles.container}
                                                        returnKeyType='done'
                                                        clearButtonMode='always'
                                                        keyboardType='numeric'
                                                        value={this.store.fieldValues[authType]}
                                                        onChangeText={text => this.store.onChangeText(text, authType)}
                                                    />
                                                </View>
                                            </View>
                                        }
                                        {
                                            (authType === AuthType.code) &&
                                            <View style={defaultStyles.marginVertical}>
                                                <Text style={[defaultStyles.text, defaultStyles.marginVertical]}>{I18n.t('postal_code')}:</Text>
                                                <View style={styles.textInputContainer}>
                                                    <View style={styles.textInputIcon}>
                                                        <MaterialCommunityIcons
                                                            name='barcode'
                                                            size={32}
                                                            color={Colors.gray} />
                                                    </View>
                                                    <TextInput style={defaultStyles.container}
                                                        returnKeyType='done'
                                                        clearButtonMode='always'
                                                        value={this.store.fieldValues[authType]}
                                                        onChangeText={text => this.store.onChangeText(text, authType)}
                                                    />
                                                </View>
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

                        <View style={defaultStyles.marginVertical}>
                            <TouchableOpacity
                                style={[styles.submitButton, (this.store.invalidForm || (!!this.store.brand.policy && !this.store.policyChecked)) ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate]}
                                disabled={(this.store.invalidForm || (!!this.store.brand.policy && !this.store.policyChecked))}
                                onPress={this.store.onPressSubmitButton}>
                                <Text style={[defaultStyles.textWhite, styles.submitText]}>{I18n.t('link')}</Text>
                            </TouchableOpacity>
                        </View>

                        {
                            (this.store.brand && this.store.brand.registerMemberTypes && this.store.brand.registerMemberTypes.length > 0) &&
                            <View style={[defaultStyles.horizontalCenter, defaultStyles.margin]}>
                                <Text style={[defaultStyles.text]}>{I18n.t('you_are_not_member')}</Text>
                                <TouchableOpacity onPress={() => { this.store.onPressRegisterButton(this.props.onSwitchRegisterMember) }}>
                                    <Text style={[defaultStyles.textLink, defaultStyles.margin]}>{I18n.t('register_now')}</Text>
                                </TouchableOpacity>
                            </View>
                        }


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

                        <Toast ref={(ref: Toast) => this.store.errorToast = ref}
                            position='top'
                            positionValue={-80}
                            style={defaultStyles.errorToast}
                            textStyle={{
                                color: Colors.white,
                            }} />

                    </View>
                }


            </View>
        )
    }
}

const styles = StyleSheet.create({

    input: {
        borderColor: Colors.primary,
        borderWidth: defaultBorderWidth,
    },
    animation: {
        width: 200,
        height: 200,
    },
    statusPanelText: {
        ...defaultStyles.text,
        textAlign: 'center',
    },
    registerMemberLink: {
        alignItems: 'center',
        paddingBottom: defaultMargin,
    },
    registerMemberText: {
        ...defaultStyles.text,
        ...defaultStyles.textLink,
    },
    submitText: {
        padding: defaultMargin,
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
    textInputInput: {
        flex: 1,
        paddingLeft: 10,
        backgroundColor: Colors.white,
    },
    policyLink: {
        justifyContent: 'center',
        left: -2,
    },
    termsOfUseText: {
        alignItems: 'center',
    },
    title: {
        ...defaultStyles.textBold,
        fontSize: 20,
        margin: defaultMargin,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: Colors.highlight,
        alignItems: 'center',
        borderRadius: defaultBorderRadius,
        paddingBottom: defaultMargin,
    },
    modalContent: {
        flex: 1,
        backgroundColor: Colors.white,
        minHeight: deviceHeight * 0.94,
        borderRadius: defaultBorderRadius,

    },
})


