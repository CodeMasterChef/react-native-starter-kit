import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import { Colors } from '../../commons/colors';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { defaultMargin, defaultBorderWidth, defaultBorderRadius, deviceHeight } from '../../commons/constant';
import CountryPicker from 'react-native-country-picker-modal';
import { LoginScreenStore } from './loginScreenStore';
import { observer } from 'mobx-react';
import { localAppStorageHelper } from '../../helpers/localAppStorageHelper';
import { appRoutes } from '../../navigators/appRoutes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { appStore } from '../../appStore';
import { stores } from '../../stores';
import { NavigationScreenProp } from 'react-navigation';
import Loading from '../../components/loading/loading';
import Toast from '../../components/toast';

const loginScreenMargin = defaultMargin * 2;

interface Props {
    navigation: NavigationScreenProp<any>
}

@observer
export default class LoginScreen extends Component<Props> {

    public static navigationOptions = {
        header: null,
    };

    store = new LoginScreenStore();

    constructor(props: Props) {
        super(props);
        stores.navigation = props.navigation;
    };

    async componentDidMount() {
        this.store.setNavigation(this.props.navigation);
        const accessToken = await localAppStorageHelper.getAccessToken();
        if (accessToken && this.store.navigation) {
            this.store.navigation.navigate(appRoutes.mainTabNavigator);
        }
    }

    render() {
        const invalid = !this.store.countryCalling || !this.store.phone || !this.store.password;
        return (
            <SafeAreaView style={styles.screen}>
                <KeyboardAwareScrollView style={defaultStyles.container}>


                    {/* <ImageBackground
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
                    </ImageBackground> */}

                    <LinearGradient
                        colors={['#74945C', '#74945C', '#74945C']} style={styles.radianArea}>

                        {/* <View  >
                            <Image
                                style={styles.logo}
                                resizeMode="contain"
                                source={require('../../assets/images/1024.png')}
                            />
                            <Text style={styles.logoText}>LOYAL ONE</Text>
                        </View> */}

                        <Text style={styles.screenName}>{I18n.t('login')}</Text>
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
                        <View style={styles.textInputArea}>
                            <Text style={defaultStyles.textWhite}>{I18n.t('password')}:</Text>
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
                                />
                                <View style={styles.textInputIcon}>
                                    <TouchableOpacity onPress={this.store.onPressEyeIcon}>
                                        <MaterialCommunityIcons name={(this.store.showingPassword) ? 'eye-outline' : 'eye-off-outline'} size={32}
                                            color={Colors.gray} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                
                        <View style={styles.textInputArea}>
                            <View style={(invalid || this.store.isProcessing) ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate} >
                                <TouchableOpacity style={styles.loginButton}
                                    disabled={invalid || this.store.isProcessing}
                                    onPress={this.store.onPressLoginButton}>
                                    {
                                        this.store.isProcessing ?
                                            <Loading size={43} colors={[Colors.white]} /> :
                                            <Text style={[defaultStyles.text, styles.loginText]} >
                                                {I18n.t('login')}
                                            </Text>
                                    }

                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.textInputArea, defaultStyles.marginVertical, defaultStyles.horizontalCenter]}>
                            <TouchableOpacity
                                onPress={this.store.onPressRegisterButton}
                            >
                                <Text style={[styles.forgotPassword, defaultStyles.text, {color: Colors.white}]} >
                                    {I18n.t('register')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={this.store.onPressVersionLabel}
                            >
                                <Text style={styles.version} >
                                    {appStore.envName} v.{appStore.version}
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.provider} >
                                {I18n.t('development_by_kids_team')}
                            </Text>
                        </View>
                    </LinearGradient>
                </KeyboardAwareScrollView>
                <Toast ref={(ref: Toast) => {
                    if (ref && this.store.errorToast === undefined) {
                        this.store.errorToast = ref;
                    }
                }}
                    position='top'
                    positionValue={deviceHeight / 4}
                    showErrorIcon={true}
                    style={defaultStyles.errorCenterToast}
                    textStyle={defaultStyles.textToast}
                />
            </SafeAreaView>
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
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        margin: 20,
        width: 20,
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
    phoneInput: {
        fontSize: 16,
        paddingTop: 5,
        paddingLeft: 10,
        borderLeftColor: Colors.lightGray,
        borderLeftWidth: 2,
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
        flex: 1,
        paddingLeft: 10,
        backgroundColor: Colors.white,
        ...defaultStyles.text,
        color: Colors.black,
    },
    forgotPasswordContainer: {
        marginHorizontal: loginScreenMargin,
        alignItems: 'flex-end',
    },
    forgotPassword: {
        color: Colors.highlight,
        margin: defaultMargin,
        textDecorationLine: 'underline',
    },
    loginButton: {
        backgroundColor: Colors.highlight,
        alignItems: 'center',
        borderRadius: defaultBorderRadius,
    },
    loginText: {
        marginVertical: loginScreenMargin,
        color: Colors.white,
    },
    registerContainer: {
        marginHorizontal: loginScreenMargin,
        alignItems: 'center',
    },
    radianArea: {
        minHeight: deviceHeight - 130,
    },
    version: {
        ...defaultStyles.text,
        color: Colors.lightGray,
        fontSize: 8,
        marginTop: 50,
    },
    provider: {
        ...defaultStyles.text,
        fontSize: 9,
        color: Colors.lightGray,
        ...defaultStyles.marginVertical,
    }

});