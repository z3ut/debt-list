import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, Alert } from 'react-native';
import contactService from '../services/ContactService';
import FilterDigitsAndSeparators from '../utils/FilterOnlyDigits';
import ConvertStringToNumber from '../utils/ConvertStringToNumber';
import { NavigationScreenProp } from 'react-navigation';
import { KeyboardAvoidingView } from 'react-native';

export interface Props {
  navigation: NavigationScreenProp<any, any>;
}

interface State {
  name: string;
  balance: string;
  operationAmount: string;
  comment: string;
}

export default class ContactOperationScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: any }) => ({
    title: navigation.getParam('name', 'Contact'),
  });

  private amountTextInput: TextInput;

  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      balance: '',
      operationAmount: '',
      comment: '',
    };
  }

  componentDidMount() {
    this.updateContact();

    const didBlurSubscription = this.props.navigation
      .addListener('didFocus', () => this.updateContact());
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

  borrow() {
    const amountAbs = ConvertStringToNumber(this.state.operationAmount);

    if (!amountAbs) {
      this.focusAmountInput();
      return;
    }

    this.changeContactBalance(-amountAbs, this.state.comment);
  }

  lend() {
    const amountAbs = ConvertStringToNumber(this.state.operationAmount);

    if (!amountAbs) {
      this.focusAmountInput();
      return;
    }

    this.changeContactBalance(amountAbs, this.state.comment);
  }

  changeContactBalance(amount: number, comment: string) {
    contactService.changeBalance(this.state.name, amount, comment)
      .then(() => this.props.navigation.goBack(),
        () => Alert.alert('Error', `Error while updating contact ${name}`));
  }

  focusAmountInput() {
    this.amountTextInput.focus();
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
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

        <Text style={styles.inputTitle}>Comment:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(comment) => this.setState({ comment })}
          value={this.state.comment}
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
      </KeyboardAvoidingView>
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
