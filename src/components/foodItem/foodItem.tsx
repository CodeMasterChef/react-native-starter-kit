import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform, Image, ImageBackground } from 'react-native';
import { observer } from 'mobx-react';
import { defaultMargin, defaultBorderRadius } from '../../commons/constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import NumberFormat from 'react-number-format';

import { defaultStyles } from '../../commons/defaultStyles';
import Modal from 'react-native-modal';
import { Colors } from '../../commons/colors';
import { FoodItemStore } from './foodItemStore';
import { resetGlobalState } from 'mobx/lib/internal';
import { NavigationScreenProp } from 'react-navigation';

interface Props {
    food: any;
    navigation: NavigationScreenProp<any>;
    store?: FoodItemStore,
    hideIcon?: boolean,
    textAlign?: 'right' | 'left' | 'center',
    initialLabel?: string,
}

@observer
export default class FoodItem extends Component<Props> {

    store: FoodItemStore = new FoodItemStore();


    constructor(props: Props) {
        super(props);
        this.store.food = props.food;
    }

    render() {
        return (
            <View style={styles.foodContainer}>
                <TouchableOpacity
                    onPress={() => { this.store.onPressItem(this.props.navigation) }}
                >
                    <View style={styles.padding}>
                        <Text numberOfLines={1} ellipsizeMode="tail"
                            style={styles.title}>{this.store.food.title}</Text>
                    </View>
                    <View>
                        <ImageBackground
                            style={{ height: 170 }}
                            source={{ uri: this.store.food.image }}
                        >
                            <View style={{ flex: 1 }}></View>
                            <View style={[styles.padding, styles.bottomBar, styles.flexCenter, { justifyContent: 'space-between' }]}>
                                <Text style={styles.address}>{this.store.food.address}</Text>
                                <View style={styles.flexCenter}>
                                    <MaterialCommunityIcons size={30} color={Colors.white} name="heart-outline" />
                                    <Text style={styles.like}>{this.store.food.like}</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={[styles.padding, styles.flexCenter, { justifyContent: 'space-between' }]}>
                        <View style={styles.flexCenter}>
                            <Image resizeMode="contain"
                                style={styles.userAvatar}
                                source={{ uri: this.store.food.user.avatar }}></Image>
                            <Text style={styles.userName}>{this.store.food.user.name}</Text>
                            <MaterialCommunityIcons size={20} color={Colors.highlight} name="star" style={styles.userStarIcon} />
                            <Text style={styles.userStar}>{this.store.food.star}</Text>
                        </View>
                        <View style={styles.flexCenter}>
                            <SimpleLineIcons style={styles.moneyIcon} size={16} name="tag" />
                            {
                                this.store.food.price == 0 ?
                                    <Text style={{}}>Free</Text>
                                    :
                                    <NumberFormat value={this.store.food.price || 0}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        renderText={(value) =>
                                            <Text style={styles.money}>{value}đ</Text>
                                        } />
                            }

                        </View>

                    </View>

                </TouchableOpacity>
            </View >
        );
    }

};

const styles = StyleSheet.create({
    bottomBar: {
        backgroundColor: 'rgba(0,0,0, 0.2)',
    },
    address: {
        fontSize: 17,
        color: Colors.white,
        fontWeight: 'bold',
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
        width: 40,
        height: 40,
        borderRadius: 100,
        marginRight: 5,
    },
    userName: {
        fontSize: 15,
        marginRight: 5,
    },
    userStarIcon: {
        marginRight: 1,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 0 }
    },
    userStar: {
        fontSize: 15,
    },
    money: {
        fontSize: 15,
    },
    moneyIcon: {
        marginRight: 3,
    },
});
