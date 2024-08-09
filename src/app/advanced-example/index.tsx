import React, { Component } from 'react';

import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Menu, { MenuProvider, MenuTrigger, MenuOptions, MenuOption, renderers } from '../../molecules';

let unique = 0;
const { SlideInMenu } = renderers;

const Example = () => {
  const [logs, setLogs] = React.useState<
    {
      value: string;
      id: number;
      highlighted?: boolean;
    }[]
  >([]);

  function selectNumber(value: string) {
    addLog(`selecting number: ${value}`);
  }

  function selectOptionType(value: string) {
    const v = typeof value === 'object' ? JSON.stringify(value) : value;
    addLog(`selecting type: ${v}`);
    return value !== 'Do not close';
  }

  function addLog(value: string) {
    setLogs([
      ...logs,
      {
        value,
        id: ++unique
      }
    ]);
  }

  function toggleHighlight(id: any) {
    const log = logs.map((l: any) => {
      if (l.id === id) {
        return Object.assign({}, l, { highlighted: !l.highlighted });
      }
      return l;
    });
    setLogs(log);
  }

  function deleteLogItem(id: any) {
    const log = logs.filter((l: any) => l.id !== id);
    setLogs(log);
  }

  return (
    <MenuProvider style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.topbar}>
          <Menu
            name='numbers'
            renderer={SlideInMenu}
            onSelect={(value: string) => selectNumber(value)}
          >
            <MenuTrigger style={styles.trigger}>
              <Text style={[styles.text, styles.triggerText]}>Slide-in menu...</Text>
            </MenuTrigger>

            <MenuOptions customStyles={{ optionText: [styles.text, styles.slideInOption] }}>
              <MenuOption
                value={1}
                text='Option one'
              />

              <MenuOption
                value={2}
                text='Option two'
              />

              <MenuOption
                value={3}
                text='Option three'
              />

              <MenuOption
                value={4}
                text='Option four'
              />
              {null /* conditional not rendered option */}

              <MenuOption
                value={5}
                text='Option five'
              />
            </MenuOptions>
          </Menu>

          <View style={{ flex: 1 }}></View>

          <Menu
            name='types'
            onSelect={(value: any) => selectOptionType(value)}
            onBackdropPress={() => addLog('menu will be closed by backdrop')}
            onOpen={() => addLog('menu is opening')}
            onClose={() => addLog('menu is closing')}
          >
            <MenuTrigger
              onAlternativeAction={() => addLog('trigger longpressed')}
              style={styles.trigger}
            >
              <Text style={[styles.text, styles.triggerText]}>Context menu...</Text>
            </MenuTrigger>

            <MenuOptions customStyles={{ optionText: styles.text }}>
              <MenuOption
                value='Normal'
                text='Normal'
              />

              <MenuOption
                value='N/A'
                disabled={true}
                text='Disabled'
              />

              <MenuOption
                value='N/A'
                disableTouchable={true}
                text='Non-selectable'
              />

              <MenuOption
                value='Do not close'
                text='Do not close'
              />

              <View style={styles.divider} />

              <MenuOption
                value={{ text: 'Hello world!' }}
                text='Object as value'
              />
            </MenuOptions>
          </Menu>
        </View>

        <ScrollView style={styles.logView}>
          {logs.map((l: any, i: any) => {
            const wrapperStyle = { backgroundColor: i % 2 ? 'white' : 'whitesmoke' };
            const textStyle = { color: l.highlighted ? 'red' : 'gray' };
            return (
              <View
                style={[styles.logItem, wrapperStyle]}
                key={l.id}
              >
                <Text style={[styles.text, textStyle]}>{l.value}</Text>

                <View style={{ flex: 1 }}></View>

                <Menu>
                  <MenuTrigger
                    text='edit'
                    customStyles={{ triggerText: styles.text }}
                  />

                  <MenuOptions customStyles={{ optionText: styles.text }}>
                    <MenuOption
                      onSelect={() => toggleHighlight(l.id)}
                      text={l.highlighted ? 'Unhighlight' : 'Highlight'}
                    />

                    <MenuOption
                      onSelect={() => deleteLogItem(l.id)}
                      text='Delete'
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

export default Example;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'lightgray'
  },
  topbar: {
    flexDirection: 'row',
    backgroundColor: 'dimgray',
    paddingTop: 15
  },
  trigger: {
    padding: 5,
    margin: 5
  },
  triggerText: {
    color: 'white'
  },
  disabled: {
    color: '#ccc'
  },
  divider: {
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  logView: {
    flex: 1,
    flexDirection: 'column'
  },
  logItem: {
    flexDirection: 'row',
    padding: 8
  },
  slideInOption: {
    padding: 5
  },
  text: {
    fontSize: 18
  }
});
