import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { observer } from 'mobx-react';
import { CopyVoucherCodeSuccessModalStore } from './copyVoucherCodeSuccessModalStore';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { defaultStyles } from '../../commons/defaultStyles';
import I18n from 'react-native-i18n';
import { defaultMargin } from '../../commons/constant';
import { Colors } from '../../commons/colors';

interface Props {
    store: CopyVoucherCodeSuccessModalStore;
    code?: string;
    url?: string;
}

@observer
export default class CopyVoucherCodeSuccessModal extends Component<Props> {

    store!: CopyVoucherCodeSuccessModalStore;

    constructor(props: Props) {
        super(props);
        this.store = props.store;
        this.store.init(props.code, props.url);
    };



    render() {
        return (
            <Modal
                isVisible={this.store?.isVisible}
                onBackdropPress={this.store.hide}
            >
                <View style={defaultStyles.modalContent}>
                    <View style={defaultStyles.centerCenter}>
                        <LottieView style={styles.animation} source={require('../../assets/animations/congratulation.json')} autoPlay />
                        <Text style={styles.title}>{I18n.t('copied_success')}:</Text>
                        <Text style={styles.code}>{this.props.code}</Text>
                        <Text style={styles.title}>{I18n.t('is_move_to_sale_page')}...</Text>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        ...defaultStyles.text,
        margin: defaultMargin,
    },
    code: {
        ...defaultStyles.textLarge,
        margin: defaultMargin,
        color: Colors.primary,
    },
    animation: {
        width: 200,
        height: 200,
    }
});


