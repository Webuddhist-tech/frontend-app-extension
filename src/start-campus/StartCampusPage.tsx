import { useIntl } from '@edx/frontend-platform/i18n';
import {
  FormEvent, ReactNode, useState,
} from 'react';

import Head from '../Head';
import ctaImage from './assets/start-a-campus-cta.png';
import heroImage from './assets/start-a-campus-hero.png';
import { submitCampusForm } from './api';
import CampusCarousel from './CampusCarousel';
import messages from './messages';

const emphasize = (chunks: ReactNode[]) => <em>{chunks}</em>;

const StartCampusPage = () => {
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; success: boolean }>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setFeedback(undefined);
    setFieldErrors({});

    try {
      const response = await submitCampusForm(new FormData(form));
      setFeedback({ message: response.message, success: response.success });
      setFieldErrors(response.errors ?? {});
      if (response.success) {
        form.reset();
      }
    } catch {
      setFeedback({ message: intl.formatMessage(messages.formError), success: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="course-partner-page">
      <Head title={intl.formatMessage(messages.pageTitle)} />

      <section className="course-partner-hero">
        <img className="course-partner-hero__image" src={heroImage} alt="" />
        <div className="course-partner-hero__scrim" />
        <div className="course-partner-hero__inner">
          <h1>{intl.formatMessage(messages.heroTitle)}</h1>
          <p>{intl.formatMessage(messages.heroDescription)}</p>
        </div>
      </section>

      <section className="course-partner-body">
        <div className="course-partner-overview">
          <h2>{intl.formatMessage(messages.heading)}</h2>
          <p className="course-partner-overview__intro">{intl.formatMessage(messages.introduction)}</p>

          <div className="course-partner-benefits">
            <article className="course-partner-benefit">
              <span className="course-partner-benefit__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v14a1.6 1.6 0 0 0-1.6-1.6H5.5A1.5 1.5 0 0 1 4 16.9V5.5Z" />
                  <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v14a1.6 1.6 0 0 1 1.6-1.6h4.9A1.5 1.5 0 0 0 20 16.9V5.5Z" />
                </svg>
              </span>
              <div>
                <h3>{intl.formatMessage(messages.preservationTitle)}</h3>
                <p>{intl.formatMessage(messages.preservationDescription)}</p>
              </div>
            </article>

            <article className="course-partner-benefit">
              <span className="course-partner-benefit__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5Z" />
                </svg>
              </span>
              <div>
                <h3>{intl.formatMessage(messages.reachTitle)}</h3>
                <p>{intl.formatMessage(messages.reachDescription)}</p>
              </div>
            </article>

            <article className="course-partner-benefit">
              <span className="course-partner-benefit__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3.5" y="4" width="17" height="6" rx="1.6" />
                  <rect x="3.5" y="14" width="17" height="6" rx="1.6" />
                  <path d="M7 7h.01M7 17h.01" />
                </svg>
              </span>
              <div>
                <h3>{intl.formatMessage(messages.infrastructureTitle)}</h3>
                <p>{intl.formatMessage(messages.infrastructureDescription)}</p>
              </div>
            </article>
          </div>
        </div>

        <div id="apply" className="course-partner-form-card">
          <h2>{intl.formatMessage(messages.contact)}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              <span className="sr-only">{intl.formatMessage(messages.fullName)}</span>
              <input
                required
                name="name"
                maxLength={100}
                autoComplete="name"
                placeholder={intl.formatMessage(messages.fullName)}
                className={fieldErrors.name ? 'is-invalid' : undefined}
              />
              {fieldErrors.name && <span className="course-partner-form-card__error">{fieldErrors.name.join(', ')}</span>}
            </label>
            <label>
              <span className="sr-only">{intl.formatMessage(messages.workEmail)}</span>
              <input
                required
                type="email"
                name="email"
                maxLength={254}
                autoComplete="email"
                placeholder={intl.formatMessage(messages.workEmail)}
                className={fieldErrors.email ? 'is-invalid' : undefined}
              />
              {fieldErrors.email && <span className="course-partner-form-card__error">{fieldErrors.email.join(', ')}</span>}
            </label>
            <label>
              <span className="sr-only">{intl.formatMessage(messages.organizationName)}</span>
              <input
                required
                name="organization"
                maxLength={200}
                autoComplete="organization"
                placeholder={intl.formatMessage(messages.organizationName)}
                className={fieldErrors.organization ? 'is-invalid' : undefined}
              />
              {fieldErrors.organization && (
                <span className="course-partner-form-card__error">{fieldErrors.organization.join(', ')}</span>
              )}
            </label>
            <label className="course-partner-form-card__description">
              <span className="sr-only">{intl.formatMessage(messages.organizationDescription)}</span>
              <textarea
                name="organization_description"
                maxLength={1000}
                rows={5}
                placeholder={intl.formatMessage(messages.organizationDescription)}
                className={fieldErrors.organization_description ? 'is-invalid' : undefined}
              />
              {fieldErrors.organization_description && (
                <span className="course-partner-form-card__error">
                  {fieldErrors.organization_description.join(', ')}
                </span>
              )}
            </label>
            <button type="submit" disabled={isSubmitting}>
              {intl.formatMessage(isSubmitting ? messages.submitting : messages.submit)}
            </button>
            {feedback && (
              <p className={feedback.success ? 'is-success' : 'is-error'} role="status">
                {feedback.message}
              </p>
            )}
          </form>
        </div>
      </section>

      <CampusCarousel />

      <section className="course-partner-cta">
        <div className="course-partner-cta__inner">
          <div className="course-partner-cta__media">
            <img className="course-partner-cta__image" src={ctaImage} alt="" />
          </div>
          <div className="course-partner-cta__content">
            <h2>
              {intl.formatMessage(messages.ctaTitle, { em: emphasize })}
            </h2>
            <p>{intl.formatMessage(messages.ctaDescription)}</p>
            <a href="#apply">{intl.formatMessage(messages.contact)}</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StartCampusPage;
