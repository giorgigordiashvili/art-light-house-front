import ContactScreen from "@/screens/ContactScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function ContactPage(props: { params: { lang: string } }) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);

  console.log(dictionary);
  return <ContactScreen dictionary={dictionary} />;
}
