/**
 * @name getUserAgent
 * @param {string} request
 * @param {string} expiresIn
 * @return {object} user agent and device platform
 */
const getUserAgent = (request) => {
  const mobileDeviceIndicator = ['mobile', 'android', 'iphone', 'tablet', 'ipad', 'ipod'];
  const userAgent = request.headers['user-agent'];
  const devicePlatform = mobileDeviceIndicator.some((device) => userAgent.toLowerCase().includes(device))
    ? 'mobile'
    : 'browser';
  return { devicePlatform, userAgent };
};

export default getUserAgent;
