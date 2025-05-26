import Checkout from "@/screens/CheckoutScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function CheckoutPage(props: { params: { lang: string } }) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  return <Checkout dictionary={dictionary} />;
}
