import React, {JSXElementConstructor, createContext, useContext} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './src/components/screens/Home';
import LoginScreen from './src/components/screens/LoginScreen';
import RegisterScreen from './src/components/screens/RegisterScreen';
import ChatScreen from './src/components/screens/ChatScreen';
import ChatBoxHeader from './src/components/includes/ChatBoxHeader';

const Stack = createNativeStackNavigator();


function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
          <Stack.Screen name="Home" component={Home} options={{title: 'SpaceX', headerShown: false}} />
          <Stack.Screen name='ChatScreen' component={ChatScreen} options={({ route, navigation }) => ({ header: () => (<ChatBoxHeader navigation={navigation} currentUserDetails={route.params?.currentUserDetails} profilePic={route.params?.profilePic} userName={route.params?.username} />) })} />
      </Stack.Navigator>
    </NavigationContainer>

  )
}



export default App;
