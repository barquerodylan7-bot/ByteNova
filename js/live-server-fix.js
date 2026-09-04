document.addEventListener("DOMContentLoaded", () => {
  const local =
    location.hostname === "127.0.0.1" ||
    location.hostname === "localhost";

  if (!local) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');

    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.endsWith('.html') ||
      href.endsWith('.pdf') ||
      href.includes('.')
    ) return;

    if (href.startsWith('/pages/')) {
      link.setAttribute('href', href + '.html');
    } else if (href.startsWith('pages/')) {
      link.setAttribute('href', href + '.html');
    } else if (
      !href.startsWith('/') &&
      !href.startsWith('../') &&
      href !== './'
    ) {
      link.setAttribute('href', href + '.html');
    }
  });
});
