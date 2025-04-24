export const randomFutureDate = () => {
  const daysAgo = Math.floor(Math.random() * 30);
  return new Date(Date.now() + daysAgo * 24 * 60 * 60 * 1000);
};