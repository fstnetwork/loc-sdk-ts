import { GenericLogic, Logic, RailwayError } from '@fstnetwork/logic';

@Logic()
export default class EmptyGenericLogic extends GenericLogic {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async run() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async handleError(_error: RailwayError) {}
}
