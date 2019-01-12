/* Images would not load when we hide an image.
   * This script does not have access to page context, so as a workaround
   * we have to create a script, append it to the page and then
   * execute it in the page context. */
export function lazyLoadImages(): void {
  // language=JavaScript
  const actualCode = `setTimeout(() => wykop.bindLazy(), 1000)`;

  const script = document.createElement('script');
  script.textContent = actualCode;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}

export function scrollTo(el: Element): void {
  console.log('Scrolling to', el);
  el.scrollIntoView();
  window.scrollBy(0, -50);
}

export function scrollToTop(): void {
  return window.scrollTo(0, 0);
}

export function isElementInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  const wh = (window.innerHeight || document.documentElement.clientHeight);

  const cond1 = rect.bottom > 0 && rect.bottom < wh;
  const cond2 = rect.top < wh && rect.bottom > 0;

  return (cond1 || cond2);
}
