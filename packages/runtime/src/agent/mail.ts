export const MailAgent = {
  async acquire(configurationName: string): Promise<MailAgentClient> {
    const uid = await Deno.core.opAsync(
      'op_mail_agent_acquire',
      configurationName,
    );

    return new MailAgentClient(uid);
  },
};

export class MailAgentClient {
  constructor(readonly uid: string) {}

  async send(mail: Mail.Mail) {
    if (mail.sender.mail === null) {
      throw new TypeError('mail sender should not be empty');
    }
    if (mail.receivers.length === 0) {
      throw new TypeError('mail receivers should not be empty');
    }
    if (mail.subject.length === 0) {
      throw new TypeError('mail subject should not be empty');
    }
    if (mail.body.length === 0) {
      throw new TypeError('mail body should not be empty');
    }

    return Deno.core.opAsync('op_mail_agent_send', {
      uid: this.uid,
      mail,
    });
  }
}

export namespace Mail {
  export interface MailBox {
    name: string
    mail: string
  }

  export class Mail {
    sender: MailBox;

    receivers: MailBox[];

    replyTo?: MailBox;

    cc: MailBox[];

    bcc: MailBox[];

    subject: string;

    body: string;

    constructor() {
      this.sender = { mail: '', name: '' };
      this.receivers = [];
      this.replyTo = undefined;
      this.cc = [];
      this.bcc = [];
      this.subject = '';
      this.body = '';
    }

    setSender(mail: string, name = '') {
      this.sender = { mail, name };
      return this;
    }

    setReceivers(mail: string, name = '') {
      this.receivers.push({ mail, name });
      return this;
    }

    setReplyTo(mail: string, name = '') {
      this.replyTo = { mail, name };
      return this;
    }

    setCC(mail: string, name = '') {
      this.cc.push({ mail, name });
      return this;
    }

    setBCC(mail: string, name = '') {
      this.bcc.push({ mail, name });
      return this;
    }

    setSubject(subject: string) {
      this.subject = subject;
      return this;
    }

    setBody(body: string) {
      this.body = body;
      return this;
    }
  }
}
