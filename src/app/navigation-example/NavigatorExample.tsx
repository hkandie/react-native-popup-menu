import React from 'react';
import { Text, View } from 'react-native';
import Menu, { MenuProvider, MenuOptions, MenuOption, MenuTrigger } from '../../molecules';

const Page = () => (
    <View style={{ flexDirection: 'column', padding: 70 }}>
        
        <Text>Hello world with react-native-router-flux!</Text>
        
        <Menu>
            
            <MenuTrigger text='Select option' />
            
            <MenuOptions>
                
                <MenuOption
                    onSelect={() => Actions.login()}
                    text='Login'
                />
                
                <MenuOption
                    onSelect={() => Actions.register()}
                    text='Register'
                />
                
                <MenuOption
                    onSelect={() => Actions.home()}
                    text='Home'
                />
            </MenuOptions>
        </Menu>
    </View>
);

const NavigatorMenu = () => (
    
    <Menu>
        
        <MenuTrigger text='...' />
        
        <MenuOptions>
            
            <MenuOption
                onSelect={() => Actions.login()}
                text='Navigation Login'
            />
            
            <MenuOption
                onSelect={() => Actions.register()}
                text='Navigation Register'
            />
            
            <MenuOption
                onSelect={() => Actions.home()}
                text='Navigation Home'
            />
        </MenuOptions>
    </Menu>
);

const NavigatorExample = () => {
    return (
        <MenuProvider>
            <Router>
                <Scene key='root'>
                    <Scene
                        key='login'
                        component={Page}
                        title='Login'
                        renderRightButton={NavigatorMenu}
                    />
                    <Scene
                        key='register'
                        component={Page}
                        title='Register'
                    />
                    <Scene
                        key='home'
                        component={Page}
                    />
                </Scene>
            </Router>
        </MenuProvider>
    );
};

export default NavigatorExample;
