import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, Alert } from 'react-native';
import contactService from '../services/ContactService';
import FilterDigitsAndSeparators from '../utils/FilterOnlyDigits';
import ConvertStringToNumber from '../utils/ConvertStringToNumber';
import { NavigationScreenProp } from 'react-navigation';

export interface Props {
  navigation: NavigationScreenProp<any, any>;
}

interface State {
  name: string;
  balance: string;
  operationAmount: string;
}

export default class ContactScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: any }) => {
    return {
      title: navigation.getParam('name', 'Contact'),
    };
  };

  private amountTextInput: TextInput;

  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      balance: '',
      operationAmount: '',
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
        balance: contact.balance.toString()
      });
    }, err => Alert.alert('Error', `Error while loading contact ${name}`));
  }

  borrow() {
    const amountAbs = ConvertStringToNumber(this.state.operationAmount);

    if (!amountAbs) {
      this.focusAmountInput();
      return;
    }

    this.changeContactBalance(-amountAbs);
  }

  lend() {
    const amountAbs = ConvertStringToNumber(this.state.operationAmount);

    if (!amountAbs) {
      this.focusAmountInput();
      return;
    }

    this.changeContactBalance(amountAbs);
  }

  changeContactBalance(amount: number) {
    contactService.changeBalance(this.state.name, amount).then(contact => {
      this.setState({
        balance: contact.balance.toString(),
        operationAmount: '',
      });
    });
  }

  focusAmountInput() {
    this.amountTextInput.focus();
  }

  openDeleteModal() {
    Alert.alert('Delete', `Are you sure you want to delete ${this.state.name}?`, [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      { text: 'Yes', onPress: () => this.deleteContact(), style: 'default' }
    ], { cancelable: true });
  }

  deleteContact() {
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

        <Text style={styles.inputTitle}>Operation amount:</Text>
        <TextInput
          ref={(input: TextInput) => { this.amountTextInput = input }}
          keyboardType = 'numeric'
          style={styles.input}
          onChangeText={(text) => this.setState({ operationAmount: FilterDigitsAndSeparators(text) })}
          value={this.state.operationAmount}
        />

        <View style={styles.emptySpace}></View>

        <View style={styles.buttonContainer}>
          <View style={{ flex: 1, marginRight: 5, }}>
            <TouchableWithoutFeedback
                onPress={() => this.borrow() }>
              <View>
                <Text style={styles.button}>- Borrow</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ flex: 1, marginLeft: 5, }}>
            <TouchableWithoutFeedback
                onPress={() => this.lend() }>
              <View>
                <Text style={styles.button}>Lend +</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
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
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
  statusText: {
    fontSize: 24,
  },
  emptySpace: {
    height: 40,
  },
  inputTitle: {
    fontSize: 18,
  },
  input: {
    height: 40,
    fontSize: 24,
    width: '100%',
    textAlign: 'center',
  },
});
