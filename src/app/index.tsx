import { Text } from 'react-native';

import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import BasicExample from './BasicExample';


const demos = [
    { Component: BasicExample, name: 'Basic example' },
];

// show debug messages for demos.
// Menu.debug = true;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
const Demo = () => {
    const [selected, setSelected] = useState(undefined);
    if (selected) {
        return <selected.selected />;
    }
    const renderDemo = (demo, idx) => {
        const type = idx + '. ' + demo.name;
        return (
            <Pressable
                key={type}
                onPress={() => setSelected({ selected: demo.Component })}
            >
                <View>
                    <Text>{type}</Text>
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <View>
                <Text>Select example:</Text>
                {demos.map(renderDemo, this)}
            </View>
        </View>
    );
};

export default Demo;
