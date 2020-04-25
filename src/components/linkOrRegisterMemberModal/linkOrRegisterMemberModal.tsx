import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { observer } from 'mobx-react';
import { defaultMargin, deviceWidth, deviceHeight, modalCloseIconSize, zeroUID } from '../../commons/constant';
import { defaultStyles } from '../../commons/defaultStyles';
import Modal from 'react-native-modal';
import { Colors } from '../../commons/colors';
import { LinkOrRegisterMemberModalStore } from './linkOrRegisterMemberModalStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScalableImage from 'react-native-scalable-image';
import LinkMember from './linkMember/linkMember';
import RegisterMember from './registerMember/registerMember';

interface Props {
    store: LinkOrRegisterMemberModalStore,
    onRegisterSuccess?: any,
}

const avatarWidth = 70;
const avatarBorderRadius = 20;

@observer
export default class LinkOrRegisterMemberModal extends Component<Props> {

    store!: LinkOrRegisterMemberModalStore;

    constructor(props: Props) {
        super(props);
        this.store = props.store;
    }

    render() {
        return (
            <Modal
                isVisible={this.store.isVisible}
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                style={defaultStyles.modal}
            >
                <KeyboardAwareScrollView style={defaultStyles.container}>
                    <View style={defaultStyles.modalContent}>
                        <View style={defaultStyles.modalCloseButtonContainer} >
                            <TouchableOpacity onPress={this.store.hide}>
                                <MaterialCommunityIcons name='close' color={Colors.black} size={modalCloseIconSize} />
                            </TouchableOpacity>
                        </View>
                        <View style={defaultStyles.margin}>
                            <View style={styles.modalHeader}>
                                <View style={styles.avatarContainer}>
                                    {
                                        !!(this.store.brand?.id === zeroUID) &&
                                        <ScalableImage source={require('../../assets/images/loyal_one.png')} style={styles.avatar}
                                            width={avatarWidth}
                                        />
                                    }
                                    {
                                        !!(this.store.brand?.urlAvatar && this.store.brand?.id !== zeroUID) &&
                                        <ScalableImage source={{ uri: this.store.brand?.urlAvatar }} style={styles.avatar}
                                            width={avatarWidth}
                                        />
                                    }
                                </View>
                                <View style={defaultStyles.verticalCenter} >
                                    <Text style={[defaultStyles.text, defaultStyles.margin]}>{this.store.brand?.name}</Text>
                                </View>
                            </View>
                            {
                                !this.store.isRegisterMember ?
                                    <LinkMember store={this.store.linkMemberStore} 
                                    onSwitchRegisterMember={this.store.onSwitchRegisterMember}
                                    onLinkMemberSuccess={this.store.onLinkMemberSuccess}
                                    />
                                    :
                                    <RegisterMember
                                        store={this.store.registerMemberStore}
                                        onRegisterSuccess={this.store.onRegisterSuccess}
                                        onSwitchLinkMember={this.store.onSwitchLinkMember} />
                            }
                        </View>
                    </View>
                </KeyboardAwareScrollView>

            </Modal>

        );
    }

};

const styles = StyleSheet.create({

    modalHeader: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatarContainer: {
        backgroundColor: Colors.lightGray,
        borderRadius: avatarBorderRadius,
        width: avatarWidth,
        height: avatarWidth,
        margin: defaultMargin,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        borderRadius: avatarBorderRadius,
        margin: 0,
        width: avatarWidth,
        height: avatarWidth,
    },
});
