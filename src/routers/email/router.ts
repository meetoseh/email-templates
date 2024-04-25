import { PendingRoute } from '../lib/route';
import { SampleRoute } from '../../../emails/sample';
import { DailyReminderRoute } from '../../../emails/dailyReminder';
import { DailyReminderRoute2 } from '../../../emails/dailyReminder2';
import { EmailLaunchAnnouncementRoute } from '../../../emails/emailLaunchAnnouncement';
import { EmailOseh30AnnouncementRoute } from '../../../emails/emailOseh30Announcement';
import { EmailOseh302AnnouncementRoute } from '../../../emails/emailOseh302Announcement';
import { ResetPasswordRoute } from '../../../emails/resetPassword';
import { VerifyEmailCodeRoute } from '../../../emails/verifyEmailCode';
import { EmailRoute } from './lib/emailRoute';
import { OASResponses } from '../lib/openapi';

const emailRoutes: EmailRoute[] = [
  SampleRoute,
  DailyReminderRoute,
  DailyReminderRoute2,
  ResetPasswordRoute,
  VerifyEmailCodeRoute,
  EmailLaunchAnnouncementRoute,
  EmailOseh30AnnouncementRoute,
  EmailOseh302AnnouncementRoute,
];

const routes: PendingRoute[] = emailRoutes.map((emailRoute) => ({
  methods: ['POST'],
  path: `/${emailRoute.slug}`,
  handler: emailRoute.handler,
  docs: [
    {
      templatedRelativePath: `/${emailRoute.slug}`,
      pathItem: {
        post: {
          tags: ['templates'],
          summary: emailRoute.summary,
          description: emailRoute.description,
          operationId: `email-templates-${emailRoute.slug}`,
          parameters: [],
          security: [
            {
              jwt: [],
            },
          ],
          requestBody: {
            description: 'Template parameters',
            required: true,
            content: {
              'application/json; charset=utf-8': {
                schema: emailRoute.schema,
              },
            },
          },
          responses: {
            '200': {
              description: 'Success',
              content: {
                'text/html; charset=utf-8': {
                  description:
                    'The HTML representation for the email using the given parameters and template',
                },
                'text/plain; charset=utf-8': {
                  description:
                    'The plain text representation for the email using the given parameters and template',
                },
              },
            },
            '400': {
              description: 'Bad Request, e.g., invalid headers',
            },
            '401': {
              description: 'Unauthorized, e.g., missing JWT',
            },
            '403': {
              description: 'Forbidden, e.g., invalid JWT (or wrong sub)',
            },
            '422': {
              description:
                'Unprocessable Entity - the request was well-formed but the request body was semantically incorrect',
              content: {
                'application/json; charset=utf-8': {
                  schema: {
                    type: 'object',
                    required: ['error', 'errorPath'],
                    properties: {
                      error: {
                        type: 'string',
                        format: 'string',
                        description: 'A description of the error',
                      },
                      errorPath: {
                        description: 'The path to the error in the request body',
                        type: 'array',
                        items: {
                          type: 'string',
                          format: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          } as OASResponses,
        },
      },
    },
  ],
}));

export default routes;
