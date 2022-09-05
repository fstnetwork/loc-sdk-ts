import {
  EventAgent,
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
} from "@fstnetwork/logic";

@Logic()
export class TestEvent extends GenericLogic {
  async run() {
    LoggingAgent.info("test TestEvent");

    await EventAgent.emit([
      {
        labelName: "labelName",
        sourceDigitalIdentity: "sourceDigitalIdentity",
        targetDigitalIdentity: "targetDigitalIdentity",
        meta: "meta 0000",
        type: "default",
      },
    ]);

    await EventAgent.emit([
      {
        labelName: "labelName",
        sourceDID: "sourceDID",
        targetDID: "targetDID",
        meta: "meta 0001",
        type: "default",
      },
      {
        labelName: "labelName",
        sourceDigitalIdentity: "sourceDigitalIdentity",
        targetDID: "targetDID",
        meta: "meta 0002",
        type: "default",
      },
      {
        labelName: "labelName",
        sourceDID: "sourceDID",
        targetDigitalIdentity: "targetDigitalIdentity",
        meta: "meta 0003",
        type: "default",
      },
      {
        labelName: "labelName",
        sourceDID: "sourceDID",
        sourceDigitalIdentity: "sourceDigitalIdentity",
        targetDID: "targetDID",
        targetDigitalIdentity: "targetDigitalIdentity",
        meta: "meta 0004",
        type: "default",
      },
    ]);

    {
      const searchReq = {
        queries: [
          {
            type: "match" as const,
            field: "source_digital_identity",
            value: "b184ad67-448b-47ae-84aa-9cd97705e5b7",
          },
        ],
        excludes: [],
        filters: [],
        from: 0,
        size: 0,
        sorts: [],
      };
      await EventAgent.search(searchReq);
    }

    {
      const patternReq = {
        sequences: [
          {
            conditions: [
              {
                field: "source_digital_identity",
                op: "eq" as const,
                value: "b184ad67-448b-47ae-84aa-9cd97705e5b7",
              },
              {
                field: "label_id",
                op: "ne" as const,
                value: "label_3",
              },
            ],
            sharedFields: [],
            type: "",
          },
          {
            conditions: [
              {
                field: "source_digital_identity",
                op: "eq" as const,
                value: "c700f07f-920f-4be8-aa52-c8c42e1578de",
              },
            ],
            sharedFields: [],
            type: "",
          },
        ],
        filter: {
          type: "range" as const,
          field: "timestamp",
          lte: 1625122259000,
          gte: 1625124173000,
        },
      };
      await EventAgent.searchWithPattern(patternReq);
    }
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
