import OrdersScreen from "@/screens/OrdersScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function OrdersPage(props: { params: { lang: string } }) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  return <OrdersScreen dictionary={dictionary} />;
}
