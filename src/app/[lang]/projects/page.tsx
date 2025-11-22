import ProjectsScreen from "@/screens/ProjectsScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { PageProps } from "@/models/lang.model";
import type { Metadata } from "next";
import { fetchServerProjects } from "@/api/server-projects";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

export const revalidate = 60; // ISR for projects page

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");

  return {
    title: `${dictionary.metadata.projects.title} | Art Lighthouse`,
    description: dictionary.metadata.projects.subTitle,
  };
}

export default async function ProjectsPage({ params }: PageProps) {
  const { lang } = await params;
  const resolvedLang = isLocale(lang) ? lang : "ge";
  const dictionary = await getDictionary(resolvedLang);
  const { projects, categories, error } = await fetchServerProjects(resolvedLang);
  return (
    <ProjectsScreen
      dictionary={dictionary}
      initialProjects={projects}
      initialCategories={categories}
      initialError={error}
    />
  );
}
