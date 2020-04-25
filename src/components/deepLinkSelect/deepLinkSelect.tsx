import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { observer } from 'mobx-react';
import { defaultMargin, modalCloseIconSize } from '../../commons/constant';
import { defaultStyles } from '../../commons/defaultStyles';
import Modal from 'react-native-modal';
import { Colors } from '../../commons/colors';
import { DeepLinkSelectStore } from './deepLinkSelectStore';
import I18n from 'react-native-i18n';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    store: DeepLinkSelectStore
}

@observer
export default class DeepLinkSelect extends Component<Props> {

    store!: DeepLinkSelectStore;

    constructor(props: Props) {
        super(props);
        this.store = props.store;
    }

    render() {
        return (
            <Modal isVisible={this.store.isVisible}
                onBackdropPress={this.store.onPressBackdrop}
            >
                <View style={defaultStyles.modalContent}>
                    <View style={styles.closeButtonContainer} >
                        <TouchableOpacity onPress={this.store.onPressCloseButton}>
                            <MaterialCommunityIcons name='close' color={Colors.black} size={modalCloseIconSize} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.option, this.store.isNotMember ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate]}
                        disabled={this.store.isNotMember}
                        onPress={this.store.onPressEarnPointRequestOption}
                    >
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} resizeMode='contain' source={require('../../assets/images/earn_point.png')} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{I18n.t('earn_points')}</Text>
                            <Text style={defaultStyles.text}>{I18n.t('earn_point_description')}</Text>
                            {
                                this.store.isNotMember &&
                                <Text style={styles.alert}>{I18n.t('you_are_not_member_now')}</Text>
                            }
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.option, !this.store.isNotMember ? defaultStyles.buttonDisabled : defaultStyles.buttonActivate]}
                        disabled={!this.store.isNotMember}
                        onPress={this.store.onPressRegisterMemberOption}
                    >
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} resizeMode='contain' source={require('../../assets/images/register_member.png')} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{I18n.t('register_member')}</Text>
                            <Text style={defaultStyles.text}>{I18n.t('register_member_description')}</Text>
                            {
                                (!this.store.isNotMember) &&
                                <Text style={styles.alert}>{I18n.t('you_are_member_now')}</Text>
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>

        );
    }

};

const styles = StyleSheet.create({
        closeButtonContainer: {
        alignItems: 'flex-end',
        marginHorizontal: 5,
        marginVertical: 2,
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: 1,
    },
    option: {
        flexDirection: 'row',
        padding: defaultMargin,

    },
    imageContainer: {
        padding: defaultMargin,
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: 1,
    },
    image: {
        width: 32,
    },
    textContainer: {
        backgroundColor: Colors.white,
        justifyContent: 'center',
        flex: 1,
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: 1,
    },
    title: {
        ...defaultStyles.textMedium,
    },
    alert: {
        ...defaultStyles.textSmall,
        color: Colors.highlight,
    },

});
