import Success from "@/screens/SuccsessOrderScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function SuccessPage(props: { params: { lang: string } }) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  return <Success dictionary={dictionary} />;
}
