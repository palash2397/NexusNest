export const getExpirationTime = (): Date => {
  return new Date(Date.now() + 5 * 60 * 1000);
};

export const generateOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};