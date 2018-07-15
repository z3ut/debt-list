import React from 'react';
import { StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, Alert } from 'react-native';
import { createContact } from '../services/ContactService';
import FilterDigitsAndSeparators from '../utils/FilterOnlyDigits';
import ConvertStringToNumber from '../utils/ConvertStringToNumber';

export default class ContactScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('name', 'New contact'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      balance: ''
    };
  }

  createContact() {
    const balance = ConvertStringToNumber(this.state.balance);
    createContact(this.state.name, balance).then(newContact => {
      this.props.navigation.goBack();
    }, err => {
      Alert.alert('Creating error', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.inputTitle}>Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ name: text })}
          value={this.state.name}
        />

        <View style={styles.emptySpace}></View>

        <Text style={styles.inputTitle}>Balance:</Text>
        <TextInput
          keyboardType = 'numeric'
          style={styles.input}
          onChangeText={(text) => this.setState({ balance: FilterDigitsAndSeparators(text) })}
          value={this.state.balance}
        />

        <View style={styles.emptySpace}></View>

        <View style={{ width: '100%' }}>
          <TouchableWithoutFeedback
            onPress={() => this.createContact() }>
          <View>
            <Text style={styles.createContact}>Create</Text>
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
  inputTitle: {
    fontSize: 18,
  },
  input: {
    height: 40,
    fontSize: 24,
    textAlign: 'center',
    width: '100%',
  },
  createContact: {
    padding: 10,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#7caeff'
  },
  emptySpace: {
    height: 40,
  },
});
