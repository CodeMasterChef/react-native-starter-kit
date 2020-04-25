import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import { DefaultNavigationOptions, HeaderNavigation } from '../../commons/defaultHeaderStyle';
import { observer } from 'mobx-react';
import { PartnerBrandScreenStore } from './partnerBrandScreenStore';
import I18n from 'react-native-i18n';
import BrandList from '../../components/brandList/brandList';
import { NavigationScreenProp } from 'react-navigation';
import { defaultBorderWidth, defaultBorderRadius, defaultMargin } from '../../commons/constant';
import { Colors } from '../../commons/colors';
import { stores } from '../../stores';
import LinkOrRegisterMemberModal from '../../components/linkOrRegisterMemberModal/linkOrRegisterMemberModal';
const avatarWidth = 60;

export const partnerBrandScreenParams = {
    hideLinkButton: 'hideLinkButton',
    onPressItemRow: 'onPressItemRow',
    brandPointCategories: 'brandPointCategories',
    hideUnlinkBrands: 'hideUnlinkBrands',
}
interface Props {
    navigation: NavigationScreenProp<any>,
}

@observer
export default class PartnerBrandScreen extends Component<Props> {
    //@ts-ignore
    static navigationOptions = () => ({
        title: I18n.t('brand'),
        headerBackTitle: I18n.t('brand'),
        header: (props: any) => <HeaderNavigation {...props} />,
        ...DefaultNavigationOptions,
    });

    store = new PartnerBrandScreenStore();
    onPressItemRow: void;

    constructor(props: Props) {
        super(props);
        stores.partnerBrandScreenStore = this.store;
        if (props.navigation.getParam(partnerBrandScreenParams.hideLinkButton)) {
            this.store.brandListStore.hideLinkButton = true;
        } if (props.navigation.getParam(partnerBrandScreenParams.hideUnlinkBrands)) {
            this.store.hideUnlinkBrand = true;
        }
        const onPressItemRow = props.navigation.getParam(partnerBrandScreenParams.onPressItemRow);
        if (onPressItemRow) {
            this.store.brandListStore.setOnPressRowItemCallback(onPressItemRow);
        }
    };

    componentDidMount() {
        this.store.setNavigation(this.props.navigation);
        const brandPointCategories = this.props.navigation.getParam(partnerBrandScreenParams.brandPointCategories);
        this.store.setBrandPointCategories(brandPointCategories);
    }

    render() {

        return (
            <View style={defaultStyles.container}>
                <BrandList navigation={this.props.navigation}
                    isLinkedBrand={true}
                    onPressLinkBrandButton={this.store.onPressLinkButton}
                    onRefresh={this.store.onRefresh}
                    store={this.store.brandListStore}
                />
                <LinkOrRegisterMemberModal store={this.store.linkOrRegisterMemberModalStore} />
            </View>
        )
    }
}



