import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, Image, TextInput, Keyboard, TouchableOpacity } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import { Colors } from '../../commons/colors';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { defaultMargin, defaultBorderWidth, defaultBorderRadius, modalCloseIconSize, deviceHeight, modalBackdropOpacity, defaultToastPosition } from '../../commons/constant';
import CountryPicker from 'react-native-country-picker-modal';
import { RegisterScreenStore } from './registerScreenStore';
import { observer, } from 'mobx-react';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationScreenProp } from 'react-navigation';
import Toast from '../../components/toast';
import { appStore } from '../../appStore';
import Loading from '../../components/loading/loading';
const registerScreenMargin = defaultMargin * 2;

interface Props {
    navigation: NavigationScreenProp<any>,
    resetPasswordMode: boolean,
}
@observer
export default class RegisterScreen extends Component<Props> {

    public static navigationOptions = {
        header: null,
    };

    store = new RegisterScreenStore();
    resetPasswordMode = false;

    constructor(props: Props) {
        super(props);
        this.resetPasswordMode = this.props.navigation.getParam('resetPasswordMode');
        this.store.setNavigation(this.props.navigation);
        this.store.setResetPasswordMode(this.resetPasswordMode);
    };

    render() {
        const invalid = !this.store.phone || !this.store.countryCalling || (!this.resetPasswordMode && !this.store.name) || !this.store.password || (!this.resetPasswordMode && !this.store.confirmPassword) || !!this.store.invalidPasswordMessage || !!this.store.invalidConfirmPasswordMessage;
        return (
            <View style={styles.screen}>
                <KeyboardAwareScrollView style={defaultStyles.container}>
                    <ImageBackground
                        style={styles.headerImage}
                        source={require('../../assets/images/header.png')}
                    >
                        <View style={styles.logoContainer}>
                            <Image
                                style={styles.logo}
                                source={require('../../assets/images/logo.png')}
                            />
                            <Text style={styles.logoText}>LOYAL ONE</Text>
                        </View>

                    </ImageBackground>
                    <LinearGradient
                        colors={['#210044', '#3A0069', '#3A0069']} style={[styles.radianArea]}>
                        <Text style={styles.screenName}>{this.resetPasswordMode ? I18n.t('forgot_password') : I18n.t('register')}</Text>
                        <View style={styles.textInputArea}>
                            <Text style={defaultStyles.textWhite}>{I18n.t('phone_number')}:</Text>
                            <View style={styles.textInputContainer}>
                                <View style={styles.textInputIcon}>
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
                                </View>
                                <TextInput style={[styles.textInputInput, styles.phoneInput]}
                                    keyboardType='numeric'
                                    returnKeyType='done'
                                    clearButtonMode='always'
                                    value={this.store.phone}
                                    onChangeText={this.store.onChangePhoneInput}
                                />
                            </View>
                        </View>
                        {
                            (!this.resetPasswordMode) &&
                            <View style={styles.textInputArea}>
                                <Text style={defaultStyles.textWhite}>{I18n.t('name')}:</Text>
                                <View style={styles.textInputContainer}>
                                    <View style={styles.textInputIcon}>
                                        <AntDesign name='user' size={32}
                                            color={Colors.gray} />
                                    </View>
                                    <TextInput style={styles.textInputInput}
                                        returnKeyType='done'
                                        clearButtonMode='always'
                                        value={this.store.name}
                                        onChangeText={this.store.onChangeNameInput}
                                    />

                                </View>
                                {
                                    !!(this.store.invalidNameMessage) &&
                                    <Text style={defaultStyles.textDanger}>{this.store.invalidNameMessage}.</Text>
                                }
                            </View>
                        }

                        <View style={styles.textInputArea}>
                            <Text style={defaultStyles.textWhite}>{this.resetPasswordMode ? I18n.t('new_password') : I18n.t('password')}:</Text>
                            <View style={styles.textInputContainer}>
                                <View style={styles.textInputIcon}>
                                    <MaterialCommunityIcons name='lock-outline' size={32}
                                        color={Colors.gray} />
                                </View>
                                <TextInput style={styles.textInputInput}
                                    returnKeyType='done'
                                    secureTextEntry={!this.store.showingPassword}
                                    value={this.store.password}
                                    onChangeText={this.store.onChangePasswordInput}
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                />
                                <View style={styles.textInputIcon}>
                                    <TouchableOpacity onPress={this.store.onPressPasswordEyeIcon}>
                                        <MaterialCommunityIcons name={(this.store.showingPassword) ? 'eye-outline' : 'eye-off-outline'} size={32}
                                            color={Colors.gray} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {
                                !!(this.store.invalidPasswordMessage) &&
                                <Text style={defaultStyles.textDanger}>{this.store.invalidPasswordMessage}!</Text>
                            }

                        </View>
                        {
                            (!this.resetPasswordMode) &&
                            <View style={styles.textInputArea}>
                                <Text style={defaultStyles.textWhite}>{I18n.t('confirm_password')}:</Text>
                                <View style={styles.textInputContainer}>
                                    <View style={styles.textInputIcon}>
                                        <MaterialCommunityIcons name='lock-outline' size={32}
                                            color={Colors.gray} />
                                    </View>
                                    <TextInput style={styles.textInputInput}
                                        returnKeyType='done'
                                        secureTextEntry={!this.store.showingConfirmPassword}
                                        placeholder={I18n.t('enter_above_password_again')}
                                        value={this.store.confirmPassword}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                        onChangeText={this.store.onChangeConfirmPasswordInput}
                                    />
                                    <View style={styles.textInputIcon}>
                                        <TouchableOpacity onPress={this.store.onPressConfirmPasswordEyeIcon}>
                                            <MaterialCommunityIcons name={(this.store.showingConfirmPassword) ? 'eye-outline' : 'eye-off-outline'} size={32}
                                                color={Colors.gray} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    !!(this.store.invalidConfirmPasswordMessage) &&
                                    <Text style={defaultStyles.textDanger}>{this.store.invalidConfirmPasswordMessage}!</Text>
                                }

                            </View>
                        }

                        <View style={styles.textInputArea}>
                            <View style={(invalid || this.store.isProgressing) ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate} >
                                <TouchableOpacity
                                    style={styles.registerButton}
                                    disabled={invalid || this.store.isProgressing}
                                    onPress={this.store.onPressSubmitButton}>
                                    {
                                        this.store.isProgressing ?
                                            <Loading colors={[Colors.white]} size={43} /> :
                                            <Text style={[defaultStyles.text, styles.loginText]} >
                                                {this.resetPasswordMode ? I18n.t('reset_password') : I18n.t('register')}
                                            </Text>
                                    }
                                </TouchableOpacity>
                            </View>
                            {
                                (appStore.devMode) &&
                                <View style={styles.textInputArea}>



                                    <Text style={defaultStyles.textWhite}>Session Info:</Text>
                                    <View style={styles.textInputContainer}>
                                        <TextInput
                                            style={[styles.textInputInput, { height: 100 }]}
                                            multiline={true}
                                            numberOfLines={3}
                                            returnKeyType='done'
                                            value={this.store.sessionInfo}
                                        />
                                        <View style={styles.textInputIcon}>
                                            <TouchableOpacity
                                                onPress={() => this.store.onPressCopyButton(this.store.sessionInfo)}
                                            >
                                                <MaterialCommunityIcons name='content-copy' color={Colors.black} size={modalCloseIconSize} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>




                                </View>
                            }

                        </View>
                        <View style={[styles.textInputArea, defaultStyles.marginVertical, defaultStyles.horizontalCenter]}>
                            <TouchableOpacity onPress={this.store.onPressLogin}>
                                <Text style={[styles.forgotPassword, defaultStyles.text]} >
                                    {I18n.t('login')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                    <Modal isVisible={this.store.isVisibleOtpModal}
                        avoidKeyboard={true}
                    >


                        <Toast ref={(ref: Toast) => this.store.successToast = ref}
                            position='top'
                            positionValue={defaultToastPosition}
                            style={defaultStyles.successToast}
                            textStyle={{
                                color: Colors.white,
                            }} />

                        <Toast ref={(ref: Toast) => this.store.errorToast = ref}
                            position='top'
                            positionValue={defaultToastPosition}
                            style={defaultStyles.errorToast}
                            textStyle={{
                                color: Colors.white,
                            }} />


                        <View style={defaultStyles.modalContent}>
                            <View style={defaultStyles.floatRight} >
                                <TouchableOpacity onPress={this.store.onPressCloseOtpModal}>
                                    <MaterialCommunityIcons name='close' color={Colors.black} size={modalCloseIconSize} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <View style={defaultStyles.margin}>
                                    <Text style={defaultStyles.text}>
                                        {I18n.t('enter_your_otp')}:
                                </Text>
                                </View>
                                <View style={styles.optContainer}>
                                    <TextInput style={styles.optTextInput}
                                        returnKeyType='done'
                                        keyboardType='numeric'
                                        autoFocus={true}
                                        value={this.store.otp}
                                        onChangeText={this.store.onChangeOtpInput}
                                    />
                                </View>

                                <View style={[styles.textInputArea, defaultStyles.marginVertical, defaultStyles.horizontalCenter]}>
                                    <TouchableOpacity onPress={this.store.onPressSendCodeAgain}  >
                                        <Text style={[styles.forgotPassword, defaultStyles.text]} >
                                            {I18n.t('send_code_again')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.textInputArea, defaultStyles.marginVertical, defaultStyles.horizontalCenter]}>
                                    {
                                        (this.store.sendCodeAgain) &&
                                        < Text style={[defaultStyles.text]} >
                                            {I18n.t('another_code_is_send_to')} {this.store.phoneWithCountryCode}
                                        </Text>
                                    }
                                </View>

                                <View style={styles.textInputArea}>
                                    <View style={(!this.store.otp || this.store.isProgressing) ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate} >
                                        <TouchableOpacity style={styles.registerButton}
                                            disabled={!this.store.otp || this.store.isProgressing}
                                            onPress={this.store.onPressContinueButton}>
                                            <Text style={[defaultStyles.text, styles.loginText]} >
                                                {I18n.t('continue')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>

                            </View>
                        </View>


                    </Modal>



                </KeyboardAwareScrollView >
            </View>

        )
    }
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    headerImage: {
        height: 130,
    },
    radianArea: {
        minHeight: deviceHeight - 130,
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
    },
    logo: {
        margin: 20,
    },
    logoText: {
        ...defaultStyles.text,
        color: Colors.white,
        fontSize: 30,
    },
    screenName: {
        ...defaultStyles.text,
        color: Colors.white,
        fontSize: 26,
        textAlign: 'center',
        paddingVertical: defaultMargin,
    },
    textInputArea: {
        marginHorizontal: defaultMargin * 2,
        marginVertical: defaultMargin,
    },
    textInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: Colors.white,
        borderWidth: defaultBorderWidth,
        borderRadius: defaultBorderRadius,
        margin: defaultMargin,
    },
    textInputIcon: {
        backgroundColor: Colors.white,
        padding: defaultMargin,
    },
    textInputInput: {
        ...defaultStyles.text,
        flex: 1,
        paddingLeft: 10,
        backgroundColor: Colors.white,
        color: Colors.black,
    },
    phoneInput: {
        fontSize: 16,
        paddingTop: 5,
        paddingLeft: 10,
        borderLeftColor: Colors.lightGray,
        borderLeftWidth: 2,
    },
    forgotPasswordContainer: {
        marginHorizontal: registerScreenMargin,
        alignItems: 'flex-end',
    },
    forgotPassword: {
        color: Colors.highlight,
        margin: defaultMargin,
        textDecorationLine: 'underline',
    },
    registerButton: {
        backgroundColor: Colors.highlight,
        alignItems: 'center',
        borderRadius: defaultBorderRadius,
        marginVertical: defaultMargin * 2,
    },
    loginText: {
        marginVertical: registerScreenMargin,
        color: Colors.white,
    },
    registerContainer: {
        marginHorizontal: registerScreenMargin,
        alignItems: 'center',
    },
    footerImage: {
        width: '100%',
        opacity: 0.1,
        position: 'relative',
        bottom: 0,
        zIndex: -1,
    },
    optContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    optTextInput: {
        borderWidth: 1,
        borderColor: Colors.gray,
        height: 42,
        width: 130,
        fontSize: 18,
        letterSpacing: 6,
        padding: defaultMargin,
    }
});