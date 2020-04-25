import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import { DefaultNavigationOptions, HeaderNavigation } from '../../commons/defaultHeaderStyle';
import { observer, Observer } from 'mobx-react';
import I18n from 'react-native-i18n';
import NumberFormat from 'react-number-format';
import { Colors } from '../../commons/colors';
import { defaultMargin, defaultBorderWidth, defaultBorderRadius, defaultSizeNumberInTextInput as defaultNumberFontSizeInTextInput, modalCloseIconSize, defaultLoyalPointCurrency, zeroUID, processCircleSnailSize, processCircleSnailColors, processCircleSnailSpinDuration } from '../../commons/constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationScreenProp } from 'react-navigation';
import { ExchangeScreenStore, SelectTypeEnum } from './exchangeScreenStore';
import ScalableImage from 'react-native-scalable-image';
import { TextInput } from 'react-native';
import * as Progress from 'react-native-progress';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { stores } from '../../stores';
import { appStore } from '../../appStore';
const avatarWidth = 50;
const circleLoadingSize = 20;

interface Props {
    navigation: NavigationScreenProp<any>,
}

@observer
export default class ExchangePointScreen extends Component<Props> {
    //@ts-ignore
    static navigationOptions = () => ({
        title: I18n.t('exchange_points'),
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
    });

    store = new ExchangeScreenStore();

    constructor(props: Props) {
        super(props);
        stores.exchangeScreenStore = this.store;
        stores.navigation = props.navigation;
    };

    componentDidMount() {
        this.store.setNavigation(this.props.navigation);
    }

    render() {
        return (
            <KeyboardAwareScrollView
                style={styles.screen}
                refreshControl={
                    <RefreshControl
                        refreshing={this.store.isRefreshing}
                        onRefresh={this.store.onRefresh} />
                }
            >
                <View>
                    <View
                        style={styles.background}
                    >
                        <View style={defaultStyles.margin}>
                            <View style={defaultStyles.row}>
                                <View style={[defaultStyles.column1, defaultStyles.margin]}>
                                    <Text style={defaultStyles.textWhite}>{I18n.t('from_trademark')}:</Text>
                                </View>
                                <View style={styles.iconContainer}>
                                </View>
                                <View style={[defaultStyles.column1, defaultStyles.margin]}>
                                    <Text style={defaultStyles.textWhite}>{I18n.t('to_trademark')}:</Text>
                                </View>
                            </View>
                            <View style={defaultStyles.row}>
                                <TouchableOpacity
                                    style={[defaultStyles.column1, defaultStyles.margin]}
                                    onPress={() => this.store.onPressTrademarkCard(SelectTypeEnum.from)}
                                >
                                    <View style={styles.trademarkContainer}>

                                        {
                                            !!(this.store.selectedFromBrand && this.store.selectedFromBrand.id) &&
                                            <View style={[defaultStyles.marginVertical, styles.avatarContainer]}>
                                                {
                                                    !!(this.store.selectedFromBrand.id === zeroUID) &&
                                                    <ScalableImage
                                                        width={avatarWidth}
                                                        style={styles.avatar}
                                                        source={require('../../assets/images/loyal_one.png')} />
                                                }
                                                {
                                                    !!(this.store.selectedFromBrand.id !== zeroUID && this.store.selectedFromBrand.urlAvatar) &&
                                                    <ScalableImage
                                                        width={avatarWidth}
                                                        style={styles.avatar}
                                                        source={{ uri: this.store.selectedFromBrand.urlAvatar }} />
                                                }
                                            </View>

                                        }
                                        {
                                            (!this.store.refreshingFromBrand) ?
                                                <Text style={[defaultStyles.text]}>{this.store.selectedFromBrand.name ? this.store.selectedFromBrand.name : I18n.t('touch_to_choose')}</Text>
                                                :
                                                <Progress.CircleSnail
                                                    size={processCircleSnailSize}
                                                    color={processCircleSnailColors}
                                                    spinDuration={processCircleSnailSpinDuration}
                                                />
                                        }



                                    </View>
                                </TouchableOpacity>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name='arrow-right' size={28}
                                        color={Colors.white} />
                                </View>


                                <TouchableOpacity
                                    style={[defaultStyles.column1, defaultStyles.margin]}
                                    onPress={() => this.store.onPressTrademarkCard(SelectTypeEnum.to)}
                                >
                                    <View style={styles.trademarkContainer}>
                                        {
                                            !!(this.store.selectedToBrand && this.store.selectedToBrand.id) &&
                                            <View style={[defaultStyles.marginVertical, styles.avatarContainer]}>
                                                {
                                                    !!(this.store.selectedToBrand.id === zeroUID) &&
                                                    <ScalableImage
                                                        width={avatarWidth}
                                                        style={styles.avatar}
                                                        source={require('../../assets/images/loyal_one.png')} />
                                                }
                                                {
                                                    !!(this.store.selectedToBrand.id !== zeroUID && this.store.selectedToBrand.urlAvatar) &&

                                                    <ScalableImage
                                                        width={avatarWidth}
                                                        style={styles.avatar}
                                                        source={{ uri: this.store.selectedToBrand.urlAvatar }} />
                                                }
                                            </View>

                                        }
                                        {
                                            (!this.store.refreshingToBrand) ?
                                                <Text style={[defaultStyles.text]}>{this.store.selectedToBrand.name ? this.store.selectedToBrand.name : I18n.t('touch_to_choose')}</Text>
                                                :
                                                <Progress.CircleSnail
                                                    size={processCircleSnailSize}
                                                    color={processCircleSnailColors}
                                                    spinDuration={processCircleSnailSpinDuration}
                                                />
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>


                        </View>
                        <View style={styles.rateArea}>
                            <View style={[defaultStyles.row, defaultStyles.margin]}>
                                <View style={[defaultStyles.column1, defaultStyles.margin]}>
                                    <View style={defaultStyles.row}>
                                        <Text style={defaultStyles.textWhite}>{I18n.t('rate')}:</Text>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <Text style={[defaultStyles.textWhite, defaultStyles.textBold]}>
                                                {this.store.conversionRateData?.fromRate ? this.store.conversionRateData?.fromRate : '_'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.iconContainer, styles.rate]}>
                                    <Text style={[defaultStyles.textWhite, defaultStyles.textBold]}>:</Text>
                                </View>
                                <View style={[defaultStyles.column1, defaultStyles.margin]}>
                                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                        <Text style={[defaultStyles.textWhite, defaultStyles.textBold]}>
                                            {this.store.conversionRateData?.toRate ? this.store.conversionRateData?.toRate : '_'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.body}>
                        <View style={[defaultStyles.row, defaultStyles.margin]}>
                            <View style={[defaultStyles.column1]}>
                                <Text style={defaultStyles.textBold}>{I18n.t('exchange_amount')}:</Text>
                                <Text style={[defaultStyles.textSmall, styles.balanceText]}>{I18n.t('balance')}:
                            <NumberFormat
                                        value={this.store.fromBalance}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        renderText={(value) =>
                                            <Text> {value}</Text>
                                        } />
                                </Text>
                            </View>

                            <View style={styles.iconContainer}>
                            </View>

                            <View style={[defaultStyles.column1]}>
                                <Text style={defaultStyles.textBold}>{I18n.t('received_amount')}:</Text>
                                <Text style={[defaultStyles.textSmall, styles.balanceText]}>{I18n.t('balance')}:
                            <NumberFormat
                                        value={this.store.toBalance}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        renderText={(value) =>
                                            <Text> {value}</Text>
                                        } />
                                </Text>
                            </View>
                        </View>


                        <View style={[defaultStyles.row, defaultStyles.marginHorizontal]}>
                            <View style={[defaultStyles.column1]}>
                                <NumberFormat
                                    value={this.store.fromAmountText}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    renderText={(value) =>
                                        <Observer>
                                            {
                                                () =>

                                                    <View style={[styles.amountInputContainer, (this.store.invalidFromBrand || this.store.invalidToBrand) ? styles.amountInputDisabled : styles.amountInputContainer]}>
                                                        <TextInput
                                                            //@ts-ignore    
                                                            textAlign='right'
                                                            style={[styles.amountInput]}
                                                            keyboardType='numeric'
                                                            editable={!this.store.invalidFromBrand && !this.store.invalidToBrand}
                                                            returnKeyType='done'
                                                            clearButtonMode='always'
                                                            value={value}
                                                            onFocus={() => this.store.onFocusAmount(SelectTypeEnum.from)}
                                                            onBlur={() => this.store.onBlurAmount(SelectTypeEnum.from)}
                                                            onChangeText={(text) => this.store.onChangeAmount(text, SelectTypeEnum.from)}
                                                        />
                                                        {
                                                            this.store.isLoadingFromAmount &&
                                                            <Progress.Circle
                                                                indeterminate={true}
                                                                color={Colors.primary}
                                                                size={circleLoadingSize}
                                                                style={styles.loading}
                                                            />
                                                        }

                                                    </View>


                                            }
                                        </Observer>

                                    } />
                                <View>


                                </View>

                                {
                                    (this.store.invalidFromAmount) &&
                                    <Text style={[defaultStyles.textRed, defaultStyles.textSmall]}>{I18n.t('the_quantity_is_invalid')}</Text>
                                }



                            </View>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name='arrow-right' size={28}
                                    color={Colors.primary} />
                            </View>

                            <View style={[defaultStyles.column1]}>
                                <NumberFormat
                                    value={this.store.toAmountText}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    renderText={(value) =>
                                        <Observer>
                                            {
                                                () => <View style={[styles.amountInputContainer, (this.store.invalidFromBrand || this.store.invalidToBrand) ? styles.amountInputDisabled : styles.amountInputContainer]}>
                                                    <TextInput
                                                        //@ts-ignore    
                                                        textAlign='right'
                                                        style={styles.amountInput}
                                                        keyboardType='numeric'
                                                        returnKeyType='done'
                                                        clearButtonMode='always'
                                                        editable={!this.store.invalidFromBrand && !this.store.invalidToBrand}
                                                        value={value}
                                                        onFocus={() => this.store.onFocusAmount(SelectTypeEnum.to)}
                                                        onBlur={() => this.store.onBlurAmount(SelectTypeEnum.to)}
                                                        onChangeText={(text) => this.store.onChangeAmount(text, SelectTypeEnum.to)}
                                                    />
                                                    {
                                                        this.store.isLoadingToAmount &&
                                                        <Progress.Circle
                                                            indeterminate={true}
                                                            color={Colors.primary}
                                                            size={circleLoadingSize}
                                                            style={styles.loading}
                                                        />
                                                    }
                                                </View>

                                            }
                                        </Observer>



                                    } />

                                {
                                    !!(this.store.conversionRateData.lopPoint) &&
                                    <NumberFormat
                                        value={this.store.conversionRateData.lopPoint}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        renderText={(value) =>
                                            <Text style={defaultStyles.textSmall}>+{value} {defaultLoyalPointCurrency}</Text>
                                        } />
                                }




                                {
                                    (this.store.invalidToAmount) &&
                                    <Text style={[defaultStyles.textRed, defaultStyles.textSmall]}>{I18n.t('the_quantity_is_invalid')}</Text>
                                }
                            </View>


                        </View>


                        <View style={[defaultStyles.row, defaultStyles.margin]}>
                            <View style={defaultStyles.column1}>
                                {
                                    !!(this.store.selectedFromBrand.minValue) &&
                                    <Text style={[defaultStyles.textSmall, styles.balanceText]}>{I18n.t('minimum')}:
                                    <NumberFormat
                                            value={this.store.selectedFromBrand.minValue}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            renderText={(value) =>
                                                <Text> {value}</Text>
                                            } />
                                    </Text>

                                }
                                {
                                    !!(this.store.selectedFromBrand.maxValue) &&
                                    <Text style={[defaultStyles.textSmall, styles.balanceText]}>{I18n.t('maximum')}:
                                     <NumberFormat
                                            value={this.store.selectedFromBrand.maxValue}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            renderText={(value) =>
                                                <Text> {value} </Text>
                                            } />
                                    </Text>
                                }

                            </View>

                            <View style={styles.iconContainer}>
                            </View>

                            <View style={defaultStyles.column1}>
                                {
                                    !!(this.store.selectedToBrand.minValue) &&
                                    <Text style={[defaultStyles.textSmall, styles.balanceText]}>{I18n.t('minimum')}:
                                    <NumberFormat
                                            value={this.store.selectedToBrand.minValue}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            renderText={(value) =>
                                                <Text> {value}</Text>
                                            } />
                                    </Text>
                                }
                                {
                                    !!(this.store.selectedToBrand.maxValue) &&
                                    <Text style={[defaultStyles.textSmall, styles.balanceText]}>{I18n.t('maximum')}:
                                    <NumberFormat
                                            value={this.store.selectedToBrand.maxValue}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            renderText={(value) =>
                                                <Text> {value}</Text>
                                            } />
                                    </Text>
                                }
                            </View>
                        </View>
                        {
                            !!(this.store.errorMessage) &&
                            <View style={[defaultStyles.row, defaultStyles.margin]}>
                                <Text style={[defaultStyles.textRed]}>{this.store.errorMessage}.</Text>
                            </View>
                        }
                        <View style={[defaultStyles.row, defaultStyles.margin]}>
                            <TouchableOpacity
                                style={[styles.submitButton, (this.store.invalidForm || this.store.isLoadingSubmit) ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate]}
                                disabled={this.store.invalidForm || this.store.isLoadingSubmit}
                                onPress={this.store.onPressConfirmButton}>
                                {
                                    (this.store.isLoadingSubmit) ?
                                        <Progress.CircleSnail
                                            size={processCircleSnailSize}
                                            color={Colors.white}
                                            spinDuration={processCircleSnailSpinDuration}
                                        />
                                        :
                                        <Text style={[defaultStyles.textWhite, defaultStyles.margin]}>{I18n.t('convert')}</Text>
                                }

                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
            </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    background: {
        width: '100%',
        backgroundColor: Colors.third,
    },
    iconContainer: {
        justifyContent: 'center',
        width: 28,
    },
    trademarkContainer: {
        backgroundColor: Colors.white,
        borderRadius: defaultBorderRadius,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
    },
    rateArea: {
        backgroundColor: Colors.third,
        paddingBottom: 10,
    },
    rate: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    body: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: defaultBorderRadius * 1.5,
        borderTopRightRadius: defaultBorderRadius * 1.5,
        top: -12,
        flex: 1,
    },
    amountInputContainer: {
        borderRadius: defaultBorderRadius,
        borderColor: Colors.primary,
        borderWidth: defaultBorderWidth,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    amountInput: {
        padding: defaultMargin,
        fontSize: defaultNumberFontSizeInTextInput,
        marginHorizontal: defaultMargin,
        flex: 1,
    },
    amountInputDisabled: {
        backgroundColor: Colors.lightGray,
        opacity: 0.5,
        borderColor: Colors.gray,
    },
    loading: {
        marginRight: 4,
    },
    balanceText: {
        height: 16,
    },
    submitButton: {
        backgroundColor: Colors.highlight,
        flex: 1,
        alignItems: 'center',
        borderRadius: defaultBorderRadius,
        marginTop: defaultMargin * 2,
    },
    itemContent: {
        flexDirection: 'row',
        marginVertical: defaultMargin,
        alignItems: 'center',
    },
    avatarContainer: {
        backgroundColor: Colors.lightGray,
        borderRadius: defaultBorderRadius,
        width: avatarWidth,
        height: avatarWidth,
    },
    avatar: {
        borderRadius: defaultBorderRadius,
    },
});


