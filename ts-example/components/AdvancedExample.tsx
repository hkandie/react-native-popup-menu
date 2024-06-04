import React from "react";
import { Text,View } from "react-native";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
let unique = 0;
const { SlideInMenu } = renderers;
const AdvancedExample = () => {
  const [log, setLog] = React.useState<
    Array<{
      value: string;
      id: number;
      highlighted?: boolean;
    }>
  >([]);
  function addLog(value: string) {
    setLog([...log, { value, id: ++unique }]);
  }
  function selectNumber(value: string) {
    addLog(`selecting number: ${value}`);
  }

  function selectOptionType(value: string) {
    const v = typeof value === "object" ? JSON.stringify(value) : value;
    addLog(`selecting type: ${v}`);
    return value !== "Do not close";
  }
  function toggleHighlight(id) {
    const logs = log.map((l) => {
      if (l.id === id) {
        return Object.assign({}, l, { highlighted: !l.highlighted });
      }
      return l;
    });
    setLog(logs);
  }

  function deleteLogItem(id: string | number) {
    const logs = log.filter((l) => l.id !== id);
    setLog(logs);
  }
  return (
    <MenuProvider style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.topbar}>
          <Menu
            name="numbers"
            renderer={SlideInMenu}
            onSelect={(value) => selectNumber(value)}
          >
            <MenuTrigger style={styles.trigger}>
              <Text style={[styles.text, styles.triggerText]}>
                Slide-in menu...
              </Text>
            </MenuTrigger>
            <MenuOptions
              customStyles={{ optionText: [styles.text, styles.slideInOption] }}
            >
              <MenuOption value={1} text="Option one" />
              <MenuOption value={2} text="Option two" />
              <MenuOption value={3} text="Option three" />
              <MenuOption value={4} text="Option four" />
              {null /* conditional not rendered option */}
              <MenuOption value={5} text="Option five" />
            </MenuOptions>
          </Menu>
          <View style={{ flex: 1 }}></View>
          <Menu
            name="types"
            onSelect={(value) => selectOptionType(value)}
            onBackdropPress={() =>
              addLog("menu will be closed by backdrop")
            }
            onOpen={() => addLog("menu is opening")}
            onClose={() => addLog("menu is closing")}
          >
            <MenuTrigger
              onAlternativeAction={() => addLog("trigger longpressed")}
              style={styles.trigger}
            >
              <Text style={[styles.text, styles.triggerText]}>
                Context menu...
              </Text>
            </MenuTrigger>
            <MenuOptions customStyles={{ optionText: styles.text }}>
              <MenuOption value="Normal" text="Normal" />
              <MenuOption value="N/A" disabled={true} text="Disabled" />
              <MenuOption
                value="N/A"
                disableTouchable={true}
                text="Non-selectable"
              />
              <MenuOption value="Do not close" text="Do not close" />
              <View style={styles.divider} />
              <MenuOption
                value={{ text: "Hello world!" }}
                text="Object as value"
              />
            </MenuOptions>
          </Menu>
        </View>

        <ScrollView style={styles.logView}>
          {state.log.map((l, i) => {
            const wrapperStyle = {
              backgroundColor: i % 2 ? "white" : "whitesmoke",
            };
            const textStyle = { color: l.highlighted ? "red" : "gray" };
            return (
              <View style={[styles.logItem, wrapperStyle]} key={l.id}>
                <Text style={[styles.text, textStyle]}>{l.value}</Text>
                <View style={{ flex: 1 }}></View>
                <Menu>
                  <MenuTrigger
                    text="edit"
                    customStyles={{ triggerText: styles.text }}
                  />
                  <MenuOptions customStyles={{ optionText: styles.text }}>
                    <MenuOption
                      onSelect={() => toggleHighlight(l.id)}
                      text={l.highlighted ? "Unhighlight" : "Highlight"}
                    />
                    <MenuOption
                      onSelect={() => deleteLogItem(l.id)}
                      text="Delete"
                    />
                  </MenuOptions>
                </Menu>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </MenuProvider>
  );
};
export default AdvancedExample;
