export default interface BalanceChange {
  amount: number;
  date: Date;
  comment: string;
  balanceBefore: number;
  balanceAfter: number;
}
