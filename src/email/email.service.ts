import { Injectable, Logger } from '@nestjs/common';
import {
  SESv2Client,
  SendEmailCommand,
  SendEmailCommandInput,
  SendEmailCommandOutput,
} from '@aws-sdk/client-sesv2';

export type SendEmailParam = {
  toAddress: string;
  fromAddress?: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private sesClient: SESv2Client;

  constructor() {
    this.sesClient = new SESv2Client({ region: 'ap-northeast-1' });
  }

  async sendEmail(param: SendEmailParam): Promise<SendEmailCommandOutput> {
    const input: SendEmailCommandInput = {
      FromEmailAddress: param.fromAddress || process.env.NO_REPLY_EMAIL,
      Destination: {
        ToAddresses: [param.toAddress],
      },
      Content: {
        Simple: {
          Subject: {
            Data: param.subject,
          },
          Body: {
            Text: {
              Data: param.bodyText,
            },
          },
        },
      },
    };

    if (param.bodyHtml) {
      input.Content.Simple.Body.Html = {
        Data: param.bodyHtml,
      };
    }

    if (process.env.APP_ENV == 'local') {
      console.log(JSON.stringify(input));
      return;
    }

    const command = new SendEmailCommand(input);
    const response: SendEmailCommandOutput = await this.sesClient.send(command);
    return response;
  }

  async sendConfirmEmail(email: string, token: string): Promise<void> {
    const confirmationUrl = `${process.env.API_URL}/auth/confirm?token=${token}`;
    const subject = 'Email Confirmation';
    const bodyText = `Please confirm your email by visiting: ${confirmationUrl}`;

    await this.sendEmail({
      toAddress: email,
      subject,
      bodyText,
    });
  }
}
