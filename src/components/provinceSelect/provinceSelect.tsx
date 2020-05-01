import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { observer } from 'mobx-react';
import { defaultMargin } from '../../commons/constant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { defaultStyles } from '../../commons/defaultStyles';
import Modal from 'react-native-modal';
import { Colors } from '../../commons/colors';
import { ProvinceSelectStore } from './provinceSelectStore';


interface Props {
    store: ProvinceSelectStore,
    hideIcon?: boolean,
    textAlign?: 'right' | 'left' | 'center',
    initialLabel?: string,
}

@observer
export default class ProvinceSelect extends Component<Props> {

    store: ProvinceSelectStore;

    constructor(props: Props) {
        super(props);
        this.store = props.store;
        if (props.initialLabel) {
            this.store.setSelectedProvinceText(props.initialLabel);
        }
    }

    render() {
        return (
            <View style={defaultStyles.container}>
                <TouchableOpacity style={styles.textInputContainer}
                    onPress={this.store.onPressProvinceInput}
                >
                    <View style={styles.textInputIconContainer}>
                        {!this.props.hideIcon &&
                            <MaterialIcons
                                name='location-city'
                                size={32}
                                color={Colors.gray} />
                        }
                    </View>
                    <View style={[defaultStyles.container, defaultStyles.verticalCenter]}>
                        <Text style={[defaultStyles.text, { textAlign: this.props.textAlign ? this.props.textAlign : 'left' }]}>{this.store.selectedProvinceText}</Text>
                    </View>

                </TouchableOpacity>

                <Modal isVisible={this.store.isVisibleProvinceModal}>
                    <ScrollView>
                        <View style={styles.genderModal}>
                            {
                                this.store.provinces.map((province) => {
                                    return (
                                        <TouchableOpacity
                                            style={styles.listItem}
                                            onPress={() => this.store.onPressProvinceListItem(province)}>
                                            <Text style={[defaultStyles.text, defaultStyles.margin]}>{province.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
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
