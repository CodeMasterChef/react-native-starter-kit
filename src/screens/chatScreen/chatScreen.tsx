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
import { ChatStore } from './chatScreenStore';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

import { HeaderNavigation, DefaultNavigationOptions } from '../../commons/defaultHeaderStyle';
interface Props {
    navigation: NavigationScreenProp<any>;
    food: any;
}
@observer
export default class ChatScreen extends Component<Props> {

    store!: ChatStore;

    static navigationOptions = ({ }) => ({
        title: 'Chat',
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
    });

    constructor(props: Props) {
        super(props);
        this.store = new ChatStore();
        stores.navigation = props.navigation;
        this.store.food = this.props.navigation.getParam('food');


    };

    render() {
        return (
            <View style={styles.screen}>
                {/* <ScrollView style={styles.scrollView} > */}

                <GiftedChat
                    messages={this.store.messages}
                    onSend={messages => this.store.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                    renderFooter={() => {
                        return (this.store.typing ?
                            <Text style={{ margin: 10 }}>Typing...</Text>
                            :
                            <Text></Text>
                        )
                    }}
                />
                {/* </ScrollView> */}
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