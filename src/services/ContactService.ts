import { AsyncStorage } from 'react-native';
import Contact from './Contact';

class ContactService {
  private contactsKey = 'contacts';

  getContacts(): Promise<Contact[]> {
    return AsyncStorage.getItem(this.contactsKey)
      .then(result => result || '[]')
      .then(contactsJSON => JSON.parse(contactsJSON));
  }

  getContact(name: string): Promise<Contact> {
    return this.getContacts()
      .then(contacts => {
        const contact = this._findContact(contacts, name);

        if (!contact) {
          throw(`Contact ${name} not found`);
        }

        return contact;
      });
  }

  createContact(name: string, balance = 0): Promise<Contact> {
    return this.getContacts().then(contacts => {
      if (this._findContact(contacts, name)) {
        throw(`Contact with name '${name}' already exists`);
      }

      const newContact = { name, balance };
      contacts.push(newContact);
      this._saveContacts(contacts);
      return newContact;
    });
  }

  saveContact(name: string, balance: number): Promise<Contact> {
    return this._updateContact(name, c => c.balance = balance);
  }

  changeBalance(name: string, amount: number): Promise<Contact> {
    return this._updateContact(name, c => c.balance += amount);
  }

  deleteContact(name: string): Promise<void> {
    return this.getContacts().then(contacts => {
      const contactsAfterDelete = contacts.filter(c => c.name !== name);
      return this._saveContacts(contactsAfterDelete);
    });
  }

  private _saveContacts(contacts: Contact[]): Promise<void> {
    return AsyncStorage.setItem(this.contactsKey, JSON.stringify(contacts));
  }

  private _findContact(contacts: Contact[], name: string): Contact | null {
    return contacts.find(c => c.name === name) || null;
  }

  private _updateContact(name: string, operation: (c: Contact) => void): Promise<Contact> {
    if (typeof operation != 'function') {
      throw('Operation function was not provided');
    }

    return this.getContacts().then(contacts => {
      const contact = this._findContact(contacts, name);

      if (!contact) {
        throw(`Contact ${name} not found`);
      }

      operation(contact);

      this._saveContacts(contacts);
      return contact;
    });
  }
}

const contactService = new ContactService();

export default contactService;
