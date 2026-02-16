import { UAParser } from "ua-parser-js";  

export const getDeviceInfo = () => {
  const parser = new UAParser(); 
  const result = parser.getResult();

  return {
    device_type: result.device.type || "desktop",
    vendor: result.device.vendor || "PC/Desktop",
    model: result.device.model || "Unknown",
    os: result.os.name || "Unknown",
    osVersion: result.os.version || "Unknown",
    browser: result.browser.name || "Unknown",
    browserVersion: result.browser.version || "Unknown",
  };
};
