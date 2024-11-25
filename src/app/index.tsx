import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

const demos = [
  'Basic example',
  'Advanced example',
  'Controlled example',
  'Controlling menu using menu methods',
  'Extensions example',
  'Modal example',
  'Styling example',
  'Touchable config example',
  'Non root example',
  'Close on back button press example',
  'Using FlatList',
  'Menu in FlatList',
  'Popover renderer'
];

export default function Page() {
  return (
    <View style={styles.container}>
      <Text>{'Select example:'}</Text>
      <View>
        {demos.map((demo) => {
          const type = demo.toLowerCase().replaceAll(' ', '-');
          return (
            <Link
              href={type}
              key={type}
            >
              <Pressable>
                <Text>{demo}</Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
