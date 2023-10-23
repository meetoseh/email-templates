import * as components from '@react-email/components';
import { EmailRoute } from '../src/routers/email/lib/emailRoute';
import { simpleEmailRoute } from '../src/routers/email/lib/simpleEmailRoute';
import s from '../src/routers/lib/schemaHelpers';
import * as React from 'react';
import { RIGHT_SINGLE_QUOTE } from '../src/lib/SmartQuotesText';
import { OpenSansFont } from '../src/lib/OpenSansFont';
import { CommunitySection } from '../src/lib/CommunitySection';
import { ctaContainer, cta } from './dailyReminder';

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

export type EmailLaunchAnnouncementProps = {};

const EmailLaunchAnnouncement = ({}: EmailLaunchAnnouncementProps) => (
  <Html>
    <Head>
      <OpenSansFont weights={[300, 400, 600]} italicWeights={[300]} />
    </Head>
    <Preview>Sign in with email is now available</Preview>
    <Body style={main}>
      <Container style={mainSection}>
        <Container style={logoContainer}>
          <Link href="https://oseh.io?utm_source=oseh.io&utm_medium=email&utm_campaign=siwo_launch&utm_content=logo_10232023">
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
          <Text style={greeting}>Oseh: Mindfulness Made Easy</Text>
          <Text style={messageStyle}>
            You asked to be notified when you were able to create an account on Oseh using an email
            and password. This feature is now available on web, iOS and Android.
          </Text>
          <Text style={messageStyle}>
            We believe everyone should practice mindfulness daily. That{RIGHT_SINGLE_QUOTE}s why we
            {RIGHT_SINGLE_QUOTE}ve made it as easy as finding 60 seconds in the 86,400 you have in a
            day. Oseh offers an array of tools designed to help you calm down, relax, ground
            yourself, stay positive, sleep better and more!
          </Text>
          <Container style={ctaContainer}>
            <Link
              style={cta}
              href="https://oseh.io?utm_source=oseh.io&utm_medium=email&utm_campaign=siwo_launch&utm_content=cta_10232023">
              Create a free account
            </Link>
          </Container>
          <Container style={appLinkContainer}>
            <Link href="https://apps.apple.com/app/apple-store/id6453520882?pt=125720028&ct=email_launch&mt=8">
              <Img
                alt="Download on the app store"
                src="https://oseh.io/email-assets/download-on-the-app-store-badge-630w.png"
                style={iosBadge}
              />
            </Link>
          </Container>
          <Container>
            <Link href="https://play.google.com/store/apps/details?id=com.oseh.frontendapp">
              <Img
                alt="Download on the app store"
                src="https://oseh.io/email-assets/google-play-badge-630w.png"
                style={googleBadge}
              />
            </Link>
          </Container>
        </Container>
      </Container>
      <CommunitySection noUnsubscribe />
    </Body>
  </Html>
);

const EmailLaunchAnnouncementPlain = ({}: EmailLaunchAnnouncementProps) =>
  'You asked to be notified when you were able to create an account on Oseh using an email ' +
  'and password. This feature is now available on web, iOS and Android.\n\n' +
  `We believe everyone should practice mindfulness daily. That${RIGHT_SINGLE_QUOTE}s ` +
  `why we${RIGHT_SINGLE_QUOTE}ve made it as easy as finding 60 seconds in the 86,400 ` +
  'you have in a day. Oseh offers an array of tools designed to help you calm down, ' +
  'relax, ground yourself, stay positive, sleep better and more!\n\n' +
  'Create a free account: https://oseh.io?utm_source=oseh.io&utm_medium=email&utm_campaign=siwo_launch&utm_content=plain_10232023\n\n' +
  'iOS App Store: https://apps.apple.com/app/apple-store/id6453520882?pt=125720028&ct=email_launch&mt=8\n\n' +
  'Google Play Store: https://play.google.com/store/apps/details?id=com.oseh.frontendapp\n';

export const EmailLaunchAnnouncementRoute: EmailRoute =
  simpleEmailRoute<EmailLaunchAnnouncementProps>({
    slug: 'emailLaunchAnnouncement',
    summary: 'The announcement email for Sign in with Oseh',
    description: 'Informs a user that Sign in with Oseh is now publicly available',
    schema: s.object({}),
    render: (props, format) => {
      if (format === 'plain') {
        return EmailLaunchAnnouncementPlain(props);
      }

      return render(<EmailLaunchAnnouncement {...props} />);
    },
  });

export default EmailLaunchAnnouncement;

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
  fontSize: '32px',
  fontWeight: 300,
  lineHeight: '48px',
  color: '#ffffff',
  textAlign: 'center',
} as const;

const messageStyle = {
  fontSize: '18px',
  color: '#ffffff',
  fontWeight: 300,
  textAlign: 'center',
  padding: '0 0 32px 0',
  lineHeight: '32px',
  letterSpacing: '0.25px',
} as const;

const appLinkContainer = {
  paddingBottom: '32px',
};

const iosBadge = {
  width: '210px',
  height: '70px',
  margin: '0 auto',
} as const;

const googleBadge = {
  width: '210px',
  height: '62px',
  margin: '0 auto',
} as const;
