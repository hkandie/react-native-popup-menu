import React, { Component, ComponentPropsWithRef } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Pressable } from 'react-native';
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
import AdvancedExample from './Example';

const demos: Array<{ Component: React.FunctionComponent; name: string }> = [
  { Component: BasicExample, name: 'Basic example' },
  { Component: AdvancedExample, name: 'Advanced example' },
  { Component: ControlledExample, name: 'Controlled example' },
  { Component: MenuMethodsExample, name: 'Controlling menu using menu methods' },
  { Component: ExtensionExample, name: 'Extensions example' },
  { Component: ModalExample, name: 'Modal example' },
  { Component: StylingExample, name: 'Styling example' },
  { Component: TouchableExample, name: 'Touchable config example' },
  { Component: NonRootExample, name: 'Non root example' },
  { Component: CloseOnBackExample, name: 'Close on back button press example' },
  { Component: FlatListExample, name: 'Using FlatList' },
  { Component: InFlatListExample, name: 'Menu in FlatList' },
  { Component: PopoverExample, name: 'Popover renderer' }
];

// show debug messages for demos.
Menu.debug = true;

const Demo = () => {
  const [selected, setSelected] = React.useState<ComponentPropsWithRef<any> | undefined>(undefined);

  if (selected) {
    return (
      <View>
        <View>
          <Pressable
            onPress={() => {
              setSelected(undefined);
            }}
            style={{ padding: 10, backgroundColor: '#ddd', marginBottom: 10 }}
          >
            <Text style={{ fontSize: 16, color: 'blue' }}>Back to selection</Text>
          </Pressable>
        </View>
        {selected}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>Select example:</Text>
        {demos.map((demo, idx) => (
          <TouchableHighlight
            key={idx}
            onPress={() => setSelected(demo.Component)}
          >
            <View>
              <Text>
                {idx + 1}. {demo.name}
              </Text>
            </View>
          </TouchableHighlight>
        ))}
      </View>
    </View>
  );
};

export default Demo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
