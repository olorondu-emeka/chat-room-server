/**
 * @name expiryDate
 * @param {string} platform - platform that apps is accessed from
 * @returns {date} date object
 */
const expiryDate = (platform) => {
  const todaysDate = new Date(Date.now());
  const expirationDate = new Date();
  const timeExtension = platform === 'browser' ? 8 : 24;
  expirationDate.setHours(todaysDate.getHours() + timeExtension);
  return expirationDate;
};

export default expiryDate;
