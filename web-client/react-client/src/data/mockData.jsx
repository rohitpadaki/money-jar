// Mock data for the application
export const mockUsers = [
  { id: 1, name: 'Alex Johnson', email: 'alex@example.com', avatar: 'AJ' },
  { id: 2, name: 'Sarah Chen', email: 'sarah@example.com', avatar: 'SC' },
  { id: 3, name: 'Mike Rodriguez', email: 'mike@example.com', avatar: 'MR' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', avatar: 'ED' },
  { id: 5, name: 'Chris Wilson', email: 'chris@example.com', avatar: 'CW' },
  { id: 6, name: 'Jessica Taylor', email: 'jessica@example.com', avatar: 'JT' },
];

export const mockHives = [
  {
    id: 1,
    name: 'House Roommates',
    members: [1, 2, 3],
    createdAt: '2024-01-15',
    totalBalance: 245.50,
    expenses: [
      {
        id: 1,
        title: 'Groceries',
        amount: 89.50,
        paidBy: 1,
        splitBetween: [1, 2, 3],
        date: '2024-01-20',
        category: 'Food'
      },
      {
        id: 2,
        title: 'Internet Bill',
        amount: 75.00,
        paidBy: 2,
        splitBetween: [1, 2, 3],
        date: '2024-01-18',
        category: 'Utilities'
      },
      {
        id: 3,
        title: 'Dinner Out',
        amount: 156.00,
        paidBy: 3,
        splitBetween: [1, 2, 3],
        date: '2024-01-16',
        category: 'Food'
      }
    ]
  },
  {
    id: 2,
    name: 'Weekend Trip',
    members: [1, 4, 5],
    createdAt: '2024-01-10',
    totalBalance: 380.75,
    expenses: [
      {
        id: 4,
        title: 'Hotel Booking',
        amount: 240.00,
        paidBy: 1,
        splitBetween: [1, 4, 5],
        date: '2024-01-12',
        category: 'Accommodation'
      },
      {
        id: 5,
        title: 'Gas for Road Trip',
        amount: 85.50,
        paidBy: 4,
        splitBetween: [1, 4, 5],
        date: '2024-01-11',
        category: 'Transportation'
      }
    ]
  }
];

export const currentUser = {
  id: 1,
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'AJ'
};

export const recentTransactions = [
  {
    id: 1,
    type: 'expense',
    description: 'Groceries - House Roommates',
    amount: -29.83,
    date: '2024-01-20'
  },
  {
    id: 2,
    type: 'payment',
    description: 'Payment received from Sarah',
    amount: 25.00,
    date: '2024-01-19'
  },
  {
    id: 3,
    type: 'expense',
    description: 'Hotel - Weekend Trip',
    amount: -80.00,
    date: '2024-01-12'
  }
];