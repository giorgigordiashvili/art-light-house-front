type PageResponse<T> = { results?: T[]; next?: string | null };

/**
 * Fetches every page of a paginated endpoint (DRF-style `results` / `next`)
 * and returns the concatenated results. Stops after `maxPages` as a safeguard.
 */
export async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<PageResponse<T>>,
  maxPages = 20
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  while (page <= maxPages) {
    const resp = await fetchPage(page);
    all.push(...(resp.results ?? []));
    if (!resp.next) break;
    page += 1;
  }
  return all;
}
