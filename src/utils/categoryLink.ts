// The homepage CMS links categories as `/products?category=<slug>`, but the product API
// has no category field: products are grouped by attributes. Map each homepage category
// slug to attribute filters in the `attributeId:value` format the filter sidebar writes,
// so the matching checkboxes show as selected. Attribute ids: 6 = subcategory, 16 = Furniture.
const CATEGORY_FILTERS: Record<string, string[]> = {
  lighting: ["6:wall lamp"],
  furniture: ["16:Furniture"],
  decorations: ["6:decor", "6:Wall decor"],
  accessories: ["6:Mirror"],
  // No outdoor lights or chandeliers in the catalog yet; show the closest match
  "garden-lights": ["6:wall lamp"],
  chandeliers: ["6:wall lamp"],
};

export const resolveCategoryLink = (rawLink: string | undefined) => {
  const link = rawLink || "/products";
  const [path, query = ""] = link.split("?");
  const params = new URLSearchParams(query);
  const slug = params.get("category");
  const filters = slug ? CATEGORY_FILTERS[slug.toLowerCase()] : undefined;
  if (!filters) return link;

  params.delete("category");
  params.set("attributes", filters.join(","));
  return `${path}?${params.toString()}`;
};
