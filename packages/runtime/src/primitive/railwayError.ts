export default class RailwayError extends Error {
  logicPermanentIdentity: string;

  logicRevision: number;

  constructor(
    name: string,
    message: string,
    logicPermanentIdentity: string,
    logicRevision: number
  ) {
    super(message);
    this.name = name;
    this.logicPermanentIdentity = logicPermanentIdentity;
    this.logicRevision = logicRevision;
  }
}
