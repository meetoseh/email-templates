import { Readable } from 'stream';
import { RouteBodyArgs } from './RouteBodyArgs';
import { acceptableEncodingsHeader, finishWithEncodedServerResponse } from './acceptEncoding';

/**
 * Writes the appropriate response to the given request given that
 * the accept-encoding header indicated no acceptable supported encodings.
 */
export const finishWithBadEncoding = (args: RouteBodyArgs) => {
  // status code is explicitly defined in RFC 9110
  // https://www.rfc-editor.org/rfc/rfc9110.html#name-accept-encoding
  args.resp.statusCode = 415;
  args.resp.statusMessage = 'Unsupported Media Type';
  args.resp.setHeader('Vary', 'Accept-Encoding');
  args.resp.setHeader('Accept-Encoding', acceptableEncodingsHeader);
  return finishWithEncodedServerResponse(
    args,
    {
      identifier: 'identity',
      quality: 1,
    },
    Readable.from(Buffer.from(''))
  );
};
