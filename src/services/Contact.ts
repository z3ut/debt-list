import BalanceChange from './BalanceChange';

export default interface Contact {
  name: string;
  balance: number;
  balanceChanges: BalanceChange[];
}
