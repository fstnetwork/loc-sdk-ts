import RailwayError from './railwayError';

export default class Railway {
  static async isOk(): Promise<boolean> {
    return Deno.core.opAsync('op_railway_is_ok');
  }

  static async switch(err: any): Promise<void> {
    if (err instanceof Error) {
      const { name, message } = err;
      await Deno.core.opAsync('op_railway_switch', { name, message });
    } else if (typeof err === 'string') {
      await Deno.core.opAsync('op_railway_switch', {
        name: 'CustomError',
        message: err,
      });
    } else {
      await Deno.core.opAsync('op_railway_switch', {
        name: 'CustomError',
        message: `${err}`,
      });
    }
  }

  static async getError(): Promise<RailwayError> {
    const { name, message, logicPermanentIdentity, logicRevision } =
      await Deno.core.opAsync('op_railway_get_error');
    return new RailwayError(
      name,
      message,
      logicPermanentIdentity,
      logicRevision
    );
  }
}
