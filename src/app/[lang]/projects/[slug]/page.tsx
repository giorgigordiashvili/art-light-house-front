import ProjectDetailScreen from "@/screens/ProjectDetailScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { PageProps } from "@/models/lang.model";
import type { Metadata } from "next";
// TODO: Projects API not available - backend needs to implement
// import { apiEcommerceClientProjectsRetrieve } from "@/api/generated/api";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

interface ProjectPageProps extends PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  await params; // Consume params to avoid unused variable warning

  try {
    // TODO: Projects API not available
    // const project = await apiEcommerceClientProjectsRetrieve(slug);
    throw new Error("Projects API not implemented");
    // return {
    //   title: `${project.title} | Art Lighthouse Projects`,
    //   description: project.short_description || project.description.substring(0, 160),
    // };
  } catch {
    return {
      title: "Project | Art Lighthouse",
      description: "View project details",
    };
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { lang, slug } = await params;
  const dictionary = await getDictionary(isLocale(lang) ? lang : "ge");

  return <ProjectDetailScreen slug={slug} dictionary={dictionary} lang={lang} />;
}
