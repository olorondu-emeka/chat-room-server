/**
 * @name get24hrTime
 * @param {number} inputHour the current hour
 * @param {number} inputMinute the current minute
 * @returns {String} time string in 24hr mode
 */
const get24hrTime = (inputHour, inputMinute) => {
  let hour = inputHour;
  let minute = inputMinute;

  if (hour < 9) hour = `0${hour}`;
  if (minute < 9) minute = `0${minute}`;
  const finalTime = `${hour}:${minute}`;
  return finalTime;
};

export default get24hrTime;
