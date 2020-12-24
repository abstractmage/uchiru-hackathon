import UAParser from 'ua-parser-js';
import _ from 'lodash';

export const getBodyClassName = () => {
  const parser = new UAParser();
  const result = parser.getResult();
  const { maxTouchPoints, platform } = navigator;
  const classNames = [];
  let deviceType = 'no-touch';

  if (result.browser.name) classNames.push(`browser_${_.kebabCase(result.browser.name)}`);

  if (result.os.name) classNames.push(`os_${_.kebabCase(result.os.name)}`);

  if (result.device.model) classNames.push(`device_${_.kebabCase(result.device.model)}`);

  if (result.device.type === 'mobile' || result.device.model === 'tablet') {
    deviceType = 'touch';
  } else if (result.ua.match(/ipad|iphone|android|blackberry|phone/i)) {
    deviceType = 'touch';
  } else if (platform === 'MacIntel' && maxTouchPoints > 1) {
    deviceType = 'touch';
  }

  if (deviceType === 'no-touch' && ('ontouchstart' in window || maxTouchPoints > 0)) {
    deviceType = 'mouse-and-touch';
  }

  return [...classNames, deviceType].join(' ');
};
