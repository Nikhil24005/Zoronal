import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCompanyById } from '../api/companyApi';
import { addReview, getReviewsByCompany, likeReview } from '../api/reviewApi';
import StarRating from '../components/StarRating';

const sortOptions = [
  { label: 'Latest', value: 'latest' },
  { label: 'Highest Rating', value: 'highest' },
  { label: 'Most Relevant', value: 'relevance' },
];

const initialFormState = {
  fullName: '',
  subject: '',
  reviewText: '',
  rating: 0,
};

function CompanyDetailPage() {
  const { id } = useParams();
  const reviewFormRef = useRef(null);
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [sortValue, setSortValue] = useState('date');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewLimit] = useState(5);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadCompany() {
      try {
        setCompanyLoading(true);
        const response = await getCompanyById(id);

        if (isActive) {
          setCompany(response?.data ?? null);
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(error?.response?.data?.message || 'Unable to load company details.');
          setCompany(null);
        }
      } finally {
        if (isActive) {
          setCompanyLoading(false);
        }
      }
    }

    loadCompany();

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    let isActive = true;

    async function loadReviews() {
      try {
        setReviewsLoading(true);
        setErrorMessage('');
        const response = await getReviewsByCompany(id, sortValue, reviewPage, reviewLimit);

        if (isActive) {
          setReviews(Array.isArray(response?.data) ? response.data : []);
          setAverageRating(Number(response?.averageRating || 0));
          setReviewTotalPages(response?.meta?.totalPages || 1);
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(error?.response?.data?.message || 'Unable to load reviews.');
          setReviews([]);
          setAverageRating(0);
        }
      } finally {
        if (isActive) {
          setReviewsLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      isActive = false;
    };
  }, [id, sortValue, reviewPage, reviewLimit]);

  const reviewCount = reviews.length;

  const averageDisplay = useMemo(() => {
    return Number.isFinite(averageRating) ? averageRating.toFixed(1) : '0.0';
  }, [averageRating]);

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === 'rating' ? Number(value) : value,
    }));
  }

  function scrollToReviewForm() {
    reviewFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();

    const nextErrors = validateReviewForm(formData);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setSuccessMessage('');

    try {
      await addReview({
        company: id,
        ...formData,
      });

      setFormData(initialFormState);
      setSuccessMessage('Your review has been posted.');
      // refresh reviews (go to first page)
      setReviewPage(1);
      const response = await getReviewsByCompany(id, sortValue, 1, reviewLimit);
      setReviews(Array.isArray(response?.data) ? response.data : []);
      setAverageRating(Number(response?.averageRating || 0));
    } catch (error) {
      setSuccessMessage('');
      setFormErrors({ submit: error?.response?.data?.message || 'Unable to submit review. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (companyLoading) {
    return <CompanyDetailSkeleton />;
  }

  if (errorMessage && !company) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-red-700 shadow-soft">
          <h1 className="text-2xl font-bold text-red-900">Company not available</h1>
          <p className="mt-3 text-sm leading-6">{errorMessage}</p>
          <Link
            to="/companies"
            className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to companies
          </Link>
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-soft">
        <div className="px-4 py-5 sm:px-8 sm:py-6">
          <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-slate-100 sm:h-20 sm:w-20">
                {company.logo ? (
                  <img src={company.logo} alt={`${company.name} logo`} className="h-full w-full object-cover" />
                ) : (
                  <BuildingIcon />
                )}
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{company.name}</h1>
                <p className="mt-2 text-sm text-slate-500">{company.location || company.city}</p>

                <div className="mt-4 flex items-center justify-center gap-3 text-sm text-slate-700 sm:justify-start">
                  <span className="font-semibold text-slate-900">{averageDisplay}</span>
                  <StarRating value={Math.round(averageRating)} size="sm" />
                  <span className="font-semibold text-slate-900">{reviewCount} Reviews</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-end sm:gap-4 md:ml-auto">
              <div className="text-center text-xs text-slate-500 sm:text-right">
                <div className="uppercase tracking-wide">{company.createdAt ? 'Founded on' : 'Reg. Date'}</div>
                <div className="mt-1">{formatDate(company.foundedOn)}</div>
              </div>

              <button
                type="button"
                onClick={scrollToReviewForm}
                className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(124,58,237,0.9)] sm:w-auto sm:rounded-md sm:px-4 sm:py-2"
              >
                + Add Review
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-4 sm:space-y-10 sm:p-8">
          <section className="grid gap-4 lg:grid-cols-[1.3fr,0.7fr]">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-bold text-ink">About this company</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {company.description || 'No description provided.'}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Summary</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <SummaryRow label="City" value={company.city} />
                <SummaryRow label="Location" value={company.location} />
                <SummaryRow label="Founded" value={formatDate(company.foundedOn)} />
              </div>
              <button
                type="button"
                onClick={scrollToReviewForm}
                className="mt-6 w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Write a Review
              </button>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink sm:text-2xl">Reviews</h2>
                <p className="mt-1 text-sm text-slate-500">Sort and browse feedback from customers and visitors.</p>
              </div>

              <div className="w-full sm:w-auto">
                <label htmlFor="review-sort" className="mb-2 block text-sm font-semibold text-ink">
                  Sort by
                </label>
                <select
                  id="review-sort"
                  value={sortValue}
                  onChange={(event) => setSortValue(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15 sm:w-64"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <ReviewSkeleton key={index} />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="text-xl font-bold text-ink">No reviews yet</p>
                <p className="mt-2 text-sm text-slate-500">Be the first to write a review for this company.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <article
                      key={review._id}
                      className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] sm:p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <img src={review.avatar || '/default-avatar.png'} alt="avatar" className="h-12 w-12 rounded-full object-cover" />
                          <div>
                            <h3 className="text-base font-bold text-ink">{review.fullName}</h3>
                            <p className="mt-1 text-sm text-slate-500">{formatReviewDate(review.createdAt)}</p>
                          </div>
                        </div>

                        <div className="shrink-0 text-left sm:text-right">
                          <div className="flex items-center gap-2">
                            <StarRating value={review.rating} size="sm" />
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-slate-600">{review.reviewText}</p>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          onClick={() => handleLike(review._id)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
                        >
                          <LikeIcon />
                          Like
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                            {review.likes || 0}
                          </span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                {reviewTotalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                      disabled={reviewPage <= 1}
                      className="rounded-md border border-slate-200 px-4 py-2 text-sm disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <div className="text-sm text-slate-600">Page {reviewPage} of {reviewTotalPages}</div>
                    <button
                      type="button"
                      onClick={() => setReviewPage((p) => Math.min(reviewTotalPages, p + 1))}
                      disabled={reviewPage >= reviewTotalPages}
                      className="rounded-md border border-slate-200 px-4 py-2 text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          <section ref={reviewFormRef} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-ink">Write a Review</h2>
                <p className="mt-1 text-sm text-slate-500">Share feedback and help other users make decisions.</p>
              </div>
              <button
                type="button"
                onClick={scrollToReviewForm}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50"
              >
                Focus form
              </button>
            </div>

            {successMessage ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            {formErrors.submit ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {formErrors.submit}
              </div>
            ) : null}

            <form onSubmit={handleReviewSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Full Name" error={formErrors.fullName} required>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
                    placeholder="Jane Doe"
                  />
                </Field>

                <Field label="Subject" error={formErrors.subject} required>
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
                    placeholder="Great service and support"
                  />
                </Field>
              </div>

              <Field label="Review Text" error={formErrors.reviewText} required>
                <textarea
                  name="reviewText"
                  value={formData.reviewText}
                  onChange={handleFieldChange}
                  rows={5}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
                  placeholder="Write your detailed feedback here..."
                />
              </Field>

              <div>
                <p className="mb-2 text-sm font-semibold text-ink">
                  Rating <span className="text-accent">*</span>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                    <StarRating
                      value={formData.rating}
                      onChange={(rating) => setFormData((current) => ({ ...current, rating }))}
                      size="lg"
                    />
                  <span className="ml-2 text-sm text-slate-500">
                    {formData.rating ? `${formData.rating} / 5 selected` : 'Select a rating'}
                  </span>
                </div>
                {formErrors.rating ? <p className="mt-2 text-sm text-red-600">{formErrors.rating}</p> : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">Your review will appear after submission and refresh automatically.</p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/companies"
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to companies
            </Link>
            <Link
              to="/add-company"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50"
            >
              Add Company
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function validateReviewForm(formData) {
  const errors = {};

  if (!formData.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!formData.subject.trim()) {
    errors.subject = 'Subject is required.';
  }

  if (!formData.reviewText.trim()) {
    errors.reviewText = 'Review text is required.';
  }

  if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
    errors.rating = 'Please select a rating between 1 and 5.';
  }

  return errors;
}

function Field({ label, error, required = false, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </span>
      {children}
      {error ? <span className="mt-2 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

function Pill({ children }) {
  return <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">{children}</span>;
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-right text-ink">{value}</span>
    </div>
  );
}

function LikeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 20.5 10.55 19.2C5.4 14.6 2 11.55 2 7.85 2 4.8 4.42 2.5 7.5 2.5c1.74 0 3.41.81 4.5 2.07A5.97 5.97 0 0 1 16.5 2.5C19.58 2.5 22 4.8 22 7.85c0 3.7-3.4 6.75-8.55 11.35L12 20.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
      <path
        d="M5 21V4.8c0-.8.6-1.3 1.3-1.3h8.4c.7 0 1.3.6 1.3 1.3V21M5 21h15M8 7h2M8 11h2M8 15h2M13 11h2M13 15h2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompanyDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-pulse overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-soft">
        <div className="bg-gradient-to-r from-ink to-slate px-6 py-8 sm:px-8">
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 rounded-3xl bg-white/15" />
            <div className="flex-1 space-y-4">
              <div className="h-4 w-40 rounded-full bg-white/15" />
              <div className="h-10 w-3/4 rounded-full bg-white/15" />
              <div className="h-4 w-1/2 rounded-full bg-white/15" />
            </div>
          </div>
        </div>
        <div className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-4 lg:grid-cols-[1.3fr,0.7fr]">
            <div className="h-36 rounded-[1.5rem] bg-slate-100" />
            <div className="h-36 rounded-[1.5rem] bg-slate-100" />
          </div>
          <div className="h-6 w-40 rounded-full bg-slate-100" />
          <div className="grid gap-4 md:grid-cols-2">
            <ReviewSkeleton />
            <ReviewSkeleton />
          </div>
          <div className="h-80 rounded-[1.75rem] bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="h-4 w-32 rounded-full bg-slate-200" />
          <div className="h-3 w-40 rounded-full bg-slate-100" />
        </div>
        <div className="h-3 w-20 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 h-4 w-32 rounded-full bg-slate-100" />
      <div className="mt-4 space-y-3">
        <div className="h-3 w-full rounded-full bg-slate-100" />
        <div className="h-3 w-11/12 rounded-full bg-slate-100" />
        <div className="h-3 w-10/12 rounded-full bg-slate-100" />
      </div>
      <div className="mt-5 flex justify-between border-t border-slate-100 pt-4">
        <div className="h-9 w-24 rounded-full bg-slate-100" />
        <div className="h-9 w-16 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function formatReviewDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export default CompanyDetailPage;
