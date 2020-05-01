import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { NavigationScreenProp } from 'react-navigation';
import I18n from 'react-native-i18n';
import { HeaderNavigation, DefaultNavigationOptions } from '../../commons/defaultHeaderStyle';
import { stores } from '../../stores';
import { UserProfileScreenStore } from './userProfileScreenStore';
import { defaultStyles } from '../../commons/defaultStyles';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, RefreshControl, TextInput, Platform } from 'react-native';
import { appStore } from '../../appStore';
import { defaultMargin, defaultBorderWidth } from '../../commons/constant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../commons/colors';
import PhoneInput from '../../components/phoneInput/phoneInput';
import { timeHelper } from '../../helpers/timeHelper';
import DatePicker from '../../components/datePicker/datePicker';
import GenderSelect from '../../components/genderSelect/genderSelect';
import ProvinceSelect from '../../components/provinceSelect/provinceSelect';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    navigation: NavigationScreenProp<any>,
}
@observer
export default class UserProfileScreen extends Component<Props> {

    //@ts-ignore
    static navigationOptions = () => ({
        title: Platform.OS === 'android' ? I18n.t('account_information') : `${I18n.t('information')}...`,
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
    });

    store: UserProfileScreenStore;


    constructor(props: Props) {
        super(props);
        this.store = new UserProfileScreenStore();
        stores.userProfileScreenStore = this.store;
        stores.navigation = props.navigation;
    }


    render() {
        return (
            <View style={defaultStyles.whiteScreen}>
                <ScrollView
                    style={defaultStyles.whiteScreen}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.store.isRefreshing}
                            onRefresh={this.store.onRefresh} />
                    }
                >
                    <View style={styles.avatarArea} >
                        <TouchableOpacity
                            style={styles.avatarContainer}
                            disabled={!this.store.editable}
                            onPress={this.store.onPressAvatar}
                        >
                            {
                                (this.store.pickerImageBase64) ?
                                    <Image style={styles.avatar} source={{ uri: this.store.pickerImageBase64 }} />
                                    :
                                    <Image style={styles.avatar} source={(this.store.account && this.store.account.urlAvatar) ? { uri: this.store.account.urlAvatar } : require('../../assets/images/user.png')} />
                            }
                            {
                                this.store.editable &&
                                <MaterialCommunityIcons style={styles.photoIcon} name='camera' size={32} color={Colors.white} />
                            }

                        </TouchableOpacity>
                    </View>
                    <View style={styles.list}>
                        <View style={[styles.listItem, this.store.editable ? styles.listItemEditable : styles.listItemNormal]}>
                            <View style={styles.listItemLeft}>
                                <Text style={styles.listItemLabel}>{I18n.t('name')}:</Text>
                            </View>
                            <View style={styles.listItemRight}>
                                {
                                    this.store.editable ?
                                        <TextInput
                                            style={styles.textInput}
                                            value={this.store.account.name}
                                            onChangeText={this.store.onChangeNameInput}
                                        />
                                        : <Text style={styles.listItemLabel}>{this.store.account.name}</Text>
                                }
                            </View>
                        </View>

                        <View style={[styles.listItem, this.store.editable ? styles.listItemEditable : styles.listItemNormal]}>
                            <View style={styles.listItemLeft}>
                                <Text style={styles.listItemLabel}>{I18n.t('phone')}:</Text>
                            </View>
                            <View style={styles.listItemRight}>
                                {/* {
                                    this.store.editable ?
                                        <View style={styles.textInput}>
                                            <PhoneInput
                                                countryCode={this.store.countryCode}
                                                phone={this.store.phone}
                                                textAlginRight={true}
                                                hideClearButton={true}
                                                onChangePhoneWithCountryCode={phoneWithCountryCode => this.store.onChangePhoneInput(phoneWithCountryCode)} />
                                        </View>
                                        : <Text style={styles.listItemLabel}>{this.store.account.phone}</Text>
                                } */}
                                <Text style={styles.listItemLabel}>{this.store.account.phone}</Text>
                            </View>
                        </View>

                        <View style={[styles.listItem, this.store.editable ? styles.listItemEditable : styles.listItemNormal]}>
                            <View style={styles.listItemLeft}>
                                <Text style={styles.listItemLabel}>{I18n.t('birthday')}:</Text>
                            </View>
                            <View style={styles.listItemRight}>
                                {
                                    this.store.editable ?
                                        <View style={[styles.textInput, styles.textInputDate]}>
                                            <DatePicker store={this.store.datePickerStore}
                                                textAlign='right'
                                                hideIcon={true}
                                            />
                                        </View>
                                        : <Text style={styles.listItemLabel}>{this.store.account.dateOfBirth ? timeHelper.convertTimestampToDayMonthYear(this.store.account.dateOfBirth) : ''}</Text>
                                }
                            </View>
                        </View>

                        <View style={[styles.listItem, this.store.editable ? styles.listItemEditable : styles.listItemNormal]}>
                            <View style={styles.listItemLeft}>
                                <Text style={styles.listItemLabel}>{I18n.t('gender')}:</Text>
                            </View>
                            <View style={styles.listItemRight}>
                                {
                                    this.store.editable ?
                                        <View style={[styles.textInput, styles.textInputDate]}>
                                            <GenderSelect
                                                store={this.store.genderSelectStore}
                                                textAlign='right'
                                                hideIcon={true}
                                                initialLabel={this.store.getGenderText}
                                            />
                                        </View>
                                        : <Text style={styles.listItemLabel}>{this.store.getGenderText}</Text>
                                }
                            </View>
                        </View>

                        <View style={[styles.listItem, this.store.editable ? styles.listItemEditable : styles.listItemNormal]}>
                            <View style={styles.listItemLeft}>
                                <Text style={styles.listItemLabel}>{I18n.t('email')}:</Text>
                            </View>
                            <View style={styles.listItemRight}>
                                {
                                    this.store.editable ?
                                        <TextInput
                                            style={styles.textInput}
                                            value={this.store.account.email}
                                            onChangeText={this.store.onChangeEmailInput}
                                        />
                                        : <Text style={styles.listItemLabel}>{this.store.account.email}</Text>
                                }
                            </View>
                        </View>

                        <View style={[styles.listItem, this.store.editable ? styles.listItemEditable : styles.listItemNormal]}>
                            <View style={styles.listItemLeft}>
                                <Text style={styles.listItemLabel}>{I18n.t('address')}:</Text>
                            </View>
                            <View style={styles.listItemRight}>
                                {
                                    this.store.editable ?
                                        <TextInput
                                            style={styles.textInput}
                                            value={this.store.account.address}
                                            onChangeText={this.store.onChangeAddressInput}
                                        />
                                        : <Text style={styles.listItemLabel}>{this.store.account.address}</Text>
                                }
                            </View>
                        </View>

                        <View style={[styles.listItem, this.store.editable ? styles.listItemEditable : styles.listItemNormal]}>
                            <View style={styles.listItemLeft}>
                                <Text style={styles.listItemLabel}>{I18n.t('province')}:</Text>
                            </View>
                            <View style={styles.listItemRight}>
                                {
                                    this.store.editable ?
                                        <View style={[styles.textInput, styles.textInputDate]}>
                                            <ProvinceSelect
                                                store={this.store.provinceSelectStore}
                                                textAlign='right'
                                                hideIcon={true}
                                                initialLabel={this.store.account?.province?.name}
                                            />
                                        </View>
                                        : <Text style={styles.listItemLabel}>{this.store.account?.province?.name}</Text>
                                }
                            </View>
                        </View>


                    </View>
                </ScrollView>
                <View style={styles.empty}></View>
                <View style={styles.floatButtonArea}>
                    <TouchableOpacity
                        style={styles.floatButton}
                        disabled={this.store.isUpdating}
                        onPress={this.store.onPressEditButton}>
                        <View style={[styles.floatButtonIconContainer, this.store.isUpdating ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate]}>
                            {
                                this.store.editable ?
                                    <MaterialIcons name='save' size={30} color={Colors.white} style={styles.floatButtonIcon} />
                                    :
                                    <MaterialIcons name='edit' size={30} color={Colors.white} style={styles.floatButtonIcon} />
                            }

                        </View>
                        <Text style={styles.floatButtonText}>{this.store.editable ? I18n.t('save') : I18n.t('edit')}</Text>

                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    avatarArea: {
        height: 80,
        backgroundColor: Colors.third,
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        backgroundColor: Colors.white,
        borderColor: Colors.white,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: defaultMargin,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    photoIcon: {
        position: 'absolute',
        right: -10,
        bottom: -10,
    },
    list: {

    },
    listItem: {
        borderBottomWidth: defaultBorderWidth,
        flexDirection: 'row',
        paddingVertical: defaultMargin,
        paddingHorizontal: defaultMargin,
        alignItems: 'center',
        height: 60,
    },
    listItemEditable: {
        borderColor: Colors.white,
    },
    listItemNormal: {
        borderColor: Colors.lightGray,
    },
    listItemLeft: {
        flex: 1,
    },
    listItemRight: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        flex: 2,
        textAlign: 'right',
    },
    textInput: {
        borderBottomColor: Colors.secondary,
        borderBottomWidth: 1,
        ...defaultStyles.text,
        flex: 1,
        textAlign: 'right',
    },
    textInputDate: {
        height: 50,
    },
    listItemLabel: {
        ...defaultStyles.text,
        color: Colors.gray,
    },
    floatButtonArea: {
        position: 'absolute',
        bottom: 0,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    empty: {
        marginTop: 60,
    },
    floatButton: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: defaultMargin,

    },
    floatButtonIconContainer: {
        borderColor: Colors.third,
        borderWidth: 1,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.third,
    },
    floatButtonIcon: {
        padding: defaultMargin,
    },
    floatButtonText: {
        ...defaultStyles.text,
        color: Colors.third,
        backgroundColor: Colors.white,
    },
})


