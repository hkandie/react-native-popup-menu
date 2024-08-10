import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Menu from 'react-native-popup-menu';

import Example from './Example';
import BasicExample from './BasicExample';
import ControlledExample from './ControlledExample';
import ExtensionExample from './ExtensionExample';
import ModalExample from './ModalExample';
import StylingExample from './StylingExample';
import NonRootExample from './NonRootExample';
import TouchableExample from './TouchableExample';
import MenuMethodsExample from './MenuMethodsExample';
import CloseOnBackExample from './CloseOnBackExample';
import FlatListExample from './FlatListExample';
import InFlatListExample from './InFlatListExample';
import PopoverExample from './PopoverExample';

const demos = [
    { Component: BasicExample, name: 'Basic example' },
    { Component: Example, name: 'Advanced example' },
    { Component: ControlledExample, name: 'Controlled example' },
    {
        Component: MenuMethodsExample,
        name: 'Controlling menu using menu methods',
    },
    { Component: ExtensionExample, name: 'Extensions example' },
    { Component: ModalExample, name: 'Modal example' },
    { Component: StylingExample, name: 'Styling example' },
    { Component: TouchableExample, name: 'Touchable config example' },
    { Component: NonRootExample, name: 'Non root example' },
    {
        Component: CloseOnBackExample,
        name: 'Close on back button press example',
    },
    { Component: FlatListExample, name: 'Using FlatList' },
    { Component: InFlatListExample, name: 'Menu in FlatList' },
    { Component: PopoverExample, name: 'Popover renderer' },
];

// show debug messages for demos.
Menu.debug = true;

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
