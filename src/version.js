/**
 * 当前版本信息
 */
const Version = 'v0.2';
const BetaNumber = '.13';
const info = `Version：${Version}${BetaNumber ? `-beta${BetaNumber}` : ''}`;
window.CurrentVersions = info;

if (window.location.protocol === 'http:') {
  console.info(info);
}

if (process.env.NODE_ENV === 'production') {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    debug: () => {},
    error: () => {},
  };
}
