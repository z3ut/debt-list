import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Alert } from 'react-native';
import contactService from '../services/ContactService';
import { NavigationScreenProp } from 'react-navigation';

export interface Props {
  navigation: NavigationScreenProp<any, any>;
}

interface State {
  name: string;
  balance: string;
}

export default class ContactScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: any }) => ({
    title: navigation.getParam('name', 'Contact'),
  });

  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      balance: '',
    };
  }

  componentDidMount() {
    this.updateContact();

    const didBlurSubscription = this.props.navigation
      .addListener('didFocus', payload => this.updateContact());
  }

  updateContact() {
    const name = this.props.navigation.getParam('name', 'Contact');
    contactService.getContact(name).then(contact => {
      this.setState({
        name: contact.name,
        balance: contact.balance.toString(),
      });
    }, () => Alert.alert('Error', `Error while loading contact ${name}`));
  }

  updateContactBalance() {
    this.props.navigation.navigate('ContactOperation', { name: this.state.name });
  }

  navigateToBalanceHistory() {
    this.props.navigation.navigate('ContactHistory', { name: this.state.name });
  }

  openDeleteModal() {
    Alert.alert('Delete', `Are you sure you want to delete ${this.state.name}?`, [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      { text: 'Yes', onPress: () => this.deleteContact(), style: 'default' }
    ], { cancelable: true });
  }

  private deleteContact() {
    contactService.deleteContact(this.state.name).then(() => {
      this.props.navigation.goBack();
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>Contact: {this.state.name}</Text>
        <Text style={styles.statusText}>Balance: {this.state.balance}</Text>

        <View style={styles.emptySpace}></View>

        <View style={{ width: '100%' }}>
          <TouchableWithoutFeedback
              onPress={() => this.updateContactBalance() }>
            <View>
              <Text style={[styles.button, styles.updateButton]}>Update</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.emptySpace}></View>

        <View style={{ width: '100%' }}>
          <TouchableWithoutFeedback
              onPress={() => this.navigateToBalanceHistory() }>
            <View>
              <Text style={styles.button}>History</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.emptySpace}></View>

        <View style={{ width: '100%' }}>
          <TouchableWithoutFeedback
              onPress={() => this.openDeleteModal() }>
            <View>
              <Text style={[styles.button, styles.deleteButton]}>Delete</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#7caeff',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
  },
  updateButton: {

  },
  statusText: {
    fontSize: 24,
  },
  emptySpace: {
    height: 40,
  },
});
