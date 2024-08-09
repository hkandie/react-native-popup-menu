import React, { Component } from 'react';

import { FlatList, Alert, StyleSheet } from 'react-native';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from '../../molecules';

const data = new Array(100).fill(0).map((a, i) => ({ key: '' + i, value: 'item' + i }));

const MenuInFlatlist = () => {
  return (
    <MenuProvider style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }: any) => (
          <Menu onSelect={(value: any) => Alert.alert(value)}>
            <MenuTrigger text={'Select option ' + item.value} />

            <MenuOptions>
              <MenuOption
                value='A'
                text='A'
              />

              <MenuOption
                value='B'
                text='B'
              />

              <MenuOption
                value='C'
                text='C'
              />
            </MenuOptions>
          </Menu>
        )}
        style={{ height: 200 }}
      />
    </MenuProvider>
  );
};

export default MenuInFlatlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  }
});
