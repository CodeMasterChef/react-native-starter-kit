import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import { observer, Observer } from 'mobx-react';
import { BrandListStore } from './brandListStore';
import I18n from 'react-native-i18n';
import { Colors } from '../../commons/colors';
import { defaultLoyalPointCurrency, defaultMargin, defaultBorderWidth, defaultBorderRadius, defaultBorderBottomWidth, defaultBorderRightWidth, zeroUID, processCircleSnailSize, processCircleSnailColors, processCircleSnailSpinDuration } from '../../commons/constant';
import SectionList from 'react-native-tabs-section-list';
import Octicons from 'react-native-vector-icons/Octicons';
import { NavigationScreenProp } from 'react-navigation';
import NumberFormat from 'react-number-format';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import { Brand } from '../../@model/brand';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const avatarWidth = 50;

interface Props {
    navigation: NavigationScreenProp<any>,
    isLinkedBrand: boolean,
    onPressLinkBrandButton?: any;
    store: BrandListStore;
    onRefresh?: any;
}

@observer
export default class BrandList extends Component<Props> {

    store: BrandListStore;

    constructor(props: Props) {
        super(props);
        this.store = props.store ? props.store : new BrandListStore();
    };


    componentDidMount() {
        this.store.setNavigation(this.props.navigation);
        this.store.setOnPressLinkButtonCallback(this.props.onPressLinkBrandButton);
        this.store.setOnRefreshCallback(this.props.onRefresh);
    }

    render() {

        return (
            <View style={defaultStyles.container}>
                {
                    !!(!this.store.isRefreshing && this.store.sections && !this.store.sections.length) ?
                        <View style={defaultStyles.horizontalCenter}>
                            <Text style={defaultStyles.text}>{I18n.t('no_wallet_is_added')}.</Text>
                        </View>
                        :
                        <View style={defaultStyles.container}>
                            <View style={styles.searchArea}>
                                <View style={styles.searchContainer}>
                                    <Octicons style={styles.searchIcon} name='search' size={26}
                                        color={Colors.lightGray} />

                                    <TextInput
                                        style={styles.searchInput}
                                        returnKeyType='done'
                                        clearButtonMode='always'
                                        placeholder={`${I18n.t('trademark_name')}...`}
                                        value={this.store.searchText}
                                        onChangeText={this.store.onChangeSearchTextInput}
                                    />
                                    {
                                        (Platform.OS === 'android' && !!this.store.searchText) &&
                                        <TouchableOpacity onPress={() => this.store.onChangeSearchTextInput('')}>
                                            <EvilIcons style={styles.searchIcon}
                                                name='close-o'
                                                size={26}
                                                color={Colors.gray}
                                            />
                                        </TouchableOpacity>
                                    }


                                </View>
                            </View>

                            <View style={[styles.sectionsContainer, defaultStyles.container]}>
                                {
                                    !!(this.store.sections) &&
                                    <SectionList
                                        sections={this.store.sections}
                                        keyExtractor={item => item.id ? item.id : item.brandId}
                                        stickySectionHeadersEnabled={false}
                                        scrollToLocationOffset={50}
                                        tabBarStyle={styles.tabBar}
                                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                                        refreshing={this.store.isRefreshing}
                                        onRefresh={this.store.onRefresh}
                                        renderTab={({ title, isActive }) => (
                                            <View
                                                style={[
                                                    styles.tabContainer,
                                                    { borderBottomWidth: isActive ? 1 : 0 }
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.tabText,
                                                        { color: isActive ? '#090909' : '#9e9e9e' }
                                                    ]}
                                                >
                                                    {title}
                                                </Text>
                                            </View>
                                        )}
                                        renderSectionHeader={({ section }) => (
                                            <Observer key={section.id}>
                                                {
                                                    () => <View>
                                                        <View style={styles.sectionHeaderContainer} />
                                                        <Text style={styles.sectionHeaderText}>{section.title}</Text>
                                                    </View>
                                                }
                                            </Observer>
                                        )}
                                        renderItem={({ item }: { item: Brand }) =>
                                            <Observer key={item.id ? item.id : item.brandId}>{
                                                () =>
                                                    <TouchableOpacity
                                                        disabled={!this.store.enabledPressRowItem}
                                                        onPress={() => this.store.onPressRowItem(item)}
                                                        style={styles.itemContainer}>
                                                        <View style={defaultStyles.row}>
                                                            <View style={styles.avatarContainer}>
                                                                {
                                                                    !!(item.id === zeroUID) &&
                                                                    <Image source={require('../../assets/images/loyal_one.png')}
                                                                        style={styles.avatar}
                                                                    />
                                                                }
                                                                {
                                                                    !!(item.urlAvatar && item.id !== zeroUID) &&
                                                                    <Image style={styles.avatar} source={{ uri: item.urlAvatar }} />
                                                                }
                                                            </View>
                                                            <View style={styles.itemTitleContainer}>
                                                                <Text style={styles.itemTitle}>{item.name ? item.name : item.brandName}</Text>
                                                            </View>

                                                            {
                                                                (this.props.isLinkedBrand) ?
                                                                    <View style={styles.linkButtonContainer}>
                                                                        {
                                                                            !this.store.hideLinkButton &&
                                                                            <View>
                                                                                {
                                                                                    !!(item.linked) ?
                                                                                        <View>
                                                                                            <Text style={defaultStyles.textBold}>{I18n.t('linked')}</Text>
                                                                                        </View>
                                                                                        : <TouchableOpacity
                                                                                            style={styles.linkButton}
                                                                                            onPress={() => this.store.onPressLinkBrandButton(item)}>
                                                                                            <Text style={styles.linkText}>{I18n.t('link')}</Text>
                                                                                        </TouchableOpacity>
                                                                                }
                                                                            </View>
                                                                        }
                                                                    </View>
                                                                    :
                                                                    <View style={defaultStyles.row}>

                                                                        <View style={styles.itemColumn}>
                                                                            {
                                                                                (item.isRefreshing) ?
                                                                                    <Progress.CircleSnail
                                                                                        size={processCircleSnailSize}
                                                                                        color={processCircleSnailColors}
                                                                                        spinDuration={processCircleSnailSpinDuration}
                                                                                    /> :
                                                                                    <NumberFormat value={item.point}
                                                                                        displayType={'text'}
                                                                                        thousandSeparator={true}
                                                                                        renderText={(value) =>
                                                                                            <View style={defaultStyles.currencyContainer}>
                                                                                                <Text style={styles.itemPrice}>{value}</Text>
                                                                                                <Text style={defaultStyles.textCurrency}>{item.brandPointCode ? item.brandPointCode : I18n.t('points')}</Text>
                                                                                            </View>
                                                                                        } />
                                                                            }

                                                                            {

                                                                                (item.isRefreshing) ?
                                                                                    <Progress.CircleSnail
                                                                                        size={processCircleSnailSize}
                                                                                        color={processCircleSnailColors}
                                                                                        spinDuration={processCircleSnailSpinDuration}
                                                                                    /> :
                                                                                    <NumberFormat value={item.lopPoint}
                                                                                        displayType={'text'}
                                                                                        thousandSeparator={true}
                                                                                        renderText={(value) =>
                                                                                            <View style={defaultStyles.currencyContainer}>
                                                                                                <Text style={styles.itemPrice}>≈ {value}</Text>
                                                                                                <Text style={defaultStyles.textCurrency}>{defaultLoyalPointCurrency}</Text>
                                                                                            </View>

                                                                                        } />
                                                                            }


                                                                        </View>
                                                                        <TouchableOpacity style={defaultStyles.padding}
                                                                            onPress={() => this.store.onPressSyncButton(item)}
                                                                        >
                                                                            <MaterialCommunityIcons name='sync' size={32} color={Colors.secondary} />
                                                                        </TouchableOpacity>
                                                                    </View>

                                                            }

                                                        </View>
                                                    </TouchableOpacity>
                                            }</Observer>

                                        }
                                    />
                                }
                            </View>
                        </View>

                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    balance: {
        color: Colors.white,
        fontSize: 37,
    },
    refillButton: {
        flexDirection: 'row',
        backgroundColor: 'rgba(46, 4, 91, 0.7)',
        alignItems: 'center',
        borderRadius: 4,
    },
    refillText: {
        color: Colors.highlight,
        fontSize: 22,
        paddingLeft: defaultMargin,
        paddingVertical: defaultMargin,
    },
    refillIcon: {
        color: Colors.highlight,
        fontSize: 22,
        paddingRight: defaultMargin,
        paddingVertical: defaultMargin,
    },
    sectionsContainer: {
    },
    tabBar: {
        backgroundColor: '#fff',
        borderBottomColor: '#f4f4f4',
        borderBottomWidth: 1
    },
    tabContainer: {
        borderBottomColor: '#090909'
    },
    tabText: {
        padding: 15,
        color: '#9e9e9e',
        fontSize: 18,
        fontWeight: '500'
    },
    separator: {
        height: 0.5,
        width: '96%',
        alignSelf: 'flex-end',
        backgroundColor: '#eaeaea'
    },
    sectionHeaderContainer: {
        height: 10,
        backgroundColor: '#f6f6f6',
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1,
        borderBottomColor: '#f4f4f4',
        borderBottomWidth: 1
    },
    sectionHeaderText: {
        color: '#010101',
        backgroundColor: '#fff',
        fontSize: 23,
        fontWeight: 'bold',
        paddingTop: 25,
        paddingBottom: 5,
        paddingHorizontal: 15
    },
    itemContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    itemTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemTitle: {
        flex: 1,
        fontSize: 20,
        marginHorizontal: defaultMargin,
    },
    itemPrice: {
        fontSize: 18,
    },
    itemDescription: {
        marginTop: 10,
        fontSize: 16
    },
    itemRow: {
        flexDirection: 'row',
    },
    itemColumn: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    avatarContainer: {
        backgroundColor: Colors.lightGray,
        width: avatarWidth,
        height: avatarWidth,
        borderRadius: defaultBorderRadius,
    },
    avatar: {
        borderRadius: defaultBorderRadius,
        width: avatarWidth,
        height: avatarWidth,
    },
    searchArea: {
        backgroundColor: Colors.white,
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.primary,
        borderWidth: defaultBorderWidth,
        margin: defaultMargin,
    },
    searchIcon: {
        backgroundColor: Colors.white,
        padding: defaultMargin,
    },
    searchInput: {
        flex: 1,
        paddingLeft: 0,
        backgroundColor: Colors.white,
    },
    linkButton: {
        backgroundColor: Colors.lightGray,
        borderRadius: defaultBorderRadius,
        borderColor: Colors.secondary,
        borderWidth: defaultBorderWidth,
        borderBottomWidth: defaultBorderBottomWidth,
        borderRightWidth: defaultBorderRightWidth,

    },
    linkText: {
        ...defaultStyles.text,
        color: Colors.primary,
        margin: defaultMargin,
    },
    linkButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});


