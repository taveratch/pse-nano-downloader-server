import log4js from 'log4js';

export default () => {
  log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/output.log', category: 'output' }
  ]
});
};
