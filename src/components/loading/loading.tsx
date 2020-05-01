import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { loadingPageCircleSize, processCircleSnailColors, processCircleSnailSpinDuration } from '../../commons/constant';
import * as Progress from 'react-native-progress';

interface Props {
    colors?: any,
    size?: number,
}

@observer
export default class Loading extends Component<Props> {

    size = loadingPageCircleSize;

    constructor(props: Props) {
        super(props);
        if (props.size) {
            this.size = props.size;
        }
    };

    render() {
        return (
            <View style={styles.container} >
                <Progress.CircleSnail
                    style={{ width: this.size }}
                    size={this.size}
                    color={this.props.colors ? this.props.colors : processCircleSnailColors}
                    spinDuration={processCircleSnailSpinDuration}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
});


