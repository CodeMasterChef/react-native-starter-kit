import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { observer } from 'mobx-react';
import { defaultMargin } from '../../commons/constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { defaultStyles } from '../../commons/defaultStyles';
import Modal from 'react-native-modal';
import { Colors } from '../../commons/colors';
import { GenderSelectStore } from './genderSelectStore';

interface Props {
    store: GenderSelectStore,
    hideIcon?: boolean,
    textAlign?: 'right' | 'left' | 'center',
    initialLabel?: string,
}

@observer
export default class GenderSelect extends Component<Props> {

    store: GenderSelectStore;

    constructor(props: Props) {
        super(props);
        this.store = props.store;
        if (props.initialLabel) {
            this.store.setSelectedGenderText(props.initialLabel);
        }
    }

    render() {
        return (
            <View style={defaultStyles.container}>
                <TouchableOpacity style={styles.textInputContainer}
                    onPress={this.store.onPressGenderInput}
                >
                    <View style={styles.textInputIconContainer}>
                        {!this.props.hideIcon &&
                            <AntDesign
                                name='user'
                                size={32}
                                color={Colors.gray} />
                        }
                    </View>
                    <View style={[defaultStyles.container, defaultStyles.verticalCenter]}>
                        <Text style={[defaultStyles.text, { textAlign: this.props.textAlign ? this.props.textAlign : 'left' }]}>{this.store.selectedGenderText}</Text>
                    </View>

                </TouchableOpacity>

                <Modal isVisible={this.store.isVisibleGenderModal}>
                    <View style={styles.genderModal}>
                        {
                            this.store.genders.map((gender) => {
                                return (
                                    <TouchableOpacity
                                        style={styles.listItem}
                                        onPress={() => this.store.onPressGenderListItem(gender)}>
                                        <Text style={[defaultStyles.text, defaultStyles.margin]}>{gender.label}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </Modal>
            </View>
        );
    }

};

const styles = StyleSheet.create({
    textInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
    },
    textInputIconContainer: {
        padding: defaultMargin,
    },
    genderModal: {
        backgroundColor: Colors.white,
    },
    listItem: {
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: 1,

    },
});
