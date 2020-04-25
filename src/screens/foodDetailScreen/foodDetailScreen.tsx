import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Platform, ImageBackground, TextInput, KeyboardAvoidingView } from 'react-native';
import { observer } from 'mobx-react';
import { NavigationScreenProp, SafeAreaView } from 'react-navigation';
import { Colors } from '../../commons/colors';
import { ScrollView, } from 'react-native-gesture-handler';
import { deviceWidth, defaultBorderRadius, defaultMargin, deviceHeight, bottomBarHeight } from '../../commons/constant';
import Modal from 'react-native-modal';
import Toast from '../../components/toast/index.js';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { defaultStyles } from '../../commons/defaultStyles';
import I18n from 'react-native-i18n';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import NumberFormat from 'react-number-format';
import { stores } from '../../stores';
import * as mobx from 'mobx';
import FoodItem from '../../components/foodItem/foodItem';
import { FoodDetailStore } from './foodDetailScreenStore';
import { HeaderNavigation, DefaultNavigationOptions } from '../../commons/defaultHeaderStyle';
interface Props {
    navigation: NavigationScreenProp<any>;
    food: any;
}
@observer
export default class FoodDetailScreen extends Component<Props> {

    store!: FoodDetailStore;

    static navigationOptions = ({ }) => ({
        title: 'Details',
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
    });

    constructor(props: Props) {
        super(props);
        this.store = new FoodDetailStore();
        stores.navigation = props.navigation;
        this.store.food = this.props.navigation.getParam('food');


    };

    render() {
        return (
            <View style={styles.screen}>
                <ScrollView style={styles.scrollView} >
                    <View>
                        <ImageBackground
                            style={{ height: 250 }}
                            source={{ uri: this.store.food?.image }}
                        >
                        </ImageBackground>
                    </View>
                    <View style={[defaultStyles.row, {
                        justifyContent: 'space-between',
                        padding: defaultMargin,
                        backgroundColor: Colors.white,
                    }]}>
                        <View style={{ flex: 1 }}>
                        </View>
                        <View style={[defaultStyles.row, { alignItems: 'center' }]}>
                            <SimpleLineIcons style={{ marginRight: 5 }}
                                size={30} name="tag" />
                            {
                                this.store.food?.price == 0 ?
                                    <Text style={{}}>Free</Text>
                                    :
                                    <NumberFormat value={this.store.food?.price || 0}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        renderText={(value) =>
                                            <Text style={{ marginRight: 10 }}>{value}đ</Text>
                                        } />
                            }
                        </View>
                    </View>
                    <View style={{
                        marginTop: 15,
                        backgroundColor: Colors.white,
                        padding: defaultMargin + 5
                    }}>
                        <View style={styles.flexCenter}>
                            <Image resizeMode="contain"
                                style={styles.userAvatar}
                                source={{ uri: this.store.food?.user.avatar }}></Image>
                            <View>
                                <View style={styles.flexCenter}>
                                    <Text style={styles.userName}>{this.store.food?.user.name}</Text>
                                    <View style={styles.flexCenter}>
                                        <MaterialCommunityIcons size={20} color={Colors.highlight} name="star" style={styles.userStarIcon} />
                                        <Text style={styles.userStar}>{this.store.food?.star}</Text>
                                    </View>
                                </View>
                                <View style={[styles.flexCenter, { marginTop: 5 }]}>
                                    <MaterialCommunityIcons size={18} color={Colors.gray} name="clock-outline" style={styles.userStarIcon} />
                                    <Text style={styles.time}>{this.store.food?.time}</Text>
                                </View>
                            </View>
                        </View>

                        {/* <View style={[{ marginTop: 20 }, styles.flexCenter]}>
                            <Text style={{ marginRight: 5, fontWeight: 'bold' }}>Pickup Address:</Text>
                            <Text>{this.store.food?.address}</Text>
                        </View> */}

                        <View style={[{ marginTop: 10 }, styles.flexCenter]}>
                            <Text style={styles.titleLeft}>Phone number:</Text>
                            <Text>{this.store.food?.phone}</Text>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.titleLeft}>Message:</Text>
                            <Text>{this.store.food?.description}</Text>
                        </View>

                        <View style={{ marginTop: 20, }}>
                            <Text style={styles.titleLeft}>Pickup location:</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image resizeMode="cover"
                                    style={styles.map}
                                    source={require('../../assets/images/mapdemo.png')}></Image>
                            </View>
                        </View>

                    </View>
                </ScrollView>
                <View style={{ position: 'absolute', bottom: 2, width: '100%', padding: 5 }}>
                    <TouchableOpacity style={{
                        backgroundColor: Colors.toastWarning,
                        borderRadius: defaultBorderRadius
                    }}
                        onPress={() => { this.store.onPressRequest() }}>
                        <Text style={{
                            textAlign: 'center',
                            padding: 10,
                            fontSize: 20,
                            color: Colors.white,
                        }}>Reuest</Text>
                    </TouchableOpacity>
                </View>

                <Modal

                    isVisible={this.store.showModal}
                    deviceWidth={deviceWidth}
                    deviceHeight={deviceHeight}
                    style={[defaultStyles.modal, { backgroundColor: 'rbga(0,0,0,0,0.5)' }]}
                >
                    <KeyboardAvoidingView behavior={'padding'}>
                        <View style={{
                            backgroundColor: Colors.white, width: '100%', height: 300,
                            padding: 15
                        }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <TouchableOpacity
                                        onPress={() => { this.store.onPressCloseRequest() }}>
                                        <FontAwesome5 size={25} name="times" style={styles.userStarIcon} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.flexCenter}>
                                    <Text>
                                        You want to request:
                                </Text>
                                    <Text style={{ marginLeft: 5, fontSize: 18, fontWeight: 'bold' }}>
                                        {this.store.food?.title}
                                    </Text>
                                </View>

                                {
                                    this.store.food?.price == 0 ?
                                        <Text style={{}}></Text>
                                        :
                                        <View style={styles.flexCenter}>
                                            <Text>Price: </Text>
                                            <NumberFormat value={this.store.food?.price || 0}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                renderText={(value) =>
                                                    <Text style={{
                                                        marginRight: 10,
                                                        fontSize: 18,
                                                        fontWeight: 'bold'
                                                    }}>{value}đ</Text>
                                                } />
                                        </View>
                                }


                                <View style={{ marginTop: 10 }}>
                                    <Text >Message:</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1, borderColor: Colors.primary
                                            , borderRadius: defaultBorderRadius
                                            , minHeight: 100, marginTop: 2,
                                            padding: 10,
                                        }}
                                        multiline={true}
                                        placeholder="Pick up at 3 - 5p.m "
                                        numberOfLines={4}
                                        onChangeText={(text) => this.store.setState({ text })}
                                        value={this.store.text} />

                                </View>
                            </View>

                            <View>
                                <TouchableOpacity style={{
                                    backgroundColor: Colors.toastWarning,
                                    borderRadius: defaultBorderRadius,
                                    marginBottom: 15,
                                }}
                                    onPress={() => { this.store.onPressSubmit(this.props.navigation) }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        padding: 10,
                                        fontSize: 20,
                                        color: Colors.white,
                                    }}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>

                <Toast ref={(ref: Toast) => { this.store.toast = ref }}
                    position='center'
                    showCheckIcon={true}
                    style={defaultStyles.successCenterToast}
                    textStyle={styles.toastText}
                />
            </View >

        )
    }
}





const headerImageHeight = 150;
const headerContentHeight = 35;
const actionButtonAreaHeight = 120;
const actionButtonAreaMarginHorizontal = 16;
const categoryButtonWidth = 55;
const rabbitHearHeight = 24;

const styles = StyleSheet.create({
    titleLeft: {
        marginRight: 5,
        fontWeight: 'bold',
        fontSize: 16,
    },
    map: {
        height: 300,
    },
    adText: {
        color: Colors.white,
        fontSize: 22,
    },
    round: {
        height: 100,
        backgroundColor: Colors.primary,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    screen: {
        flex: 1,
        backgroundColor: Colors.lightGray,
    },
    scrollView: {
        // padding: defaultMargin,
        // marginTop: headerImageHeight + 10,
        // minHeight: deviceHeight,
        // top: - (headerImageHeight / 2 + headerContentHeight / 2) + (Platform.OS === 'ios' ? (headerContentHeight / 2 + rabbitHearHeight) : 0),
    },
    bottomBar: {
        backgroundColor: 'rgba(0,0,0, 0.2)',
    },
    address: {
        fontSize: 17,
        color: Colors.white,
        fontWeight: 'bold',
    },
    toastText: {
        ...defaultStyles.text,
        color: Colors.white,
        textAlign: 'center',
    },
    foodContainer: {
        margin: 12,
        marginBottom: 15,
        borderRadius: defaultBorderRadius,
        shadowOpacity: 0.25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        backgroundColor: Colors.white,
    },
    title: {
        fontSize: 24,
    },
    banner: {},
    like: {
        fontSize: 23,
        color: Colors.white,
    },
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
    },
    padding: {
        padding: 10,
    },
    userAvatar: {
        width: 70,
        height: 70,
        borderRadius: 100,
        marginRight: 5,
    },
    userName: {
        fontSize: 22,
        marginRight: 5,
    },
    userStarIcon: {
        marginRight: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 0 }
    },
    userStar: {
        fontSize: 15,
    },
    time: {
        fontSize: 15,
        color: Colors.gray,
    },
    money: {
        fontSize: 15,
    },
    moneyIcon: {
        marginRight: 3,
    },
});