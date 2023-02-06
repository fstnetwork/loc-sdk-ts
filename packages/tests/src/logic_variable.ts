import {
  GenericLogic,
  Logic,
  LogicVariable,
  LoggingAgent,
  RailwayError,
} from '@fstnetwork/logic';

@Logic()
export default class TestLogicVariable extends GenericLogic {
  async run() {
    const homeless = LogicVariable.get('homeless');
    const doge = LogicVariable.get('shibainu');

    LoggingAgent.info({
      homeless: homeless === null,
    });

    LoggingAgent.info({
      shibainu: doge,
    });
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
