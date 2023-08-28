import { EmailRoute } from './emailRoute';
import { simpleRouteHandler } from '../../lib/simpleRouteHandler';
import { Field } from '../../lib/schemaHelpers';
import s from '../../lib/schemaHelpers';
import {
  finishWithEncodedServerResponse,
  parseAcceptEncoding,
  selectEncoding,
} from '../../lib/acceptEncoding';
import { finishWithBadEncoding } from '../../lib/finishWithBadEncoding';
import { AcceptMediaRangeWithoutWeight, parseAccept, selectAccept } from '../../lib/accept';
import { BAD_REQUEST_MESSAGE } from '../../lib/errors';
import { finishWithBadRequest } from '../../lib/finishWithBadRequest';
import { finishWithNotAcceptable } from '../../lib/finishWithNotAcceptable';
import { loadBodyJson } from '../../lib/loadBodyJson';
import { STANDARD_VARY_RESPONSE } from '../../lib/constants';
import { Readable } from 'stream';
import { JWTPayload, jwtVerify } from 'jose';

export type SimpleEmailRouteArgs<T extends object> = Omit<EmailRoute, 'handler' | 'schema'> & {
  /**
   * The schema for the route, specified using the schema helper functions.
   * This allows only for a subset of the theoretically possible schemas,
   * but also comes with a validator function that ensures the openapi
   * schema is actually what the route validates against.
   */
  schema: Field;
  /**
   * Renders the email using the provided args, which were evaluated against the
   * schema and then assumed to match the provided type.
   *
   * TODO: I'm not aware of any typing magic to get typescript to actually
   *   verify a type matches a schema, but that'd be nice. Luckily it's pretty
   *   easy to check if the schema and type are defined adjacent to each other.
   *
   * @param args The args to render the email with
   * @param format The format to render the email in
   * @returns The rendered email
   */
  render: (args: T, format: 'html' | 'plain') => string;
};

const acceptable: AcceptMediaRangeWithoutWeight[] = [
  { type: 'text', subtype: 'html', parameters: { charset: 'utf8' } },
  { type: 'text', subtype: 'html', parameters: { charset: 'utf-8' } },
  { type: 'text', subtype: 'plain', parameters: { charset: 'utf8' } },
  { type: 'text', subtype: 'plain', parameters: { charset: 'utf-8' } },
];

/**
 * Generates an email route using the schema-helper typed schema and
 * a simplified render function.
 *
 * @param args The arguments to generate the route with
 * @returns The generated email route
 */
export const simpleEmailRoute = <T extends object>(
  routeArgs: SimpleEmailRouteArgs<T>
): EmailRoute => {
  return {
    slug: routeArgs.slug,
    summary: routeArgs.summary,
    description: routeArgs.description,
    schema: s.build(routeArgs.schema),
    handler: () => {
      const validator = s.validator(routeArgs.schema);
      return simpleRouteHandler(async (args) => {
        const coding = selectEncoding(parseAcceptEncoding(args.req.headers['accept-encoding']));
        if (coding === null) {
          return finishWithBadEncoding(args);
        }

        let accepted;
        try {
          accepted = selectAccept(parseAccept(args.req.headers['accept']), acceptable);
        } catch (e) {
          if (e instanceof Error && e.message === BAD_REQUEST_MESSAGE) {
            return await finishWithBadRequest(args);
          }
          throw e;
        }

        if (accepted === undefined) {
          return await finishWithNotAcceptable(args, acceptable);
        }

        const authorization = args.req.headers.authorization;
        if (authorization === undefined || !authorization.startsWith('Bearer ')) {
          args.resp.statusCode = 401;
          args.resp.statusMessage = 'Unauthorized';
          args.resp.setHeader('Content-Type', 'text/plain; charset=utf-8');
          args.resp.setHeader('Content-Encoding', coding);
          args.resp.setHeader('Vary', STANDARD_VARY_RESPONSE);
          return finishWithEncodedServerResponse(
            args,
            coding,
            Readable.from(
              Buffer.from(
                'Unauthorized: provide an Authorization header in the form "Bearer {jwt}"',
                'utf-8'
              )
            )
          );
        }

        const token = authorization.slice('Bearer '.length);
        let payload: JWTPayload;
        try {
          const verified = await jwtVerify(
            token,
            Buffer.from(process.env.OSEH_EMAIL_TEMPLATE_JWT_SECRET!, 'utf-8'),
            {
              issuer: 'oseh',
              audience: 'oseh-email-templates',
              algorithms: ['HS256'],
              requiredClaims: ['iss', 'aud', 'iat', 'exp', 'jti', 'sub'],
            }
          );
          payload = verified.payload;
        } catch (e) {
          args.resp.statusCode = 403;
          args.resp.statusMessage = 'Forbidden';
          args.resp.setHeader('Content-Type', 'text/plain; charset=utf-8');
          args.resp.setHeader('Content-Encoding', coding);
          args.resp.setHeader('Vary', STANDARD_VARY_RESPONSE);
          return finishWithEncodedServerResponse(
            args,
            coding,
            Readable.from(
              Buffer.from(
                'Token was not understood, not signed correctly, or missing required claims',
                'utf-8'
              )
            )
          );
        }

        if (args.state.finishing) {
          return;
        }

        if (payload.sub !== routeArgs.slug) {
          args.resp.statusCode = 403;
          args.resp.statusMessage = 'Forbidden';
          args.resp.setHeader('Content-Type', 'text/plain; charset=utf-8');
          args.resp.setHeader('Content-Encoding', coding);
          args.resp.setHeader('Vary', STANDARD_VARY_RESPONSE);
          return finishWithEncodedServerResponse(
            args,
            coding,
            Readable.from(Buffer.from('Token sub does not match route slug', 'utf-8'))
          );
        }

        const bodyJson = await loadBodyJson(args, {});
        if (args.state.finishing) {
          return;
        }

        const validation = validator(bodyJson);
        if (!validation.matches) {
          args.resp.statusCode = 422;
          args.resp.statusMessage = 'Unprocessable Entity';
          args.resp.setHeader('Content-Encoding', coding);
          args.resp.setHeader('Content-Type', 'application/json; charset=utf-8');
          args.resp.setHeader('Vary', STANDARD_VARY_RESPONSE);
          return finishWithEncodedServerResponse(
            args,
            coding,
            Readable.from(
              Buffer.from(
                JSON.stringify({
                  error: validation.error,
                  errorPath: validation.errorPath,
                })
              )
            )
          );
        }

        const body = bodyJson as T;
        const rendered = routeArgs.render(body, accepted.subtype as 'html' | 'plain');

        args.resp.statusCode = 200;
        args.resp.statusMessage = 'OK';
        args.resp.setHeader('Content-Encoding', coding);
        args.resp.setHeader('Content-Type', `${accepted.type}/${accepted.subtype}; charset=utf-8`);
        args.resp.setHeader('Vary', STANDARD_VARY_RESPONSE);
        return finishWithEncodedServerResponse(
          args,
          coding,
          Readable.from(Buffer.from(rendered, 'utf-8'))
        );
      });
    },
  };
};
