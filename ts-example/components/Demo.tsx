import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Menu from "react-native-popup-menu";
import { Link } from "expo-router";

const demos = [
  { route: "basic", name: "Basic example" },
  { route: "advanced", name: "Advanced example" },
  { route: "controlled", name: "Controlled example" },
  { route: "extension", name: "Extension example" },
  { route: "modal", name: "Modal example" },
  { route: "styling", name: "Styling example" },
  { route: "non-root", name: "Non-root example" },
  { route: "touchable", name: "Touchable example" },
  { route: "menu-methods", name: "Controlling menu using menu method" },
  { route: "close-on-back", name: "Close on back example" },
  { route: "flat-list", name: "FlatList example" },
  { route: "in-flat-list", name: "In FlatList example" },
  { route: "popover", name: "Popover example" },
];

// show debug messages for demos.
Menu.debug = true;

const Demo = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text>Select example:</Text>
        {demos.map((demo, idx) => {
          return (
            <Link href={`/${demo.route}`} key={demo.route}>
              <Pressable>
                <Text>
                  {idx + 1}: {demo.name}
                </Text>
              </Pressable>
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
