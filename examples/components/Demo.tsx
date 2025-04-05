import React, { Component, ComponentPropsWithRef } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Pressable } from 'react-native';
import Menu from 'react-native-popup-menu';

import ControlledExample from '../app/controlled-example';
import ExtensionExample from '../app/extensions-example';
import ModalExample from '../app/modal-example';
import StylingExample from '../app/styling-example';
import NonRootExample from '../app/non-root-example';
import TouchableExample from '../app/touchable-config-example';
import MenuMethodsExample from '../app/controlling-menu-using-menu-methods';
import CloseOnBackExample from '../app/close-on-back-button-press-example';
import FlatListExample from '../app/using-flatlist';
import InFlatListExample from '../app/menu-in-flatlist-example'; // Note: double slash is intentional to avoid path issues
import PopoverExample from '../app/popover-renderer-example';
import { Link } from 'expo-router';
import BasicExample from '../app/basic-example';
import AdvancedExample from '../app/advanced-example';

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
  { Component: InFlatListExample, name: 'Menu in FlatList Example' },
  { Component: PopoverExample, name: 'Popover renderer example' }
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
        {demos.map((demo, idx) => {
          const { Component, name } = demo;
          const url: string = name.replace(/\s+/g, '-').toLowerCase(); // Normalize the name for URL
          return (
            <Link
              key={idx}
              href={url} // This is just a placeholder, you can use a real route if needed
            >
              {demo.name}
            </Link>
          );
        })}
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
