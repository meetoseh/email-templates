import { Readable } from 'stream';
import {
  finishWithEncodedServerResponse,
  parseAcceptEncoding,
  selectEncoding,
} from '../../lib/acceptEncoding';
import { PendingRoute } from '../../lib/route';
import { simpleRouteHandler } from '../../lib/simpleRouteHandler';
import { finishWithBadEncoding } from '../../lib/finishWithBadEncoding';
import { OASMediaType, OASPathItem } from '../../lib/openapi';

const helloWorldRoute: PendingRoute = {
  methods: ['GET'],
  path: '/hello_world',
  handler: () =>
    simpleRouteHandler(async (args) => {
      const coding = selectEncoding(parseAcceptEncoding(args.req.headers['accept-encoding']));
      if (coding === null) {
        return finishWithBadEncoding(args);
      }

      args.resp.statusCode = 200;
      args.resp.statusMessage = 'OK';
      args.resp.setHeader('Vary', 'Accept-Encoding');
      args.resp.setHeader('Content-Encoding', coding.identifier);
      args.resp.setHeader('Content-Type', 'application/json; charset=utf-8');

      return finishWithEncodedServerResponse(
        args,
        coding,
        Readable.from(
          Buffer.from(
            JSON.stringify({
              message: 'Hello, world!',
            }) + '\n',
            'utf-8'
          )
        )
      );
    }),
  docs: [
    {
      templatedRelativePath: '/hello_world',
      pathItem: {
        get: {
          tags: ['example'],
          summary: 'Example route',
          description:
            'This route can be used to test your ability to connect to the server, ' +
            'usually for testing http protocols or content negotiation.',
          operationId: 'management_helloWorldGet',
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['message'],
                    properties: {
                      message: {
                        type: 'string',
                        format: 'string',
                        summary: 'Contains the literal value "Hello, world!"',
                        enum: ['Hello, world!'],
                      },
                    },
                  },
                  examples: {
                    basic: {
                      value: {
                        message: 'Hello, world!',
                      },
                    },
                  },
                } as OASMediaType,
              },
            },
          },
        },
      } as OASPathItem,
    },
  ],
};

export default helloWorldRoute;
