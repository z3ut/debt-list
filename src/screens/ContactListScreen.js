import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { getContacts } from '../services/ContactService';
import ContactList from '../components/ContactList';

export default class ContactListScreen extends React.Component {
  static navigationOptions = {
    title: 'Contacts',
  };

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.updateContacts();

    const didBlurSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.updateContacts();
      }
    );
  }

  updateContacts() {
    getContacts().then(contacts => {
      this.setState({ data: contacts.slice() });
    });
  }

  selectContact(contact) {
    this.props.navigation.navigate('Contact', { name: contact.name })
  }

  createNewContact() {
    this.props.navigation.navigate('NewContact');
  }

  render() {
    return (
      <View style={styles.container}>
        <ContactList
          contacts={this.state.data}
          onContactSelected={contact => this.selectContact(contact)} />
        <TouchableWithoutFeedback
            onPress={() => this.createNewContact() }>
          <View style={styles.newContactContainer}>
            <Text style={styles.newContact}>New Contact</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  newContactContainer: {
    padding: 5,
  },
  newContact: {
    padding: 10,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#7caeff'
  }
});
