import { ServerResponse } from 'http';
import { Readable } from 'stream';
import { CancelablePromise } from '../../lib/CancelablePromise';
import { Callbacks } from '../../lib/Callbacks';
import { createCancelablePromiseFromCallbacks } from '../../lib/createCancelablePromiseFromCallbacks';
import { createGzip, createBrotliCompress } from 'zlib';
import { createCancelableTimeout } from '../../lib/createCancelableTimeout';
import { CONTENT_TIMEOUT_MESSAGE, WRITE_TIMEOUT_MESSAGE } from './errors';
import { writeServerResponse } from '../../lib/writeServerResponse';
import { RouteBodyArgs } from './RouteBodyArgs';

export type Coding = {
  identifier: string;
  quality: number;
};

export type KnownCoding = {
  identifier: keyof typeof supportedEncodings;
  quality: number;
};

// We are parsing:
//
// Accept-Encoding = [ ( codings [ weight ] ) * ( OWS "," OWS ( codings [ weight ] ) ) ]
// codings = content-coding / "identity" / "*"
// content-coding = token
// token = 1*tchar
// tchar = "!" / "#" / "$" / "%" / "&" / "'" / "*" / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~" / DIGIT / ALPHA
// weight = OWS ";" OWS "q=" qvalue
// qvalue = ( "0" [ "." *3DIGIT ] ) / ( "1" [ "." *3"0" ] )
// OWS = optional white space

const tcharRegex = /[!#$%&'*+\-.^_`|~0-9a-zA-Z]/;
const tokenRegex = new RegExp(`${tcharRegex.source}+`);
const contentCodingRegex = tokenRegex;
const codingsRegex = new RegExp(`(?:${contentCodingRegex.source}|identity|\\*)`);
const optionalWhitespaceRegex = /\s*/;
const qvalueRegex = new RegExp(`(?:0(?:\\.[0-9]{0,3})?|1(?:\\.0{0,3})?)`);
const weightRegex = new RegExp(
  `(?:${optionalWhitespaceRegex.source};${optionalWhitespaceRegex.source}q=${qvalueRegex.source})?`
);
const codingsWithOptionalWeightRegex = new RegExp(
  `(?:${codingsRegex.source}${weightRegex.source}?)`
);
const acceptEncodingRegex = new RegExp(
  `^(?:${codingsWithOptionalWeightRegex.source}(?:${optionalWhitespaceRegex.source},${optionalWhitespaceRegex.source}${codingsWithOptionalWeightRegex.source})*)?$`
);

/**
 * Parses the given Accept-Encoding header into the codings it contains. If multiple
 * accept-encoding headers are given, the first one is used. The returned codings
 * are not sorted.
 *
 * A returned encoding of '*' indicates that the client accepts any encoding, which
 * is also used when no Accept-Encoding header is given. If an empty accept encoding
 * is given, the 'identity' encoding is returned. Otherwise, the result is a faithful
 * representation of the Accept-Encoding header.
 *
 * If the header cannot be parsed, we assume the client only accepts the 'identity'
 * encoding.
 *
 * @param acceptEncoding The Accept-Encoding header to parse.
 * @returns The codings the client accepts.
 */
export const parseAcceptEncoding = (acceptEncodingRaw: string | string[] | undefined): Coding[] => {
  const acceptEncoding = (() => {
    if (acceptEncodingRaw === undefined) {
      return '*';
    }

    if (Array.isArray(acceptEncodingRaw)) {
      if (acceptEncodingRaw.length < 1) {
        return '*';
      }
      return acceptEncodingRaw[0];
    }

    return acceptEncodingRaw;
  })();

  if (acceptEncoding === '') {
    return [{ identifier: 'identity', quality: 1 }];
  }

  if (!acceptEncodingRegex.test(acceptEncoding)) {
    return [{ identifier: 'identity', quality: 1 }];
  }

  const codings: Coding[] = [];
  const codingsRaw = acceptEncoding.split(',');
  for (const codingRaw of codingsRaw) {
    const codingAndQuality = codingRaw.split(';');
    const coding = codingAndQuality[0].trim();
    const quality =
      codingAndQuality[1] !== undefined
        ? parseFloat(codingAndQuality[1].split('=')[1].trim())
        : undefined;
    codings.push({ identifier: coding, quality: quality ?? 1 });
  }
  return codings;
};

const supportedEncodings = {
  gzip: (stream: Readable): Readable => {
    return stream.pipe(createGzip());
  },
  br: (stream: Readable): Readable => {
    return stream.pipe(createBrotliCompress());
  },
  identity: (stream: Readable): Readable => {
    return stream;
  },
};

// used to break ties when multiple codings have the same quality
const encodingPriority = {
  identity: 0,
  gzip: 1,
  br: 2,
};

export const acceptableEncodingsHeader = 'br, gzip, identity';

/**
 * Selects the known coding to use, given the codings the client accepts. If the client
 * accepts no known codings, the 'identity' coding is returned.
 *
 * @param codings The codings the client accepts, with preference information
 * @returns The coding to use, or null if no known coding is acceptable
 */
export const selectEncoding = (codings: Coding[]): null | KnownCoding => {
  const knownCodings = codings.filter(
    (coding) => coding.identifier in supportedEncodings
  ) as KnownCoding[];

  if (knownCodings.length < codings.length) {
    const catchall = codings.find((coding) => coding.identifier === '*');
    if (catchall !== undefined) {
      const givenLookup = new Set(knownCodings.map((coding) => coding.identifier));
      for (const identRaw in supportedEncodings) {
        const identifier = identRaw as keyof typeof supportedEncodings;
        if (!givenLookup.has(identifier)) {
          knownCodings.push({ identifier: identifier, quality: catchall.quality });
        }
      }
    }
  }

  if (knownCodings.length === 0) {
    return null;
  }

  const sortedCodings = knownCodings.sort((a, b) => {
    if (a.quality === b.quality) {
      return encodingPriority[b.identifier] - encodingPriority[a.identifier];
    }
    return b.quality - a.quality;
  });

  if (sortedCodings[0].quality === 0) {
    return null;
  }

  return sortedCodings[0];
};

/**
 * Writes the server response to the given stream, encoding it as appropriate based on
 * the given codings. This always ends the request, as most encodings cannot be continued
 * from chunks naively, i.e., they have specific framing requirements.
 *
 * This is a fairly low-level implementation; it's typically better to use
 * `finishWithEncodedServerResponse` instead, which accepts the standard route body args.
 *
 * @param resp The server response to stream to
 * @param coding The coding to use
 * @param stream The stream to read from. Should be in the paused state, which is the default.
 *   This will consume from the stream in paused mode to avoid backpressure issues.
 */
export const streamEncodedServerResponse = (
  resp: ServerResponse,
  coding: KnownCoding,
  stream: Readable
): CancelablePromise<void> => {
  let done = false;
  let finishing = false;

  const cancelers = new Callbacks<undefined>();

  return {
    done: () => done,
    cancel: () => {
      if (!finishing && !done) {
        finishing = true;
        cancelers.call(undefined);
      }
    },
    promise: new Promise<void>((resolve, reject) => {
      if (finishing) {
        reject(new Error('canceled'));
        return;
      }

      const canceled = createCancelablePromiseFromCallbacks(cancelers);

      let reading = false;
      let endReached = false;
      let contentTimeoutReached = false;
      let contentTimeout: NodeJS.Timeout | null = setTimeout(onContentTimeout, 5000);
      cancelers.add(() => {
        if (contentTimeout !== null) {
          clearTimeout(contentTimeout);
          contentTimeout = null;
        }
      });
      const adaptedStream = supportedEncodings[coding.identifier](stream);

      adaptedStream.on('error', (e) => {
        if (finishing) {
          return;
        }

        finishing = true;
        cancelers.call(undefined);
        reject(e);
      });
      adaptedStream.on('readable', onReadable);
      adaptedStream.on('end', () => {
        endReached = true;
        onReadable();
      });
      if (adaptedStream.readableEnded) {
        endReached = true;
      }
      if (adaptedStream.readable) {
        onReadable();
      }
      return;

      async function handleEnd() {
        if (contentTimeout !== null) {
          clearTimeout(contentTimeout);
          contentTimeout = null;
        }

        const endPromise = new Promise<void>((resolve) => {
          resp.end(resolve);
        });

        const timeout = createCancelableTimeout(5000);

        try {
          await Promise.race([canceled.promise, endPromise, timeout.promise]);
        } catch (e) {
          canceled.cancel();
          timeout.cancel();
          if (finishing) {
            return;
          }
          finishing = true;
          cancelers.call(undefined);
          reject(e);
          return;
        }

        if (finishing) {
          timeout.cancel();
          return;
        }

        if (timeout.done()) {
          finishing = true;
          cancelers.call(undefined);
          reject(new Error(WRITE_TIMEOUT_MESSAGE));
          return;
        }

        finishing = true;
        cancelers.call(undefined);
        if (contentTimeoutReached) {
          reject(new Error(CONTENT_TIMEOUT_MESSAGE));
        } else {
          resolve();
        }
      }

      async function pipeToResponse() {
        if (finishing) {
          return;
        }

        while (adaptedStream.readable) {
          const chunk = adaptedStream.read();
          if (chunk === null) {
            break;
          }

          if (!Buffer.isBuffer(chunk)) {
            throw new Error('streamEncodedServerResponse: expected buffer');
          }

          if (contentTimeout !== null) {
            clearTimeout(contentTimeout);
            contentTimeout = null;
          }

          const write = writeServerResponse(resp, chunk, { endStream: false, chunkTimeout: 5000 });
          try {
            await Promise.race([write.promise, canceled.promise]);
          } catch (e) {
            write.cancel();
            canceled.cancel();
            if (finishing) {
              return;
            }
            finishing = true;
            cancelers.call(undefined);
            reject(e);
            return;
          }

          if (finishing) {
            return;
          }

          if (contentTimeout !== null) {
            clearTimeout(contentTimeout);
          }
          contentTimeout = setTimeout(onContentTimeout, 5000);
        }

        if (endReached) {
          handleEnd();
        }
      }

      function onReadable() {
        if (reading) {
          return;
        }

        reading = true;
        pipeToResponse().finally(() => {
          reading = false;
        });
      }

      function onContentTimeout() {
        contentTimeout = null;
        if (finishing) {
          return;
        }
        contentTimeoutReached = true;
        handleEnd();
      }
    }).finally(() => {
      done = true;
    }),
  };
};

/**
 * Takes over the rest of the route body implementation, writing the server response
 * with the given coding using the given stream, where the stream provides the
 * unencoded body. This handles the appropriate write and content timeouts required
 * to write content. Note this does not write any headers directly.
 *
 * @param args The route body args
 * @param coding The coding to use
 * @param stream The paused stream to use to send the response body
 */
export const finishWithEncodedServerResponse = async (
  args: RouteBodyArgs,
  coding: KnownCoding,
  stream: Readable
) => {
  if (args.state.finishing) {
    return;
  }

  let writePromise = streamEncodedServerResponse(args.resp, coding, stream);
  try {
    await Promise.race([args.canceled.promise, writePromise.promise]);
  } catch (e) {
    writePromise.cancel();
    if (args.state.finishing) {
      return;
    }

    args.state.finishing = true;
    args.state.cancelers.call(undefined);
    args.reject(e);
    return;
  }

  if (args.state.finishing) {
    writePromise.cancel();
    return;
  }

  args.state.finishing = true;
  args.state.cancelers.call(undefined);
  args.resolve();
};