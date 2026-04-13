import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/*/cart",
          "/*/checkout",
          "/*/profile",
          "/*/details",
          "/*/settings",
          "/*/address",
          "/*/paymentMethods",
          "/*/orders",
          "/*/orders/",
          "/*/succsess",
          "/*/payment-failed",
          "/*/emptycart",
          "/*/emptyfavorites",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
