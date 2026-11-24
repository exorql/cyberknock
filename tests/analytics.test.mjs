import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSafePageLocation,
  initializeGtagDataLayer,
  pageCategory,
  safeAnalyticsParams,
  safeExternalReferrer,
  sanitizeUtmQuery,
  trackEvent,
} from '../lib/analytics.ts';

test('analytics discards form contents, emails, raw URLs, arbitrary values and parameter names', () => {
  const actual = safeAnalyticsParams({ location: 'hero', service: 'sports-ai', source: 'home', email: 'qa@example.com', message: 'Private details', href: '/?email=qa@example.com', company: 'Private company', page: '/?email=qa@example.com', error_type: 'private detail', page_location: 'https://private.example?email=qa@example.com', page_referrer: 'https://private.example?name=private', store: 'private-store' });
  assert.deepEqual(actual, { location: 'hero', service: 'sports-ai', source: 'home' });
});

test('path categories discard query/hash data and reject unknown paths', () => {
  assert.equal(pageCategory('/sports-dx?email=qa@example.com#contact'), 'sports_dx');
  assert.equal(pageCategory('/cases/ai-sports-trainer/'), 'case_study');
  assert.equal(pageCategory('/ai-development?client=private'), 'ai_development');
  assert.equal(pageCategory('/demos/ai-sports-trainer?email=private@example.com'), 'ai_demo');
  assert.equal(pageCategory('/ai-development/soccer-player-tracking?email=qa@example.com'), 'other');
  assert.equal(pageCategory('/ai-development/kyudo-motion-analysis#private'), 'other');
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
  assert.deepEqual(calls, [['event', 'cta_click', { location: 'hero', page: 'sports_dx', page_location: 'https://cyberknock.jp/sports-dx', page_referrer: '' }]]);
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
    assert.equal(calls[0].effectiveLocation, 'https://cyberknock.jp/sports-dx');
    assert.equal(calls[0].effectiveReferrer, '');
    assert.ok(!/qa|example\.com|private-person|private-message|preview\.|referrer\.example|email=|name=/.test(JSON.stringify(calls)));

    global.window.location = new URL('https://preview.example/private-person?email=qa@example.com');
    trackEvent('cta_click');
    assert.equal(calls[1].params.page, 'other');
    assert.equal(calls[1].effectiveLocation, 'https://cyberknock.jp/');
    assert.equal(calls[1].effectiveReferrer, '');
  } finally { delete global.window; delete global.document; }
});

test('manual page views use only canonical paths without raw query strings or referrers', () => {
  const calls = [];
  global.window = {
    location: new URL('https://cyberknock.jp/ai-development?name=private&email=qa@example.com'),
    gtag: (...args) => calls.push(args),
  };
  try {
    trackEvent('page_view', { email: 'qa@example.com', page_location: global.window.location.href });
    assert.equal(calls.length, 1);
    assert.equal(calls[0][1], 'page_view');
    assert.equal(calls[0][2].page, 'ai_development');
    assert.equal(calls[0][2].page_location, 'https://cyberknock.jp/ai-development');
    assert.equal(calls[0][2].page_referrer, '');
    assert.ok(!JSON.stringify(calls).includes('qa@example.com'));
  } finally { delete global.window; }
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

test('Google tag initialization queues Arguments objects rather than arrays', () => {
  const target = {};
  initializeGtagDataLayer(target);
  const timestamp = new Date('2026-11-19T00:00:00.000Z');

  target.gtag('js', timestamp);
  target.gtag('config', 'G-TEST123456', { send_page_view: false });
  target.gtag('event', 'page_view', { page_location: 'https://cyberknock.jp/' });

  assert.equal(target.dataLayer.length, 3);
  for (const command of target.dataLayer) {
    assert.equal(Object.prototype.toString.call(command), '[object Arguments]');
  }
  assert.deepEqual(Array.from(target.dataLayer[0]), ['js', timestamp]);
  assert.deepEqual(Array.from(target.dataLayer[1]), ['config', 'G-TEST123456', { send_page_view: false }]);
  assert.deepEqual(Array.from(target.dataLayer[2]), ['event', 'page_view', { page_location: 'https://cyberknock.jp/' }]);
});

test('safeExternalReferrer retains only public HTTPS/HTTP origin and rejects internal or preview hosts', () => {
  assert.equal(safeExternalReferrer('https://www.google.com/search?q=ai+development&oq=secret'), 'https://www.google.com/');
  assert.equal(safeExternalReferrer('https://ai-sportstrainer.com/legal/tokushoho?uid=999'), 'https://ai-sportstrainer.com/');
  assert.equal(safeExternalReferrer('https://choleste-coach.com/logic#section'), 'https://choleste-coach.com/');
  assert.equal(safeExternalReferrer('https://cyberknock.jp/ai-development'), '');
  assert.equal(safeExternalReferrer('https://sub.cyberknock.jp/'), '');
  assert.equal(safeExternalReferrer('https://preview.cyberknock.pages.dev/'), '');
  assert.equal(safeExternalReferrer('http://localhost:3000/'), '');
  assert.equal(safeExternalReferrer('http://127.0.0.1/'), '');
  assert.equal(safeExternalReferrer('https://user:pass@example.com/path'), '');
  assert.equal(safeExternalReferrer('javascript:alert(1)'), '');
  assert.equal(safeExternalReferrer(''), '');
});

test('sanitizeUtmQuery validates both UTM keys and values against PII leaks', () => {
  assert.equal(
    sanitizeUtmQuery('?utm_source=ai_sportstrainer&utm_medium=referral&utm_campaign=operator_credit&name=yamada'),
    '?utm_source=ai_sportstrainer&utm_medium=referral&utm_campaign=operator_credit'
  );
  assert.equal(
    sanitizeUtmQuery('?utm_source=newsletter&utm_medium=email&utm_content=footer_link'),
    '?utm_source=newsletter&utm_medium=email&utm_content=footer_link'
  );
  assert.equal(
    sanitizeUtmQuery('?utm_source=taro@example.com&utm_medium=bad_medium&utm_campaign=090-1234-5678&utm_term=secret&gclid=abc&custom_id=12345'),
    ''
  );
  assert.equal(sanitizeUtmQuery('?utm_source=1234567890&utm_campaign=user_id_99'), '');
  assert.equal(sanitizeUtmQuery('?utm_source=550e8400-e29b-41d4-a716-446655440000'), '');
  assert.equal(sanitizeUtmQuery('?utm_source=a&utm_source=b'), '');
});

test('attribution referrer and safe UTM parameters attach only to initial page_view', () => {
  const calls = [];
  global.window = {
    location: new URL('https://cyberknock.jp/ai-development?utm_source=choleste_coach&utm_medium=referral&utm_campaign=operator_credit&email=qa@example.com'),
    gtag: (...args) => calls.push(args),
  };
  global.document = { referrer: 'https://www.google.com/search?q=ai+video+analysis' };
  try {
    trackEvent('page_view', {}, { includeAttribution: true });
    trackEvent('page_view');
    trackEvent('cta_click', { location: 'hero' });
    assert.equal(calls.length, 3);
    assert.equal(calls[0][2].page_referrer, 'https://www.google.com/');
    assert.equal(
      calls[0][2].page_location,
      'https://cyberknock.jp/ai-development?utm_source=choleste_coach&utm_medium=referral&utm_campaign=operator_credit'
    );
    assert.equal(calls[1][2].page_referrer, '');
    assert.equal(calls[1][2].page_location, 'https://cyberknock.jp/ai-development');
    assert.equal(calls[2][2].page_referrer, '');
    assert.equal(calls[2][2].page_location, 'https://cyberknock.jp/ai-development');
    assert.equal(
      buildSafePageLocation('ai_development', '?utm_source=test&utm_medium=organic', false),
      'https://cyberknock.jp/ai-development'
    );
  } finally {
    delete global.window;
    delete global.document;
  }
});
