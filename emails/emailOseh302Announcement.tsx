import * as components from '@react-email/components';
import { EmailRoute } from '../src/routers/email/lib/emailRoute';
import { simpleEmailRoute } from '../src/routers/email/lib/simpleEmailRoute';
import s from '../src/routers/lib/schemaHelpers';
import * as React from 'react';
import { RIGHT_SINGLE_QUOTE } from '../src/lib/SmartQuotesText';
import { OpenSansFont } from '../src/lib/OpenSansFont';
import { CommunitySection } from '../src/lib/CommunitySection';
import { cta } from './dailyReminder';

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

export type EmailLaunchAnnouncementProps = {
  unsubscribeUrl: string;
};

const EmailLaunchAnnouncement = ({
  unsubscribeUrl = 'https://oseh.io',
}: EmailLaunchAnnouncementProps) => (
  <Html>
    <Head>
      <OpenSansFont weights={[400, 600]} italicWeights={[]} />
      <style>{`
        @media (max-width: 600px) {
          .smallImg {
            width: 180px !important;
            height: 180px !important;
          }

          .horizontalPadding {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
        }
      `}</style>
    </Head>
    <Preview>New media player, home screen copy, and transitions</Preview>
    <Body style={main}>
      <Section style={logoContainer} className="horizontalPadding">
        <Link href="https://oseh.io">
          <Img
            alt="Oseh Logo"
            src="https://oseh.io/email-assets/wordmark-white-225w.png"
            style={logo}
          />
        </Link>
      </Section>
      <Section style={logoSeparatorContainer} className="horizontalPadding">
        <Hr style={logoSeparator} />
      </Section>
      <Section style={par0} className="horizontalPadding">
        <Text style={title1}>It{RIGHT_SINGLE_QUOTE}s Time for Your Mindful Moment</Text>
        <Text style={body1}>
          We are excited to announce that Oseh 3.0.2 is now available. This update brings several
          enhancements to enrich your experience with Oseh. Here{RIGHT_SINGLE_QUOTE}s what you can
          expect:
        </Text>
        <Text style={body1}>
          1. <strong>Personalized Insights:</strong> Enjoy curated mindfulness tips, quotes, and
          personalized encouragement right on your home screen. These insights are designed to spark
          thoughtful moments and support your journey towards your goals.
        </Text>
        <Text style={body1}>
          2. <strong>Improved Media Player:</strong> Experience a smoother media playback with our
          enhanced media player. Now featuring closed captioning and tap-to-mute functionality
          across all journeys and series introductions. Additionally, you can easily tap to seek and
          enjoy a more consistent visual style.
        </Text>
        <Text style={body1}>
          3. <strong>Enhanced Transitions:</strong> Enjoy seamless transitions between series
          listings, introductions, and details for a more immersive browsing experience.
        </Text>
        <Container style={ctaContainer}>
          <Link
            style={cta}
            href="https://oseh.io?utm_source=oseh.io&utm_medium=email&utm_campaign=oseh302_launch&utm_content=topbtn_04172024">
            Let{RIGHT_SINGLE_QUOTE}s Go
          </Link>
        </Container>
      </Section>
      <CommunitySection unsubscribeUrl={unsubscribeUrl} wide />
    </Body>
  </Html>
);

const EmailLaunchAnnouncementPlain = ({ unsubscribeUrl }: EmailLaunchAnnouncementProps) =>
  `It${RIGHT_SINGLE_QUOTE}s Time for Your Mindful Moment\n` +
  `We are excited to announce that Oseh 3.0.2 is now available. This update brings several enhancements to enrich your experience with Oseh. Here${RIGHT_SINGLE_QUOTE}s what you can expect:\n` +
  '1. Personalized Insights: Enjoy curated mindfulness tips, quotes, and personalized encouragement right on your home screen. These insights are designed to spark thoughtful moments and support your journey towards your goals.\n' +
  '2. Improved Media Player: Experience a smoother media playback with our enhanced media player. Now featuring closed captioning and tap-to-mute functionality across all journeys and series introductions. Additionally, you can easily tap to seek and enjoy a more consistent visual style.\n' +
  '3. Enhanced Transitions: Enjoy seamless transitions between series listings, introductions, and details for a more immersive browsing experience.\n' +
  '\n' +
  'Try it Now: https://oseh.io?utm_source=oseh.io&utm_medium=email&utm_campaign=oseh302_launch&utm_content=plain_04172024\n\n' +
  'iOS App Store: https://apps.apple.com/app/apple-store/id6453520882\n\n' +
  'Google Play Store: https://play.google.com/store/apps/details?id=com.oseh.frontendapp\n\n' +
  `Unsubscribe: ${unsubscribeUrl}\n`;

export const EmailOseh302AnnouncementRoute: EmailRoute =
  simpleEmailRoute<EmailLaunchAnnouncementProps>({
    slug: 'emailOseh302Announcement',
    summary: 'The announcement email for Oseh 3.0.2',
    description: 'Informs a user that Oseh 3.0.2 is now publicly available',
    schema: s.object({
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
        return EmailLaunchAnnouncementPlain(props);
      }

      return render(<EmailLaunchAnnouncement {...props} />);
    },
  });

const main = {
  backgroundColor: '#ffffff',
  width: '100%',
  padding: '0',
  margin: '0',
};

const wideSection = {
  maxWidth: '714px',
  margin: '0 auto',
};

const ctaContainer = {
  textAlign: 'left',
  padding: '32px 0 80px 0',
} as const;

const par0 = {
  ...wideSection,
  backgroundColor: '#191C1D',
  paddingTop: '48px',
  paddingLeft: '66px',
  paddingRight: '66px',
};

const title1 = {
  fontWeight: 600,
  fontSize: '28px',
  lineHeight: '39.2px',
  color: '#eaeaeb',
};

const body = {
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '24px',
  color: '#eaeaeb',
};

const body1 = {
  ...body,
  paddingTop: '8px',
};

const logoContainer = {
  ...wideSection,
  backgroundColor: '#191C1D',
  padding: '40px 0 24px 0',
};

const logo = {
  margin: '0 auto',
  width: '75px',
  height: '17.5px',
};

const logoSeparatorContainer = {
  ...wideSection,
  backgroundColor: '#191C1D',
  padding: '0 16px',
};

const logoSeparator = {
  color: '#ffffff',
};

export default EmailLaunchAnnouncement;
