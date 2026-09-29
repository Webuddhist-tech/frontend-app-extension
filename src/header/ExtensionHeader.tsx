import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import Header from '@edx/frontend-component-header';
import { useLocation } from 'react-router-dom';

import wishlistMessages from '../wishlist/messages';
import messages from './messages';

const ExtensionHeader = () => {
  const config = getConfig();
  const intl = useIntl();
  const location = useLocation();

  const mainMenuItems = [
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/dashboard`,
      content: intl.formatMessage(messages.dashboard),
      iconName: 'dashboard',
    },
    ...(config.ENABLE_PROGRAMS ? [{
      type: 'item',
      href: `${config.LMS_BASE_URL}/dashboard/programs`,
      content: intl.formatMessage(messages.programs),
      iconName: 'programs',
    }] : []),
    ...(!config.NON_BROWSABLE_COURSES ? [{
      type: 'item',
      href: `${config.LMS_BASE_URL}/courses`,
      content: intl.formatMessage(messages.discoverNew),
      iconName: 'discover',
    }] : []),
    {
      type: 'item',
      href: `${config.EXTENSION_BASE_URL}/wishlist`,
      content: intl.formatMessage(wishlistMessages.pageTitle),
      isActive: location.pathname === '/wishlist',
      iconName: 'wishlist',
    },
  ];

  return <Header mainMenuItems={mainMenuItems} />;
};

export default ExtensionHeader;
