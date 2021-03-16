import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    if (this.transactions.length <= 0) {
      throw Error('There is no transaction registered.');
    }

    const balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    this.transactions.map(transaction => {
      if (transaction.type === 'income') {
        balance.income += transaction.value;
      } else {
        balance.outcome += transaction.value;
      }

      balance.total = balance.income - balance.outcome;
      return balance.total;
    });

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    if (this.transactions.length > 0) {
      const balance = this.getBalance();
      const result = balance.total - value;

      if (type === 'outcome' && result < 0) {
        throw Error(
          'You cannot create a outcome transaction without a valid balance.',
        );
      }
    }

    const transaction = new Transaction({
      title,
      value,
      type,
    });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
