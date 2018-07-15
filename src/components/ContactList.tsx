import React from 'react';
import { StyleSheet, Text, FlatList, View, TouchableWithoutFeedback } from 'react-native';
import Contact from '../services/Contact';

export interface Props {
  contacts: Contact[];
  onContactSelected: (contact: Contact) => void;
}

export default class ContactList extends React.Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <FlatList data={this.props.contacts}
          keyExtractor={(item) => item.name}
          renderItem={({item}) => (
            <TouchableWithoutFeedback
                onPress={() => this.props.onContactSelected(item)}>
              <View>
                <View style={styles.list}>
                  <Text style={styles.listIitem}>{item.name}</Text>
                  <Text style={[styles.listIitem, { textAlign: 'right' }]}>{item.balance}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        >
        </FlatList>
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
  list: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  listIitem: {
    padding: 15,
    fontSize: 20,
    flex: 1,
    borderBottomColor: 'grey',
    borderBottomWidth: .5,
  },
});
