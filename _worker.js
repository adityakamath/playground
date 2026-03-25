// _worker.js — Cloudflare Pages advanced mode worker
// Intercepts HTML requests to inject per-robot Open Graph / Twitter Card meta tags.
// All other requests (assets, fonts, JS, CSS) pass straight through.

const BASE_URL = 'https://playground.kamathrobotics.com';

const ROBOT_META = {
  lekiwi: {
    title:       'LeKiwi — Kamath Robotics Playground',
    description: 'A compact 3-wheeled omnidirectional robot. Explore the interactive 3D model.',
    image:       `${BASE_URL}/assets/og_lekiwi.png`,
    url:         `${BASE_URL}/?robot=lekiwi`,
  },
  akros: {
    title:       'AKROS — Kamath Robotics Playground',
    description: 'A mecanum-wheeled holonomic robot. Explore the interactive 3D model.',
    image:       `${BASE_URL}/assets/og_akros.png`,
    url:         `${BASE_URL}/?robot=akros`,
  },
  kr003: {
    title:       'KR003 — Kamath Robotics Playground',
    description: 'A 4-wheeled mecanum drive platform. Explore the interactive 3D model.',
    image:       `${BASE_URL}/assets/og_kr003.png`,
    url:         `${BASE_URL}/?robot=kr003`,
  },
};

const DEFAULT_META = {
  title:       'Robot Playground — Kamath Robotics',
  description: 'Interactive 3D models of real robots. Drive them in your browser.',
  image:       `${BASE_URL}/assets/og_lekiwi.png`,
  url:          BASE_URL,
};

function metaTags(meta) {
  return [
    `<meta property="og:title"       content="${meta.title}" />`,
    `<meta property="og:description" content="${meta.description}" />`,
    `<meta property="og:image"       content="${meta.image}" />`,
    `<meta property="og:url"         content="${meta.url}" />`,
    `<meta property="og:type"        content="website" />`,
    `<meta name="twitter:card"        content="summary_large_image" />`,
    `<meta name="twitter:title"       content="${meta.title}" />`,
    `<meta name="twitter:description" content="${meta.description}" />`,
    `<meta name="twitter:image"       content="${meta.image}" />`,
  ].join('\n  ');
}

export default {
  async fetch(request, env) {
    // Fetch the asset from the Pages store
    const response = await env.ASSETS.fetch(request);

    // Only rewrite HTML responses — pass everything else through
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) return response;

    // Determine which robot's meta to use
    const robotKey = new URL(request.url).searchParams.get('robot')?.toLowerCase();
    const meta     = ROBOT_META[robotKey] ?? DEFAULT_META;

    // Inject tags into <head> and rewrite <title>
    return new HTMLRewriter()
      .on('title', {
        element(el) { el.setInnerContent(meta.title); },
      })
      .on('head', {
        element(el) { el.append('\n  ' + metaTags(meta) + '\n', { html: true }); },
      })
      .transform(response);
  },
};
