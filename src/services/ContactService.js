import { AsyncStorage } from 'react-native';

const CONTACTS_KEY = 'contacts';

function getContacts() {
  return AsyncStorage.getItem(CONTACTS_KEY)
    .then(result => result || '[]')
    .then(contactsJSON => JSON.parse(contactsJSON));
}

function getContact(name) {
  return getContacts()
    .then(contacts => _findContact(contacts, name));
}

function createContact(name, balance = 0) {
  return getContacts().then(contacts => {
    if (_findContact(contacts, name)) {
      return Promise.reject(`Contact with name '${name}' already exists`);
    }

    const newContact = { name, balance };
    contacts.push(newContact);
    _saveContacts(contacts);
    return newContact;
  });
}

function saveContact(name, balance) {
  return _updateContact(name, c => c.balance = balance);
}

function changeBalance(name, amount) {
  return _updateContact(name, c => c.balance += amount);
}

function deleteContact(name) {
  return getContacts().then(contacts => {
    const contactsAfterDelete = contacts.filter(c => c.name !== name);
    return _saveContacts(contactsAfterDelete);
  });
}

function _saveContacts(contacts) {
  return AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

function _findContact(contacts, name) {
  return contacts.find(c => c.name === name);
}

function _updateContact(name, operation) {
  if (typeof operation != 'function') {
    throw('Operation function was not provided');
  }

  return getContacts().then(contacts => {
    const contact = _findContact(contacts, name);

    if (!contact) {
      throw(`Contact ${name} not found`);
    }

    operation(contact);

    _saveContacts(contacts);
    return contact;
  });
}

module.exports = {
  getContacts,
  getContact,
  saveContact,
  createContact,
  changeBalance,
  deleteContact
}
