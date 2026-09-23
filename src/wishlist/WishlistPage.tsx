import { useIntl } from '@edx/frontend-platform/i18n';

import Head from '../Head';
import messages from './messages';

const WishlistPage = () => {
  const intl = useIntl();

  return (
    <>
      <Head title={intl.formatMessage(messages.pageTitle)} />
      <div data-testid="wishlist-page" />
    </>
  );
};

export default WishlistPage;
