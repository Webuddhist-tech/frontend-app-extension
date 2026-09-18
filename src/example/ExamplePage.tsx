import { Container } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

const ExamplePage = () => {
  const intl = useIntl();

  return (
    <main>
      <Container className="py-5">
        <h1>{intl.formatMessage(messages.title)}</h1>
        <p>{intl.formatMessage(messages.greeting)}</p>
      </Container>
    </main>
  );
};

export default ExamplePage;
