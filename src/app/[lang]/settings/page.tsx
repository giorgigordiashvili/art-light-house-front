import SettingsScreen from "@/screens/SettingsScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function SettingPage(props: { params: { lang: string } }) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);
  return <SettingsScreen dictionary={dictionary} />;
}
