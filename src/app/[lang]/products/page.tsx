import ProductsScreen from "@/screens/ProductsScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function ProductsPage(props: { params: { lang: string } }) {
  const { lang } = props.params;

  const dictionary = await getDictionary(lang);

  return <ProductsScreen dictionary={dictionary} />;
}
