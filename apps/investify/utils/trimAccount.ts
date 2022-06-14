const trimAccount = (account: string, long = false): string => {
  if (long) return account.slice(0, 5) + '...' + account.slice(36);
  return account.slice(0, 2) + '...' + account.slice(39);
};

export default trimAccount;
