import {
  GenericLogic,
  Logic,
  RailwayError,
  SessionStorageAgent,
} from "@fstnetwork/logic";

@Logic()
export class GenericA extends GenericLogic {
  async run() {
    let i = 0;
    await SessionStorageAgent.putJson("fstnetwork", i as number);

    while (true) {
      i++;
    }
  }

  async handleError(_error: RailwayError) {}
}
