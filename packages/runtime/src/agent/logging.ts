// eslint-disable-next-line import/prefer-default-export
export const LoggingAgent = {
  trace(value: string | object) {
    this.log('Trace', value);
  },

  debug(value: string | object) {
    this.log('Debug', value);
  },

  info(value: string | object) {
    this.log('Info', value);
  },

  warn(value: string | object) {
    this.log('Warn', value);
  },

  error(value: string | object) {
    this.log('Error', value);
  },

  log(level: string, value: string | object) {
    let message;

    if (typeof value === 'string') {
      message = { Plaintext: value };
    } else {
      message = { Json: value };
    }

    const record = { level, message };
    Deno.core.opSync('op_log', record);
  },
};
