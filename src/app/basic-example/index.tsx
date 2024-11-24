import MenuTrigger from "@/src/molecules/MenuTrigger";
import Menu from "../../molecules/Menu";
import MenuProvider from "../../molecules/MenuProvider";
import React from "react";
import { Text } from "react-native";
import MenuOptions from "@/src/molecules/MenuOptions";
import MenuOption from "@/src/molecules/MenuOption";

const BasicExample = () => {
    return (
        <MenuProvider style={{ flexDirection: 'column', padding: 30 }}>
            <Text>Hello world!</Text>
            <Menu onSelect={(value: any) => alert(`Selected number: ${value}`)}>
                <MenuTrigger text='Select option' />
                <MenuOptions>
                    <MenuOption
                        value={1}
                        text='One'
                    />
                    <MenuOption value={2}>
                        <Text style={{ color: 'red' }}>Two</Text>
                    </MenuOption>
                    <MenuOption
                        value={3}
                        disabled={true}
                        text='Three'
                    />
                </MenuOptions>
            </Menu>
        </MenuProvider>
    );
};
export default BasicExample;
