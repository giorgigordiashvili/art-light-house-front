import HomeScreen from "@/screens/HomeScreen";
import { i18n } from "@/config/i18n";
import { getDictionary } from "@/config/get-dictionary";

// export function generateStaticParams() {
//   console.log(i18n.locales.map((locale) => ({ locale })))
//   return i18n.locales.map((locale) => ({ locale }));
// }

export default async function HomePage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);

  console.log(dictionary);

  return <HomeScreen dictionary={dictionary} />;
}
