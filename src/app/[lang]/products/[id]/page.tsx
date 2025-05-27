import ProductDetailScreen from "@/screens/ProductDetailScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function ProductDetailsPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(lang);
  return <ProductDetailScreen dictionary={dictionary} />;
}
