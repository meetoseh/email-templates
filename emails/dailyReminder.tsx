import * as components from '@react-email/components';
import { EmailRoute } from '../src/routers/email/lib/emailRoute';
import { simpleEmailRoute } from '../src/routers/email/lib/simpleEmailRoute';
import s from '../src/routers/lib/schemaHelpers';
import * as React from 'react';
import { SmartQuotesText } from '../src/lib/SmartQuotesText';
import { OpenSansFont } from '../src/lib/OpenSansFont';
import { CommunitySection } from '../src/lib/CommunitySection';

let { Link, Body, Container, Head, Html, Preview, Text, Hr, Img, Row, Column, Section, render } =
  components;
if (Body === undefined) {
  let comps = (components as any).default;
  Link = comps.Link;
  Body = comps.Body;
  Container = comps.Container;
  Head = comps.Head;
  Html = comps.Html;
  Preview = comps.Preview;
  Text = comps.Text;
  Hr = comps.Hr;
  Img = comps.Img;
  Row = comps.Row;
  Column = comps.Column;
  Section = comps.Section;
  render = comps.render;
}

export type DailyReminderProps = {
  name: string;
  message: string;
  url: string;
  unsubscribeUrl: string;
};

const DailyReminder = ({
  name = 'John',
  message = "It's Time for Your Mindful Moment",
  url = 'https://oseh.io',
  unsubscribeUrl = 'https://oseh.io',
}: DailyReminderProps) => (
  <Html>
    <Head>
      <OpenSansFont weights={[300, 400, 600]} italicWeights={[300]} />
    </Head>
    <Preview>{message}</Preview>
    <Body style={main}>
      <Container style={mainSection}>
        <Container style={logoContainer}>
          <Link href="https://oseh.io">
            <Img
              alt="Oseh Logo"
              src="https://oseh.io/email-assets/wordmark-white-225w.png"
              style={logo}
            />
          </Link>
        </Container>
        <Container style={logoSeparatorContainer}>
          <Hr style={logoSeparator} />
        </Container>
        <Container style={container}>
          <Text style={greeting}>Hi {name},</Text>
          <Text style={messageStyle}>
            <SmartQuotesText>{message}</SmartQuotesText>
          </Text>
          <Container style={ctaContainer}>
            <Link style={cta} href={url}>
              Let&rsquo;s Go
            </Link>
          </Container>
          <Text style={feedbackQuestion}>Have feedback or suggestions?</Text>
          <Container style={bookCallContainer}>
            <Link style={bookCall} href="https://calendly.com/paul-javid/oseh-feedback">
              Book a call with our CEO
            </Link>
          </Container>
        </Container>
      </Container>
      <CommunitySection unsubscribeUrl={unsubscribeUrl} />
    </Body>
  </Html>
);

const DailyReminderPlain = ({
  name = 'John',
  message = "It's Time for Your Mindful Moment",
  url = 'https://oseh.io',
  unsubscribeUrl = 'https://oseh.io',
}: DailyReminderProps) =>
  `Hello ${name},\n\n${message}\n\nLet's Go: ${url}\n\nUnsubscribe: ${unsubscribeUrl}`;

export const DailyReminderRoute: EmailRoute = simpleEmailRoute<DailyReminderProps>({
  slug: 'dailyReminder',
  summary: 'A template for short reminder messages',
  description:
    'A basic template that greets the user, says the message very prominently, ' +
    'then provides a call to action that goes to the given URL. This template ' +
    'may include current general marketing initiatives below, like a feedback ' +
    'call or link to a recent blog post, but user-tailored content should go in ' +
    'a different template.',
  schema: s.object({
    name: s.string(
      { title: 'Name', description: 'The name of the person to greet. First name preferred.' },
      { maxLength: 255 }
    ),
    message: s.string({
      title: 'Message',
      description:
        "The message to display, e.g, 'Stress-Free Days Begin with Mindfulness'. " +
        "Quotes should be basic (e.g., ') and they will be converted to curly quotes " +
        'where appropriate.',
    }),
    url: s.string(
      {
        title: 'URL',
        description: 'The URL to send the user to when they click the button.',
      },
      { maxLength: 2048 }
    ),
    unsubscribeUrl: s.string(
      {
        title: 'Unsubscribe URL',
        description: 'The URL to send the user to when they click the unsubscribe link.',
      },
      { maxLength: 2048 }
    ),
  }),
  render: (props, format) => {
    if (format === 'plain') {
      return DailyReminderPlain(props);
    }

    return render(<DailyReminder {...props} />);
  },
});

export default DailyReminder;

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  padding: '24px',
};

const mainSection = {
  backgroundColor: '#2D2E2E',
  margin: '0 auto',
  padding: '0 0 24px 0',
};

const logoContainer = {
  padding: '40px 0 24px 0',
};

const logo = {
  margin: '0 auto',
  width: '75px',
  height: '17.5px',
};

const logoSeparatorContainer = {
  padding: '0 16px',
};

const logoSeparator = {
  color: '#ffffff',
};

const greeting = {
  fontSize: '16px',
  fontWeight: 300,
  lineHeight: '16px',
  color: '#ffffff',
  textAlign: 'center',
} as const;

const messageStyle = {
  fontSize: '28px',
  color: '#ffffff',
  fontWeight: 300,
  textAlign: 'center',
  padding: '0 0 32px 0',
  lineHeight: '1.5',
} as const;

export const ctaContainer = {
  width: '100%',
  textAlign: 'center',
  padding: '0 0 48px 0',
} as const;

export const cta = {
  backgroundColor: '#f9f9f9',
  fontWeight: 400,
  color: '#2D2E2E',
  padding: '16px 60px',
  borderRadius: '30px',
  fontSize: '16px',
} as const;

const feedbackQuestion = {
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 300,
  fontStyle: 'italic',
  textAlign: 'center',
  marginBottom: '0',
} as const;

const bookCallContainer = {
  width: '100%',
  textAlign: 'center',
} as const;

const bookCall = {
  color: '#ffffff',
  fontSize: 12,
  fontWeight: 400,
  textDecoration: 'underline',
};
