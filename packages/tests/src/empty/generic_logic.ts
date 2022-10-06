import { GenericLogic, Logic, RailwayError } from '@fstnetwork/logic';

@Logic()
export class EmptyGenericLogic extends GenericLogic {
  async run() {}

  async handleError(_error: RailwayError) {}
}
