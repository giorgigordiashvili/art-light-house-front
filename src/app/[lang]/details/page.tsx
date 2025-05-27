import MyDetails from "@/screens/DetailsScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function DetailsPage({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);
  return <MyDetails dictionary={dictionary} />;
}
