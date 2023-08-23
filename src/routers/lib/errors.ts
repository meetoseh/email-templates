/**
 * Used if it takes too long to write to the client, despite
 * data being available
 */
export const WRITE_TIMEOUT_MESSAGE = 'write timeout';
/**
 * Used if it takes too long to read from the client
 */
export const READ_TIMEOUT_MESSAGE = 'read timeout';
/**
 * Used if it takes too long to decide what content to respond to
 * the client with, usually raised from helper functions like
 * streamEncodedServerResponse
 */
export const CONTENT_TIMEOUT_MESSAGE = 'content timeout';
