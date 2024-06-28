import * as components from '@react-email/components';
import { EmailRoute } from '../src/routers/email/lib/emailRoute';
import { simpleEmailRoute } from '../src/routers/email/lib/simpleEmailRoute';
import s from '../src/routers/lib/schemaHelpers';
import * as React from 'react';

// I wish there was a more compact way to make this work both when compiling
// with commonjs (as with npm run preview) and with ECM modules (as with the
// standard run process)
let { Body, Container, Head, Html, Preview, Text, render } = components;
if (Body === undefined) {
  let comps = (components as any).default;
  Body = comps.Body;
  Container = comps.Container;
  Head = comps.Head;
  Html = comps.Html;
  Preview = comps.Preview;
  Text = comps.Text;
  render = comps.render;
}

type PlainComponentParagraph = { type: 'paragraph'; text: string };
type PlainComponentSpacer = { type: 'spacer'; pixels: number; newlines: number };
type PlainComponent = PlainComponentParagraph | PlainComponentSpacer;

export type PlainProps = {
  preview?: string | null;
  components: PlainComponent[];
  strictlyPlain: boolean;
};

const PlainHtml = ({
  preview,
  components = [{ type: 'paragraph', text: 'This is some text' }],
}: PlainProps) => (
  <Html>
    <Head />
    {preview && <Preview>{preview}</Preview>}
    <Body
      style={{
        width: '100%',
        padding: '0',
        margin: '0',
      }}>
      {components.map((c, idx) => {
        if (c.type === 'paragraph') {
          return <Text key={idx}>{c.text}</Text>;
        } else if (c.type === 'spacer') {
          return <Container key={idx} style={{ height: `${c.pixels}px` }} />;
        }

        return <React.Fragment key={idx} />;
      })}
    </Body>
  </Html>
);

const Plain = ({
  preview = 'Preview text would go here',
  components = [{ type: 'paragraph', text: 'This is some text' }],
}: PlainProps) => {
  return components
    .map((c) => {
      if (c.type === 'paragraph') {
        return c.text + '\n';
      } else if (c.type === 'spacer') {
        return '\n'.repeat(c.newlines);
      }

      return '';
    })
    .join('');
};

export const PlainRoute: EmailRoute = simpleEmailRoute<PlainProps>({
  slug: 'plain',
  summary: 'Generic plain template',
  description: 'Allows sending plain looking emails.',
  schema: s.object({
    preview: s.optional(
      s.string(
        {
          title: 'Preview',
          example: null,
          description:
            'If specified, the HTML version will include this as invisible text at the start of the email, ' +
            'so it shows up in the preview pane of most email clients. If the email is sent strictly plain, ' +
            'there is nowhere to put this text and it will be omitted.',
        },
        { nullable: true }
      )
    ),
    components: s.array(
      {
        title: 'Components',
        description:
          'The actually text within the email, broken out by paragraphs and optional bonus spacers',
        example: [
          { type: 'paragraph', text: 'Hello {name},' },
          { type: 'spacer', pixels: 24, newlines: 1 },
          { type: 'paragraph', text: '{message}' },
          { type: 'spacer', pixels: 40, newlines: 2 },
          { type: 'paragraph', text: 'Sincerely,' },
          { type: 'paragraph', text: 'The Oseh Team' },
        ],
      },
      {
        items: s.enumDiscriminator(
          'type',
          [
            s.object(
              {
                type: s.string(
                  { title: 'Paragraph', description: 'A paragraph of text' },
                  { enum: ['paragraph'] }
                ),
                text: s.string({
                  title: 'Text',
                  description: 'The text of the paragraph. Newlines are ignored in the HTML output',
                }),
              },
              {
                example: { type: 'paragraph', text: 'Some text would go here' },
              }
            ),
            s.object(
              {
                type: s.string(
                  { title: 'Spacer', description: 'A spacer to add vertical space' },
                  { enum: ['spacer'] }
                ),
                pixels: s.number('integer', {
                  title: 'Pixels',
                  description: 'The height of the spacer in pixels in the HTML output',
                }),
                newlines: s.number('integer', {
                  title: 'Newlines',
                  description: 'The number of newlines to add in the plain text output',
                }),
              },
              {
                example: { type: 'spacer', pixels: 24, newlines: 1 },
              }
            ),
          ],
          {
            example: {
              type: 'paragraph',
              text: 'Some text would go here',
            },
          }
        ),
      }
    ),
    strictlyPlain: s.optional(
      s.boolean({
        title: 'Strictly Plain',
        description:
          'If true, the email will be sent as plain text only, rather than minimally styled HTML with a plain text fallback. This will omit the preview text.',
        default: false,
        example: false,
      })
    ),
  }),
  render: (props, format) => {
    if (format === 'plain' || props.strictlyPlain) {
      return Plain(props);
    }

    return render(<PlainHtml {...props} />);
  },
});

export default PlainHtml;
