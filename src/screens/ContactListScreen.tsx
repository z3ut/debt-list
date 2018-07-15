import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import contactService from '../services/ContactService';
import ContactList from '../components/ContactList';
import Contact from '../services/Contact';
import { NavigationScreenProp } from 'react-navigation';

export interface Props {
  navigation: NavigationScreenProp<any, any>;
}

interface State {
  contacts: Contact[];
}

export default class ContactListScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: 'Contacts',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      contacts: []
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
    contactService.getContacts().then(contacts => {
      this.setState({ contacts: contacts.slice() });
    });
  }

  selectContact(contact: Contact) {
    this.props.navigation.navigate('Contact', { name: contact.name })
  }

  createNewContact() {
    this.props.navigation.navigate('NewContact');
  }

  render() {
    return (
      <View style={styles.container}>
        <ContactList
          contacts={this.state.contacts}
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
