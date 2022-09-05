import {
  GenericLogic,
  Logic,
  RailwayError,
  SessionStorageAgent,
} from "@fstnetwork/logic";

@Logic()
export class GenericB extends GenericLogic {
  async run() {
    const value = (await SessionStorageAgent.get("fstnetwork")) as number;
    await SessionStorageAgent.putJson("kuma", (Number(value) + 6000) as number);
  }

  async handleError(_error: RailwayError) {}
}
