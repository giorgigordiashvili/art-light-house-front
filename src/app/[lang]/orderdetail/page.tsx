import OrderDetailScreen from "@/screens/OrderDetailScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function OrderDetailPage(props: { params: { lang: string } }) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  return <OrderDetailScreen dictionary={dictionary} />;
}
