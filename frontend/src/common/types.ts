export interface TransactionRef {
  _id: string;
}

export interface User {
  amount: number;
  firstName: string;
  lastName: string;
  username: string;
  transactions: TransactionRef[];
}
