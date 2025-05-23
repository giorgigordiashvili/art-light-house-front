import ProfileScreen from "@/screens/ProfileScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function ProfilePage(props: { params: { lang: string } }) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);

  console.log(dictionary);
  return <ProfileScreen dictionary={dictionary} />;
}
