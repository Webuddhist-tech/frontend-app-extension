import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  message: {
    id: 'extension.notFound.message',
    defaultMessage: 'The page you\'re looking for is unavailable or there\'s an error in the URL. Please check the URL and try again.',
    description: 'Message shown when an Extension MFE page does not exist.',
  },
});

export default messages;
