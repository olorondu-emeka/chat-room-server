/**
 * @name get24hrTime
 * @returns {String} time string in 24hr mode
 */
const get24hrTime = () => {
  let hour = new Date().getHours();
  let minute = new Date().getMinutes();

  if (hour < 9) hour = `0${hour}`;
  if (minute < 9) minute = `0${minute}`;
  const finalTime = `${hour}:${minute}`;
  return finalTime;
};

export default get24hrTime;
