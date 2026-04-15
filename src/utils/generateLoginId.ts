let counter = 1016;

export const generateLoginId = (): string => {
  return `CUST${counter++}`;
};

export const generatePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pass = 'PASS';
  for (let i = 0; i < 4; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
};
