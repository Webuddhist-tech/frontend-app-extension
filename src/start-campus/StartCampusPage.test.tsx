import { getConfig } from '@edx/frontend-platform';
import { getHttpClient } from '@edx/frontend-platform/auth';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import StartCampusPage from './StartCampusPage';
import { submitCampusForm } from './api';

jest.mock('@edx/frontend-platform', () => ({
  camelCaseObject: jest.fn(value => value),
  getConfig: jest.fn(),
}));

jest.mock('@edx/frontend-platform/auth', () => ({
  getHttpClient: jest.fn(),
}));

jest.mock('./api', () => ({
  submitCampusForm: jest.fn(),
}));

it('renders the start campus layout and handles its contact form', async () => {
  (getConfig as jest.Mock).mockReturnValue({
    LMS_BASE_URL: 'https://lms.example.com',
    SITE_NAME: 'WeBuddhist Academy',
  });
  (getHttpClient as jest.Mock).mockReturnValue({
    get: jest.fn().mockResolvedValue({
      data: [
        { partnerName: 'BDRC', logo: 'https://example.com/bdrc.png', slug: 'bdrc' },
        { partnerName: 'Palpung', logo: 'https://example.com/palpung.png', slug: 'palpung' },
      ],
    }),
  });
  (submitCampusForm as jest.Mock).mockResolvedValue({
    success: true,
    message: 'Thank you! We will contact you soon.',
  });
  const user = userEvent.setup();

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        <StartCampusPage />
      </IntlProvider>
    </QueryClientProvider>,
  );

  expect(screen.getByRole('heading', { name: 'Start a campus' })).not.toBeNull();
  expect(screen.getByText('Campuses')).not.toBeNull();
  expect(await screen.findByRole('button', { name: 'Next campuses' })).not.toBeNull();
  expect(screen.getAllByRole('img', { name: 'BDRC' })).not.toHaveLength(0);

  await user.type(screen.getByLabelText('Full name'), 'Tenzin Dorjee');
  await user.type(screen.getByLabelText('Work email'), 'tenzin@example.com');
  await user.type(screen.getByLabelText('Organization name'), 'Dharma Centre');
  await user.type(screen.getByLabelText('A short description of your organization'), 'Buddhist education');
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  expect((await screen.findByRole('status')).textContent).toBe('Thank you! We will contact you soon.');
  const submittedData = (submitCampusForm as jest.Mock).mock.calls[0][0] as FormData;
  expect(submittedData.get('name')).toBe('Tenzin Dorjee');
  expect(submittedData.get('organization_description')).toBe('Buddhist education');
});
