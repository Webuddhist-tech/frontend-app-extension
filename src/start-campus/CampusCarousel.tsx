import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getHttpClient } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useQuery } from '@tanstack/react-query';
import {
  CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';

import messages from './messages';

interface Partner {
  partnerName: string;
  logo: string | null;
  slug: string | null;
}

const MAX_LOGOS_PER_VIEW = 4;
const BUFFER = 1;
const SLIDE_MS = 400;
const mod = (n: number, m: number) => ((n % m) + m) % m;

const fetchPartners = async (): Promise<Partner[]> => {
  const { data } = await getHttpClient().get(`${getConfig().LMS_BASE_URL}/api/partners/homepage/`);
  return camelCaseObject(Array.isArray(data) ? data : []);
};

const usableLogos = (partners: Partner[]) => {
  const logos = new Map<string, Partner>();
  partners.forEach((partner) => {
    if (partner.logo && !logos.has(partner.logo)) {
      logos.set(partner.logo, partner);
    }
  });
  return Array.from(logos.values());
};

const CampusCarousel = () => {
  const intl = useIntl();
  const { data, isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: fetchPartners,
    staleTime: 5 * 60 * 1000,
  });
  const partners = useMemo(() => usableLogos(data ?? []), [data]);
  const [startIndex, setStartIndex] = useState(0);
  const [shift, setShift] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shift === 0) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setStartIndex(current => current + shift);
      setShift(0);
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [shift]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    track.style.transition = 'none';
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    track.offsetWidth;
    track.style.transition = '';
  }, [startIndex]);

  if (!isLoading && partners.length === 0) {
    return null;
  }

  const canScroll = partners.length > 1;
  const windowSize = canScroll ? MAX_LOGOS_PER_VIEW + BUFFER * 2 : partners.length;
  const offsetSteps = canScroll ? BUFFER + shift : 0;
  const slots = Array.from({ length: windowSize }, (_unused, index) => {
    const partnerIndex = canScroll ? startIndex - BUFFER + index : index;
    return { index: partnerIndex, partner: partners[mod(partnerIndex, partners.length)] };
  });
  const move = (direction: number) => shift === 0 && setShift(direction);

  return (
    <section
      className="partner-carousel"
      role="group"
      aria-roledescription="carousel"
      aria-labelledby="campus-carousel-title"
      style={{
        '--pc-window': `${windowSize}`,
        '--pc-duration': `${SLIDE_MS}ms`,
      } as CSSProperties}
    >
      <p id="campus-carousel-title" className="partner-carousel__title">
        {intl.formatMessage(messages.campusesTitle)}
      </p>
      <div className="partner-carousel__row">
        {!isLoading && (
          <>
            {canScroll && (
              <button
                type="button"
                className="partner-carousel__arrow"
                aria-label={intl.formatMessage(messages.previousCampuses)}
                onClick={() => move(-1)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            <div className="partner-carousel__viewport">
              <div
                className="partner-carousel__track"
                ref={trackRef}
                style={{ transform: `translateX(calc(-100% * ${offsetSteps} / ${windowSize}))` }}
              >
                {slots.map(({ index, partner }) => {
                  const logo = <img className="partner-carousel__logo" src={partner.logo as string} alt={partner.partnerName} />;
                  return partner.slug ? (
                    <a
                      key={index}
                      className="partner-carousel__item"
                      href={`${getConfig().LMS_BASE_URL}/schools/${partner.slug}/`}
                    >
                      {logo}
                    </a>
                  ) : <span key={index} className="partner-carousel__item">{logo}</span>;
                })}
              </div>
            </div>
            {canScroll && (
              <button
                type="button"
                className="partner-carousel__arrow"
                aria-label={intl.formatMessage(messages.nextCampuses)}
                onClick={() => move(1)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CampusCarousel;
