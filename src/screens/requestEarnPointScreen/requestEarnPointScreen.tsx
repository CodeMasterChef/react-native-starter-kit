import { NavigationScreenProp } from 'react-navigation';
import React, { Component } from 'react';
import { RequestEarnPointScreenStore } from './requestEarnPointScreenStore';
import { observer } from 'mobx-react';
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import I18n from 'react-native-i18n';
import { DefaultNavigationOptions } from '../../commons/defaultHeaderStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { defaultMargin, deviceWidth, defaultBorderRadius, defaultPageBorderRadius, processCircleSnailSize, processCircleSnailSpinDuration, headerMinHeight, defaultVietnameseCurrency, deviceHeight, modalCloseIconSize, processCircleSnailColors, loadingPageCircleSize } from '../../commons/constant';
import { Colors } from '../../commons/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../../components/datePicker/datePicker';
import * as Progress from 'react-native-progress';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import NumberFormat from 'react-number-format';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { stores } from '../../stores';
import LinkOrRegisterMemberModal from '../../components/linkOrRegisterMemberModal/linkOrRegisterMemberModal';

export const requestEarnPointScreenParams = {
    store: 'store',
}

interface Props {
    navigation: NavigationScreenProp<any>,

}

const backButtonSize = 30;
const backButtonPaddingLeft = 10;
const avatarWidth = 55;
const headerHeight = 250;
@observer
export default class RequestEarnPointScreen extends Component<Props> {

    //@ts-ignore
    static navigationOptions = () => ({
        header: null,
        ...DefaultNavigationOptions,
    });

    store: RequestEarnPointScreenStore;

    constructor(props: Props) {
        super(props);
        this.store = props.navigation.getParam(requestEarnPointScreenParams.store);
        stores.requestEarnPointScreenStore = this.store;
    };

    render() {
        const memberTypeColor = this.store?.brandMember?.memberType?.color || Colors.primary;
        return (

            <View style={defaultStyles.screen}>
                <HeaderImageScrollView
                    maxHeight={headerHeight}
                    minHeight={headerMinHeight}
                    fadeOutForeground={true}
                    overlayColor={Colors.primary}
                    maxOverlayOpacity={1}
                    foregroundParallaxRatio={1}
                    headerImage={this.store.brand.banner ? { uri: this.store.brand.banner } : require('../../assets/images/header.png')}
                    renderTouchableFixedForeground={() => <SafeAreaView style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => this.store.onPressBackButton(this.props.navigation)}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name='arrow-left' size={backButtonSize} color={Colors.black} />
                            </View>

                        </TouchableOpacity>
                        <View style={styles.title}>
                            <Text style={defaultStyles.textWhite}>{I18n.t('earn_points')}</Text>
                        </View>
                    </SafeAreaView>}
                    renderForeground={() => (
                        <View>
                            <View style={styles.brandInfoArea}>
                                <View style={styles.avatarArea}>
                                    {
                                        (this.store.brand.urlAvatar) &&
                                        <Image style={styles.avatarImage} source={{ uri: this.store.brand.urlAvatar }} />
                                    }
                                </View>

                                <View style={styles.infoArea}>
                                    <View style={styles.infoContainer}>

                                        <View style={styles.infoInner}>
                                            <Text style={styles.brandName}>{this.store.brand?.name}</Text>
                                            {
                                                this.store.brandMember?.memberBrandCode &&
                                                <Text style={defaultStyles.text}>{I18n.t('member_id_short')}: {this.store.brandMember?.memberBrandCode}</Text>
                                            }
                                            <Text style={defaultStyles.text}>{this.store.brandMember?.name}</Text>
                                            <View style={styles.pointAndMemberTypeArea}>
                                                {
                                                    !!(this.store.brandMember) &&
                                                    <NumberFormat value={this.store.brandMember?.point}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        renderText={(value) =>
                                                            <Text style={defaultStyles.textBold}>{value} {this.store.brand?.brandPointCode || I18n.t('points')}</Text>
                                                        } />
                                                }
                                                {
                                                    !!(this.store.brandMember?.memberType) &&
                                                    <View style={[defaultStyles.column1, defaultStyles.floatRight]}>
                                                        <View style={[styles.memberTypeContainer, { backgroundColor: memberTypeColor }]}>
                                                            <Text style={styles.memberTypeText}>{this.store?.brandMember?.memberType?.name}</Text>
                                                        </View>
                                                    </View>
                                                }
                                            </View>

                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                >
                    <View style={styles.body}>
                        <TriggeringView>
                            <KeyboardAwareScrollView>
                                {
                                    (this.store.isFirstLoading) &&
                                    <View style={defaultStyles.horizontalCenter} >
                                        <Progress.CircleSnail
                                            style={{ width: loadingPageCircleSize }}
                                            size={loadingPageCircleSize}
                                            color={processCircleSnailColors}
                                            spinDuration={processCircleSnailSpinDuration}
                                        />
                                    </View>
                                }
                                {
                                    (!this.store.isFirstLoading && !this.store.noSupport && this.store.notMember) &&
                                    <View>
                                        <View style={styles.noSupportArea}>
                                            <LottieView style={styles.sadAnimation} source={require('../../assets/animations/sad.json')} autoPlay />
                                            <Text style={defaultStyles.text}>{I18n.t('you_are_not_a_member')}</Text>
                                            <TouchableOpacity onPress={this.store.onPressRegisterMemberButton}>
                                                <Text style={defaultStyles.textLink}>{I18n.t('register_now')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <LinkOrRegisterMemberModal store={this.store.linkOrRegisterMemberModalStore} />
                                    </View>

                                }
                                {
                                    (!this.store.isFirstLoading && this.store.noSupport) &&
                                    <View style={styles.noSupportArea}>
                                        <LottieView style={styles.sadAnimation} source={require('../../assets/animations/sad.json')} autoPlay />
                                        <Text style={defaultStyles.text}>{I18n.t('no_support_earn_point')}</Text>
                                    </View>
                                }

                                {
                                    (!this.store.isFirstLoading && !this.store.noSupport && !this.store.notMember) &&
                                    <View>
                                        {
                                            (!this.store.isFirstLoading && !this.store.notMember) &&
                                            <View style={styles.formContainer}>
                                                <View style={styles.inputContainer}>
                                                    <Text style={defaultStyles.text}>{I18n.t('transaction_date')}<Text style={defaultStyles.textRed}>*</Text>:</Text>
                                                    <View style={[styles.textInputContainer]}>
                                                        <DatePicker store={this.store.datePickerStore} />
                                                    </View>
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <Text style={defaultStyles.text}>{I18n.t('bill_number')}<Text style={defaultStyles.textRed}>*</Text>:</Text>
                                                    <View style={styles.textInputContainer}>
                                                        <MaterialCommunityIcons name='barcode' size={backButtonSize} color={Colors.gray} />
                                                        <TextInput
                                                            value={this.store.billNumber}
                                                            style={styles.textInput}
                                                            onChangeText={this.store.onChangeBillNumberInput}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <Text style={defaultStyles.text}>{I18n.t('bill_value')}<Text style={defaultStyles.textRed}>*</Text>:</Text>
                                                    <View style={styles.textInputContainer}>
                                                        <MaterialIcons name='attach-money' size={backButtonSize} color={Colors.gray} />

                                                        <NumberFormat value={this.store.billValue}
                                                            displayType={'text'}
                                                            thousandSeparator={true}
                                                            renderText={(value) =>
                                                                <TextInput
                                                                    keyboardType='numeric'
                                                                    returnKeyType='done'
                                                                    value={value}
                                                                    style={styles.textInput}
                                                                    onChangeText={this.store.onChangeBillValueInput}
                                                                />
                                                            } />

                                                    </View>
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <Text style={defaultStyles.text}>{I18n.t('earned_points')}:</Text>
                                                    <Text style={defaultStyles.textSmall}>(
                                            <NumberFormat value={this.store.brandMemberSetting?.money}
                                                            displayType={'text'}
                                                            suffix={` ${defaultVietnameseCurrency} = `}
                                                            thousandSeparator={true}
                                                            renderText={(value) =>
                                                                <Text style={defaultStyles.textSmall}>{value}</Text>
                                                            } />
                                                        <NumberFormat value={this.store.brandMemberSetting?.point}
                                                            displayType={'text'}
                                                            suffix={` ${I18n.t('points')}`}
                                                            thousandSeparator={true}
                                                            renderText={(value) =>
                                                                <Text style={defaultStyles.textSmall}>{value}</Text>
                                                            } />
                                                )</Text>

                                                    <View style={[styles.textInputContainer, styles.textInputContainerGray]}>
                                                        <MaterialCommunityIcons name='coin' size={backButtonSize} color={Colors.gray} />

                                                        <NumberFormat value={this.store.earnedPoints}
                                                            displayType={'text'}
                                                            thousandSeparator={true}
                                                            renderText={(value) =>
                                                                <TextInput
                                                                    keyboardType='numeric'
                                                                    returnKeyType='done'
                                                                    editable={false}
                                                                    value={value}
                                                                    style={styles.textInput}
                                                                />
                                                            } />

                                                    </View>
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <TouchableOpacity
                                                        style={[styles.submitButton, (this.store.isInvalidForm || this.store.isLoadingSubmit) ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate]}
                                                        disabled={this.store.isInvalidForm || this.store.isLoadingSubmit}
                                                        onPress={this.store.onPressSubmitButton}>
                                                        {
                                                            (this.store.isLoadingSubmit) ?
                                                                <Progress.CircleSnail
                                                                    size={processCircleSnailSize}
                                                                    color={Colors.white}
                                                                    spinDuration={processCircleSnailSpinDuration}
                                                                />
                                                                :
                                                                <Text style={[defaultStyles.textWhite, defaultStyles.margin]}>{I18n.t('send_earn_point_request')}</Text>
                                                        }

                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        }
                                    </View>


                                }


                            </KeyboardAwareScrollView>
                        </TriggeringView>
                    </View>
                </HeaderImageScrollView>
                <Modal isVisible={this.store.isVisibleSuccessModal}>
                    <View style={defaultStyles.modalContent}>
                        <View style={defaultStyles.modalHeader}>
                            <TouchableOpacity onPress={this.store.onPressCloseModal}>
                                <MaterialCommunityIcons name='close' color={Colors.black} size={modalCloseIconSize} />
                            </TouchableOpacity>
                        </View>
                        <View style={defaultStyles.modalBody}>
                            <View style={defaultStyles.centerCenter}>
                                <LottieView style={styles.successAnimation} source={require('../../assets/animations/congratulation.json')} autoPlay />
                                <Text style={styles.messageTitle}>{I18n.t('send_earn_point_request_successfully')}</Text>
                                <Text style={styles.successSubtitle}>{I18n.t('you_will_receive_points_when_store_confirm')}</Text>
                            </View>

                        </View>
                    </View>
                </Modal>
            </View>

        )

    }
}


const styles = StyleSheet.create({
    background: {
        width: deviceWidth,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        paddingLeft: backButtonPaddingLeft,
        paddingTop: 5,
    },
    iconContainer: {
        backgroundColor: Colors.lightGray,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        left: - (backButtonSize + backButtonPaddingLeft) / 2,
    },
    brandInfoArea: {
        flexDirection: 'row',
        marginTop: 90,
        alignItems: 'center',
    },
    pointAndMemberTypeArea: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberTypeContainer: {
        borderRadius: 20,
    },
    memberTypeText: {
        ...defaultStyles.textWhite,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    avatarArea: {
        right: -avatarWidth / 2,
        zIndex: 1,
        ...defaultStyles.defaultShadow,
    },
    avatarImage: {
        backgroundColor: Colors.white,
        width: avatarWidth,
        height: avatarWidth,
        borderRadius: defaultBorderRadius,
        borderColor: Colors.white,
        borderWidth: 1,
    },
    infoArea: {
        flex: 1,
        marginRight: 30,
        ...defaultStyles.defaultShadow,
    },
    infoContainer: {
        backgroundColor: Colors.white,
        paddingVertical: 20,
        borderRadius: defaultBorderRadius,


    },
    infoInner: {
        margin: defaultMargin,
        marginLeft: avatarWidth / 2 + 10,
    },
    brandName: {
        ...defaultStyles.textBold,
        color: Colors.primary,
        fontSize: 18,
    },
    body: {
        backgroundColor: Colors.lightGray,
        borderTopLeftRadius: defaultPageBorderRadius,
        borderTopRightRadius: defaultPageBorderRadius,
        top: -10,
        minHeight: deviceHeight - headerHeight - 75,
    },
    noSupportArea: {
        alignItems: 'center',
    },
    formContainer: {
        margin: defaultMargin * 3,
    },
    textInputContainer: {
        borderColor: Colors.highlight,
        borderWidth: 1,
        ...defaultStyles.text,
        flex: 1,
        borderRadius: defaultBorderRadius,
        paddingHorizontal: defaultMargin,
        backgroundColor: Colors.white,
        marginVertical: defaultMargin,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInputContainerGray: {
        borderColor: Colors.gray,
        opacity: 0.8,
    },
    textInput: {
        ...defaultStyles.text,
        flex: 1,
        marginLeft: 4,
    },
    inputContainer: {
        marginVertical: defaultMargin,
    },
    submitButton: {
        backgroundColor: Colors.highlight,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: defaultBorderRadius,
        height: 40,
    },
    messageTitle: {
        ...defaultStyles.textBold,
        ...defaultStyles.textMedium,
        textAlign: 'center',
    },
    successSubtitle: {
        ...defaultStyles.text,
        textAlign: 'center',
        marginVertical: defaultMargin,
    },
    sadAnimation: {
        width: deviceWidth / 2,
    },
    successAnimation: {
        width: deviceWidth / 2,
    }

})