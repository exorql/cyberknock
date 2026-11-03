import test from 'node:test';
import assert from 'node:assert/strict';
import { pageCategory, safeAnalyticsParams, trackEvent } from '../lib/analytics.ts';

test('analytics discards form contents, emails, raw URLs, arbitrary values and parameter names', () => {
  const actual = safeAnalyticsParams({ location: 'hero', service: 'sports-ai', source: 'home', email: 'qa@example.com', message: 'Private details', href: '/?email=qa@example.com', company: 'Private company', page: '/?email=qa@example.com', error_type: 'private detail', page_location: 'https://private.example?email=qa@example.com', page_referrer: 'https://private.example?name=private', store: 'private-store' });
  assert.deepEqual(actual, { location: 'hero', service: 'sports-ai', source: 'home' });
});

test('path categories discard query/hash data and reject unknown paths', () => {
  assert.equal(pageCategory('/sports-dx?email=qa@example.com#contact'), 'sports_dx');
  assert.equal(pageCategory('/cases/ai-sports-trainer/'), 'case_study');
  assert.equal(pageCategory('/private-user-name'), 'other');
  assert.equal(pageCategory('sports-dx'), 'sports_dx');
});

test('no gtag configuration means no request, error or tracking fallback', () => {
  global.window = { location: { pathname: '/' } };
  assert.doesNotThrow(() => trackEvent('cta_click', { location: 'hero' }));
  delete global.window;
});

test('existing gtag receives only allowlisted event and safe page category', () => {
  const calls = [];
  global.window = { location: { pathname: '/sports-dx' }, gtag: (...args) => calls.push(args) };
  trackEvent('cta_click', { location: 'hero', email: 'qa@example.com', page: 'https://private.example' });
  trackEvent('private-event', { location: 'hero' });
  assert.deepEqual(calls, [['event', 'cta_click', { location: 'hero', page: 'sports_dx', page_location: 'https://cyberknock.pages.dev/sports-dx', page_referrer: '' }]]);
  global.window.gtag = () => { throw new Error('tracker unavailable'); };
  assert.doesNotThrow(() => trackEvent('contact_form_success'));
  delete global.window;
});

test('custom events override implicit gtag location/referrer defaults and never include URL PII', () => {
  const calls = [];
  global.window = {
    location: new URL('https://preview.cyberknock.pages.dev/sports-dx?email=qa%40example.com&name=private-person#private-message'),
    gtag: (command, event, params) => calls.push({
      command, event, params,
      // Model gtag defaults so a missing explicit override fails this regression test.
      effectiveLocation: params.page_location ?? global.window.location.href,
      effectiveReferrer: params.page_referrer ?? global.document.referrer,
    }),
  };
  global.document = { referrer: 'https://referrer.example?email=qa@example.com&name=private-person' };
  try {
    trackEvent('contact_form_start', { source: 'sports_dx', page_location: global.window.location.href, page_referrer: global.document.referrer });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].effectiveLocation, 'https://cyberknock.pages.dev/sports-dx');
    assert.equal(calls[0].effectiveReferrer, '');
    assert.ok(!/qa|example\.com|private-person|private-message|preview\.|referrer\.example|email=|name=/.test(JSON.stringify(calls)));

    global.window.location = new URL('https://preview.example/private-person?email=qa@example.com');
    trackEvent('cta_click');
    assert.equal(calls[1].params.page, 'other');
    assert.equal(calls[1].effectiveLocation, 'https://cyberknock.pages.dev/');
    assert.equal(calls[1].effectiveReferrer, '');
  } finally { delete global.window; delete global.document; }
});

test('store events retain only the two supported store categories', () => {
  const calls = [];
  global.window = { location: { pathname: '/' }, gtag: (...args) => calls.push(args) };
  try {
    trackEvent('store_click', { store: 'app_store', location: 'case' });
    trackEvent('store_click', { store: 'google_play' });
    trackEvent('store_click', { store: 'qa@example.com' });
    assert.equal(calls[0][2].store, 'app_store');
    assert.equal(calls[1][2].store, 'google_play');
    assert.ok(!('store' in calls[2][2]));
  } finally { delete global.window; }
});

test('method-level case study click is measured without raw URLs or PII', () => {
  assert.deepEqual(safeAnalyticsParams({ location: 'method', page: 'home', email: 'private@example.com' }), { location: 'method', page: 'home' });
});
