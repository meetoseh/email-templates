import { OASSchema } from '../../lib/openapi';
import { PendingRoute } from '../../lib/route';

/**
 * Describes an email route, which is a POST endpoint which accepts a JSON
 * body and returns either html or plain text depending on the accept header,
 * always utf-8 encoded.
 *
 * Typically this is implemented via simpleEmailRoute which will ensure the
 * schema and body parsing matches.
 */
export type EmailRoute = {
  /**
   * The unique slug for the email, which will go into the path selected
   * for the route
   */
  slug: string;

  /**
   * A short summary of the email
   */
  summary: string;

  /**
   * If a longer description is appropriate, a longer description with CommonMark
   * styling support
   */
  description?: string;

  /**
   * The arguments for the email.
   */
  schema: OASSchema;

  /**
   * A function which returns the handler function to use for the email.
   */
  handler: PendingRoute['handler'];
};
