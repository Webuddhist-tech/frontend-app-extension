import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert,
  breakpoints,
  Button,
  Container,
  Icon,
  IconButton,
  Pagination,
  Spinner,
  useWindowSize,
} from '@openedx/paragon';
import { Search } from '@openedx/paragon/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReactNode, SVGProps, useState } from 'react';

import Head from '../Head';
import {
  fetchWishlist, removeFromWishlist, WishlistPageData,
} from './api';
import messages from './messages';
import wishlistEmptyImage from './assets/empty-wishlist.svg';

const WISHLIST_PAGE_SIZE = 5;

const getLmsUrl = (path: string) => new URL(path, getConfig().LMS_BASE_URL).toString();
const emphasize = (chunks: ReactNode[]) => <em>{chunks}</em>;

const DeleteAccountIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

const WishlistPage = () => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const { width } = useWindowSize();
  const [page, setPage] = useState(1);
  const {
    data: wishlist, isError, isPending, refetch,
  } = useQuery({
    queryKey: ['wishlist', page],
    queryFn: () => fetchWishlist(page),
  });
  const removeWishlistItem = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: (_data, courseId) => {
      queryClient.setQueryData<WishlistPageData>(['wishlist', page], current => current && ({
        ...current,
        count: current.count - 1,
        results: current.results.filter(item => item.courseId !== courseId),
      }));

      const remainingPages = Math.ceil(((wishlist?.count ?? 1) - 1) / WISHLIST_PAGE_SIZE);
      if (page > Math.max(remainingPages, 1)) {
        setPage(page - 1);
      }
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const items = wishlist?.results ?? [];
  const pageCount = Math.ceil((wishlist?.count ?? 0) / WISHLIST_PAGE_SIZE);
  const isPaginationCollapsed = width !== undefined
    && breakpoints.medium.maxWidth !== undefined
    && width < breakpoints.medium.maxWidth;

  return (
    <>
      <Head title={intl.formatMessage(messages.pageTitle)} />
      <Container size="xl" className="wishlist-page">
        <header className="wishlist-page__header">
          <div className="wishlist-page__eyebrow">
            <span aria-hidden="true" />
            {intl.formatMessage(messages.eyebrow)}
          </div>
          <h1>
            {intl.formatMessage(messages.heading, { em: emphasize })}
          </h1>
          {wishlist && wishlist.count > 0 && (
            <p>{intl.formatMessage(messages.savedCourseCount, { count: wishlist.count })}</p>
          )}
        </header>

        <section className="wishlist-page__content" aria-live="polite">
          {isPending && (
            <div className="wishlist-page__status" role="status">
              <Spinner animation="border" className="mr-3" />
              {intl.formatMessage(messages.loading)}
            </div>
          )}

          {isError && (
            <Alert
              variant="danger"
              actions={[
                <Button key="retry" variant="outline-danger" onClick={() => refetch()}>
                  {intl.formatMessage(messages.retry)}
                </Button>,
              ]}
            >
              {intl.formatMessage(messages.loadError)}
            </Alert>
          )}

          {removeWishlistItem.isError && (
            <Alert variant="danger">{intl.formatMessage(messages.removeError)}</Alert>
          )}

          {!isPending && !isError && items.length === 0 && (
            <div className="wishlist-empty">
              <img className="wishlist-empty__illustration" src={wishlistEmptyImage} alt="" />
              <h2>{intl.formatMessage(messages.empty)}</h2>
              <p>{intl.formatMessage(messages.emptyDescription)}</p>
              <Button
                variant="brand"
                as="a"
                href={getLmsUrl('/courses')}
                iconBefore={Search}
                className="wishlist-empty__explore"
              >
                {intl.formatMessage(messages.exploreCourses)}
              </Button>
            </div>
          )}

          {!isPending && !isError && items.length > 0 && (
            <>
              <div className="wishlist-list">
                {items.map(item => {
                  const courseUrl = getLmsUrl(`/courses/${item.courseId}/about`);
                  const isRemoving = removeWishlistItem.isPending
                    && removeWishlistItem.variables === item.courseId;
                  const startDate = item.advertisedStart || (item.start && intl.formatDate(item.start, {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }));

                  return (
                    <article className="wishlist-card" key={item.courseId}>
                      <div className="wishlist-card__image">
                        {item.imageUrl && (
                          <img
                            src={getLmsUrl(item.imageUrl)}
                            alt={intl.formatMessage(messages.courseImage, { courseTitle: item.title })}
                          />
                        )}
                      </div>
                      <div className="wishlist-card__details">
                        <a className="wishlist-card__title" href={courseUrl}>{item.title}</a>
                        <p className="wishlist-card__org">{item.org}</p>
                        {startDate && (
                          <p className="wishlist-card__start">
                            {intl.formatMessage(messages.startDate, { startDate })}
                          </p>
                        )}
                      </div>
                      <div className="wishlist-card__actions">
                        <IconButton
                          src={DeleteAccountIcon}
                          iconAs={Icon}
                          alt={intl.formatMessage(messages.removeCourse, { courseTitle: item.title })}
                          className="wishlist-card__remove"
                          disabled={removeWishlistItem.isPending}
                          onClick={() => removeWishlistItem.mutate(item.courseId)}
                        />
                        <Button as="a" href={courseUrl} className="wishlist-card__open">
                          {intl.formatMessage(messages.openCourse)}
                        </Button>
                        {isRemoving && <span className="sr-only">{intl.formatMessage(messages.removing)}</span>}
                      </div>
                    </article>
                  );
                })}
              </div>

              {pageCount > 1 && (
                <Pagination
                  variant={isPaginationCollapsed ? 'reduced' : 'secondary'}
                  paginationLabel={intl.formatMessage(messages.paginationLabel)}
                  className="wishlist-pagination"
                  pageCount={pageCount}
                  currentPage={page}
                  onPageSelect={setPage}
                />
              )}
            </>
          )}
        </section>
      </Container>
    </>
  );
};

export default WishlistPage;
