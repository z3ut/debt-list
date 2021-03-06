import React from 'react'
import { createStackNavigator } from 'react-navigation';
import ContactListScreen from './src/screens/ContactListScreen';
import ContactScreen from './src/screens/ContactScreen';
import NewContactScreen from './src/screens/NewContactScreen';
import ContactOperationScreen from './src/screens/ContactOperationScreen';
import ContactHistoryScreen from './src/screens/ContactHistoryScreen';

const RootStack = createStackNavigator(
  {
    ContactList: ContactListScreen,
    Contact: ContactScreen,
    NewContact: NewContactScreen,
    ContactOperation: ContactOperationScreen,
    ContactHistory: ContactHistoryScreen,
  }, {
    initialRouteName: 'ContactList',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#7caeff',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />
  }
}
