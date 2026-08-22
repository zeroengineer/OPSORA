import { getServerEnv } from "@opsora/config/server";
import { logger } from "@opsora/utils";

export interface AuthMail {
  to: string;
  subject: string;
  /** Plain text — kept plain so the development transport stays readable. */
  body: string;
  meta?: Record<string, unknown>;
}

export interface Mailer {
  send(mail: AuthMail): Promise<void>;
}

/**
 * Development transport: writes the message to the structured log so a reset
 * link can be copied straight out of the API console.
 */
const logMailer: Mailer = {
  send(mail) {
    logger.info("Outbound auth email (log transport)", {
      to: mail.to,
      subject: mail.subject,
      body: mail.body,
      ...mail.meta,
    });
    return Promise.resolve();
  },
};

/**
 * Production stand-in. Deliberately drops the message rather than logging it —
 * a reset link in a production log is a credential in a production log.
 */
const droppingMailer: Mailer = {
  send(mail) {
    logger.error("No mail transport configured — auth email dropped", {
      to: mail.to,
      subject: mail.subject,
    });
    return Promise.resolve();
  },
};

/**
 * The seam for a real transport. When SMTP, Resend or SES lands, it becomes a
 * branch here and nothing else in the codebase moves.
 */
export function createMailer(): Mailer {
  return getServerEnv().NODE_ENV === "production" ? droppingMailer : logMailer;
}

export const mailer = createMailer();
