import { GenericLogic, Logic, Mail, RailwayError } from "@fstnetwork/logic";

@Logic()
export class TestMail extends GenericLogic {
  async run() {
    this.context.agents.logging.info("test TestMailAgent");

    let server;
    try {
      server = await this.context.agents.mail?.acquire("test-smtp-server")!;
    } catch (error) {
      await this.context.agents.sessionStorage.putString(
        "connect_error",
        `Failed to connect SMTP server: ${error}`
      );
      return;
    }

    try {
      await server.send(
        new Mail.Mail()
          .setSender("noreply@fstk.io", "noReply")
          .setReceivers("notfound@fstk.io", "404")
          .setReceivers("babayaga@fstk.io")
          .setCC("john.wick@fstk.io")
          .setSubject("SUBJECT HERE")
          .setBody("BODY HERE")
      );
    } catch (error) {
      await this.context.agents.sessionStorage.putString(
        "send_error",
        `Failed to send mail using SMTP: ${error}`
      );
      return;
    }
  }

  async handleError(error: RailwayError) {
    this.context.agents.logging.error(`${error}`);
  }
}
