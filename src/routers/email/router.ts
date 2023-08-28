import { PendingRoute } from '../lib/route';
import { SampleRoute } from '../../../emails/sample';
import { EmailRoute } from './lib/emailRoute';

const emailRoutes: EmailRoute[] = [SampleRoute];

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
          requestBody: {
            description: 'Template parameters',
            required: true,
            content: {
              'application/json; charset=utf-8': {
                schema: emailRoute.schema,
              },
            },
          },
        },
      },
    },
  ],
}));

export default routes;
