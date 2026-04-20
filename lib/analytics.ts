// Stub analytics for static build — all no-ops
export function trackFBEvent(_event: string, _params?: Record<string, unknown>) {}
export function trackPageView(_url: string) {}
const noop = (..._args: unknown[]) => {};
export const trackNavigation = { scrollDepth: noop, timeOnPage: noop };
export const trackVoting = { postViewed: noop, voteAttempted: noop, voteSuccess: noop, voteFailed: noop, shareClicked: noop, filterChanged: noop, searchPerformed: noop, pageViewed: noop };
export const trackAuth = { otpRequested: noop, otpVerified: noop, otpFailed: noop };
export const trackError = { apiError: noop };
