// Stub analytics for static build
export function trackFBEvent(_event: string, _params?: Record<string, unknown>) {}
export const trackVoting = { postViewed: () => {}, voteAttempted: () => {}, voteSuccess: () => {}, voteFailed: () => {}, shareClicked: () => {}, filterChanged: () => {}, searchPerformed: () => {}, pageViewed: () => {} };
export const trackAuth = { otpRequested: () => {}, otpVerified: () => {}, otpFailed: () => {} };
export const trackError = { apiError: () => {} };
