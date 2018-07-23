import React from 'react';
import { StyleSheet, Text, View, Alert, FlatList } from 'react-native';
import contactService from '../services/ContactService';
import { NavigationScreenProp } from 'react-navigation';
import BalanceChange from '../services/BalanceChange';

export interface Props {
  navigation: NavigationScreenProp<any, any>;
}

interface State {
  name: string;
  balance: string;
  balanceChanges: BalanceChange[];
}

export default class ContactHistoryScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: any }) => ({
    title: navigation.getParam('name', 'Contact'),
  });

  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      balance: '',
      balanceChanges: [],
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
        balanceChanges: contact.balanceChanges.sort((b1, b2) => b2.date.getTime() - b1.date.getTime()),
      });
    }, () => Alert.alert('Error', `Error while loading contact ${name}`));
  }

  private convertNumberToSignedString(value: number) {
    return `${ value > 0 ? '+' : '' }${value.toString()}`;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>Contact: {this.state.name}</Text>
        <Text style={styles.statusText}>Balance: {this.state.balance}</Text>

        <View style={styles.emptySpace}></View>

        <FlatList data={this.state.balanceChanges}
          keyExtractor={(balanceChange, i) => i.toString()}
          renderItem={({item}) => (
            <View style={styles.listIitem}>
              <View style={styles.list}>
                <Text style={styles.balanceHeader}>
                  {item.date.toLocaleDateString()}
                </Text>
                <Text style={[styles.balanceHeader, { paddingLeft: 10, textAlign: 'center' }]}>
                  {this.convertNumberToSignedString(item.amount)}
                </Text>
                <Text style={[styles.balanceHeader, { textAlign: 'right' }]}>
                  {item.balanceBefore} &#8594; {item.balanceAfter}
                </Text>
              </View>
              <Text style={styles.balanceComment}>{item.comment}</Text>
            </View>
          )}
        >
        </FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  statusText: {
    fontSize: 24,
    textAlign: 'center',
  },
  emptySpace: {
    height: 40,
  },
  list: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  listIitem: {
    width: '100%',
    padding: 15,
    borderBottomColor: 'grey',
    borderBottomWidth: .5,
  },
  balanceHeader: {
    fontSize: 20,
    flex: 1,
  },
  balanceComment: {
    fontSize: 15,
  },
});
