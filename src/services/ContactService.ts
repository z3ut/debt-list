import { AsyncStorage } from 'react-native';
import Contact from './Contact';
import BalanceChange from './BalanceChange';

class ContactService {
  private contactsKey = 'contacts';
  private initialAmountComment = 'Initial amount';

  getContacts(): Promise<Contact[]> {
    return AsyncStorage.getItem(this.contactsKey)
      .then(result => result || '[]')
      .then(contactsJSON => JSON.parse(contactsJSON) as Contact[])
      .then(contacts => this.mapContacts(contacts));
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

      const balanceChanges = balance !== 0 ?
        [this.createBalanceChange(0, balance, this.initialAmountComment)] :
        [];

      const newContact: Contact = {
        name,
        balance,
        balanceChanges,
      };

      contacts.push(newContact);

      return this._saveContacts(contacts)
        .then(() => newContact);
    });
  }

  changeBalance(name: string, amount: number, comment: string = ''): Promise<Contact> {
    return this.getContacts().then(contacts => {
      const contact = this._findContact(contacts, name);

      if (!contact) {
        throw(`Contact ${name} not found`);
      }

      contact.balanceChanges.push(
        this.createBalanceChange(contact.balance, amount, comment));
      contact.balance += amount;

      return this._saveContacts(contacts)
        .then(() => contact);
    });
  }

  deleteContact(name: string): Promise<void> {
    return this.getContacts().then(contacts => {
      const contactsAfterDelete = contacts.filter(c => c.name !== name);
      return this._saveContacts(contactsAfterDelete);
    });
  }

  getTotalBalance(): Promise<number> {
    return this.getContacts().then(contacts =>
      contacts.reduce((acc, cur) => acc + cur.balance, 0));
  }

  private mapContacts(contacts: Contact[]): Contact[] {
    return contacts.map(contact => {
      if (Array.isArray(contact.balanceChanges)) {
        contact.balanceChanges.forEach(balanceChange => {
          balanceChange.date = new Date(balanceChange.date);
        });
      } else {
        contact.balanceChanges = [];
      }
      return contact;
    });
  }

  private _saveContacts(contacts: Contact[]): Promise<void> {
    return AsyncStorage.setItem(this.contactsKey, JSON.stringify(contacts));
  }

  private _findContact(contacts: Contact[], name: string): Contact | null {
    return contacts.find(c => c.name === name) || null;
  }

  private createBalanceChange(balance: number, amount: number,
      comment: string = ''): BalanceChange {
    return {
      amount,
      date: new Date(),
      comment,
      balanceBefore: balance,
      balanceAfter: balance + amount,
    };
  }
}

const contactService = new ContactService();

export default contactService;
