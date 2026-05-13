/**
 * True for absolute http(s) URLs that should open in a new browsing context.
 */
export function isExternalHttpUrl(href: string): boolean {
  return /^https?:\/\//i.test(href.trim());
}

/** Props to spread on `<a>` for safe external navigation. */
export function externalLinkProps(href: string): {
  target?: "_blank";
  rel?: string;
} {
  return isExternalHttpUrl(href)
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}
