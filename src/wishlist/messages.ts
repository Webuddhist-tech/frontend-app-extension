import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  pageTitle: {
    id: 'extension.wishlist.pageTitle',
    defaultMessage: 'Wishlist',
    description: 'Wishlist page title.',
  },
  heading: {
    id: 'extension.wishlist.heading',
    defaultMessage: 'My <em>wishlist</em>',
    description: 'Heading of the wishlist page.',
  },
  eyebrow: {
    id: 'extension.wishlist.eyebrow',
    defaultMessage: 'Saved for later',
    description: 'Small label above the wishlist page title.',
  },
  savedCourseCount: {
    id: 'extension.wishlist.savedCourseCount',
    defaultMessage: '{count, plural, one {# course saved} other {# courses saved}}',
    description: 'Number of courses saved in the wishlist.',
  },
  loading: {
    id: 'extension.wishlist.loading',
    defaultMessage: 'Loading your wishlist…',
    description: 'Accessible text shown while the wishlist is loading.',
  },
  loadError: {
    id: 'extension.wishlist.loadError',
    defaultMessage: 'We could not load your wishlist. Please try again.',
    description: 'Error shown when the wishlist cannot be loaded.',
  },
  retry: {
    id: 'extension.wishlist.retry',
    defaultMessage: 'Try again',
    description: 'Button label for retrying a failed wishlist request.',
  },
  empty: {
    id: 'extension.wishlist.empty',
    defaultMessage: 'You have no courses in your wishlist.',
    description: 'Message shown when the wishlist is empty.',
  },
  emptyDescription: {
    id: 'extension.wishlist.emptyDescription',
    defaultMessage: 'Save the courses you would like to study later, and they will wait for you here.',
    description: 'Explanation shown when the wishlist is empty.',
  },
  exploreCourses: {
    id: 'extension.wishlist.exploreCourses',
    defaultMessage: 'Explore courses',
    description: 'Link to browse courses from an empty wishlist.',
  },
  courseImage: {
    id: 'extension.wishlist.courseImage',
    defaultMessage: '{courseTitle} cover image',
    description: 'Alternative text for a wishlisted course image.',
  },
  openCourse: {
    id: 'extension.wishlist.openCourse',
    defaultMessage: 'View course',
    description: 'Link to open a wishlisted course.',
  },
  startDate: {
    id: 'extension.wishlist.startDate',
    defaultMessage: 'Starts {startDate}',
    description: 'Course start date shown on a wishlist card.',
  },
  removing: {
    id: 'extension.wishlist.removing',
    defaultMessage: 'Removing…',
    description: 'Button text while a course is being removed.',
  },
  removeCourse: {
    id: 'extension.wishlist.removeCourse',
    defaultMessage: 'Remove {courseTitle} from wishlist',
    description: 'Accessible label for removing one course from the wishlist.',
  },
  removeError: {
    id: 'extension.wishlist.removeError',
    defaultMessage: 'We could not remove that course. Please try again.',
    description: 'Error shown when removing a course fails.',
  },
  paginationLabel: {
    id: 'extension.wishlist.paginationLabel',
    defaultMessage: 'Wishlist',
    description: 'Accessible label for wishlist pagination.',
  },
});

export default messages;
