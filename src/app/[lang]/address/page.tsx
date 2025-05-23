import React from "react";
import AddressScreen from "@/screens/AddressScreen";
import { getDictionary } from "@/config/get-dictionary";

export default async function Address(props: { params: { lang: string } }) {
  const { lang } = props.params;
  const dictionary = await getDictionary(lang);

  console.log(dictionary);

  return <AddressScreen dictionary={dictionary} />;
}
