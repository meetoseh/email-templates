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
  preview: string;
  message: string;
  url: string;
  streak: string;
  goalBadgeUrl: string;
  goal: string;
  quote: string;
  quoteAuthor: string;
  unsubscribeUrl: string;
};

const DailyReminder = ({
  preview = 'It’s time for your mindful moment.',
  message = "The perfect moment for mindfulness? It's now. Let this be your sign to return. It's never too late for your practice.",
  url = 'https://oseh.io#url',
  streak = '7 days',
  goalBadgeUrl = 'https://oseh.io/goalBadge/4of6-192h.png',
  goal = '4 of 6',
  quote = "Mindfulness isn't difficult; we just need to remember to do it.",
  quoteAuthor = 'Sharon Salzberg',
  unsubscribeUrl = 'https://oseh.io#unsubscribeUrl',
}: DailyReminderProps) => (
  <Html>
    <Head>
      <OpenSansFont weights={[300, 400, 600]} italicWeights={[]} />
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
      .gradientBackgroundWithFallback {
        backgroundColor: #0C0C0C;
        background: #0C0C0C;
        background: linear-gradient(180deg, rgb(25, 28, 29) 66.5%, rgb(15, 16, 16) 82%, #0C0C0C 100%);
      }
    `}</style>
    </Head>
    <Preview>{preview}</Preview>
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
      <Section style={par0} className="horizontalPadding gradientBackgroundWithFallback">
        <Text style={title1}>
          <SmartQuotesText>{message}</SmartQuotesText>
        </Text>
        <Container style={ctaContainer}>
          <Link style={cta} href={url}>
            Practice Now
          </Link>
        </Container>
      </Section>
      <Section style={streakAndQuote} className="horizontalPadding">
        <Row>
          <Column>
            <Container style={{ margin: '0 auto', width: 'auto' }}>
              <Text style={label1}>Streak</Text>
              <Text style={value1}>{streak}</Text>
            </Container>
          </Column>
          <Column>
            <Img
              alt="Goal Badge"
              src={goalBadgeUrl}
              style={{ height: '96px', marginLeft: 'auto', marginRight: 'auto' }}
            />
          </Column>
          <Column>
            <Container style={{ margin: '0 auto', width: 'auto' }}>
              <Text style={label1}>Goal</Text>
              <Text style={value1}>{goal}</Text>
            </Container>
          </Column>
        </Row>
        <Text style={quote1}>
          “<SmartQuotesText>{quote}</SmartQuotesText>” — {quoteAuthor}
        </Text>
      </Section>
      <CommunitySection unsubscribeUrl={unsubscribeUrl} wide />
    </Body>
  </Html>
);

const DailyReminderPlain = ({
  message = "The perfect moment for mindfulness? It's now. Let this be your sign to return. It's never too late for your practice.",
  url = 'https://oseh.io#url',
  streak = '7 days',
  goalBadgeUrl = 'https://oseh.io/goalBadge/4of6-192h.png',
  goal = '4 of 6',
  quote = "Mindfulness isn't difficult; we just need to remember to do it.",
  quoteAuthor = 'Sharon Salzberg',
  unsubscribeUrl = 'https://oseh.io#unsubscribeUrl',
}: DailyReminderProps) =>
  `${message}\n\nPractice Now: ${url}\n\nStreak: ${streak}\nGoal: ${goal}\n\n"${quote}" - ${quoteAuthor}\n\nUnsubscribe: ${unsubscribeUrl}`;

export const DailyReminderRoute2: EmailRoute = simpleEmailRoute<DailyReminderProps>({
  slug: 'dailyReminder2',
  summary: 'A template for short reminder messages',
  description:
    'The second version of the daily reminder email.\n' +
    'Logo, message, CTA, streak and goal row, quote, footer.\n\n' +
    /* Its not true that these are available in the _template_, but they are available in the touch points
       that use this template. By the time we receive anything, it will have already been replaced */
    'Available substitutions: {name}, {goal}, {streak}, {goal_badge_url}, {time_of_day}, {url}, {unsubscribe_url}',
  schema: s.object({
    preview: s.string({
      title: 'Preview',
      description: 'The preview text, which is shown before you open the email.',
      example: 'It’s time for your mindful moment.',
    }),
    message: s.string({
      title: 'Message',
      description: 'The big message above the CTA. Quotes are auto-converted to smart quotes.',
      example:
        "The perfect moment for mindfulness? It's now. Let this be your sign to return. It's never too late for your practice.",
    }),
    url: s.string(
      {
        title: 'URL',
        description:
          'The URL to send the user to when they click the button. Usually filled dynamically via {url}',
        example: '{url}',
      },
      { maxLength: 2048 }
    ),
    streak: s.string({
      title: 'Streak',
      description: 'The text to show below "Streak". Usually filled dynamically via {streak}',
      example: '{streak}',
    }),
    goalBadgeUrl: s.string({
      title: 'Goal Badge URL',
      description:
        'The URL of the badge image to show next to the streak and goal. Usually filled dynamically via {goal_badge_url}',
      example: '{goal_badge_url}',
    }),
    goal: s.string({
      title: 'Goal',
      description: 'The text to show below "Goal". Usually filled dynamically via {goal}',
      example: '{goal}',
    }),
    quote: s.string({
      title: 'Quote',
      description:
        'The quote to show below the streak and goal. Do not surround in quotes. Single quotes are converted to smart quotes.',
      example: "Mindfulness isn't difficult; we just need to remember to do it.",
    }),
    quoteAuthor: s.string({
      title: 'Quote Author',
      description: 'The author of the quote',
      example: 'Sharon Salzberg',
    }),
    unsubscribeUrl: s.string(
      {
        title: 'Unsubscribe URL',
        description:
          'The URL to send the user to when they click the unsubscribe link. Usually autofilled via {unsubscribe_url}',
        example: '{unsubscribe_url}',
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
  width: '100%',
  padding: '0',
  margin: '0',
};

const wideSection = {
  maxWidth: '714px',
  margin: '0 auto',
};

const par0 = {
  ...wideSection,
  paddingTop: '0px',
  paddingLeft: '80px',
  paddingRight: '80px',
  paddingBottom: '48px',
};

const title1 = {
  fontWeight: 400,
  fontSize: '26px',
  lineHeight: '33.6px',
  textAlign: 'center',
  color: '#FFFFFF',
} as const;

const ctaContainer = {
  width: '100%',
  textAlign: 'center',
  padding: '48px 0 16px 0',
} as const;

const cta = {
  backgroundColor: '#ffffff',
  fontWeight: 400,
  color: '#000000',
  padding: '16px 80px',
  borderRadius: '100px',
  fontSize: '16px',
} as const;

const streakAndQuote = {
  ...wideSection,
  paddingTop: '56px',
  paddingLeft: '80px',
  paddingRight: '80px',
  paddingBottom: '48px',
  backgroundColor: '#191C1D',
};

const label1 = {
  fontSize: '20px',
  fontWeight: 300,
  lineHeight: '31px',
  textAlign: 'left',
  color: '#ffffff',
  margin: '0',
} as const;

const value1 = {
  fontSize: '20px',
  fontWeight: 400,
  lineHeight: '31px',
  textAlign: 'left',
  color: '#ffffff',
  margin: '0',
} as const;

const quote1 = {
  fontSize: '18px',
  fontWeight: 300,
  lineHeight: '22px',
  textAlign: 'center',
  color: '#ffffff',
  margin: '64px 0 0 0',
} as const;

const logoContainer = {
  ...wideSection,
  backgroundColor: '#191C1D',
  padding: '40px 0 40px 0',
};

const logo = {
  margin: '0 auto',
  width: '63px',
  height: '14.7px',
};
