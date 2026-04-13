import ProjectDetailScreen from "@/screens/ProjectDetailScreen";
import { getDictionary } from "@/config/get-dictionary";
import type { Locale } from "@/config/i18n";
import { PageProps } from "@/models/lang.model";
import type { Metadata } from "next";
import { fetchServerProjectDetail } from "@/api/server-project-detail";
import { buildSeoMetadata } from "@/lib/seo";

function isLocale(lang: string): lang is Locale {
  return ["ge", "en"].includes(lang);
}

interface ProjectPageProps extends PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export const revalidate = 60; // ISR: regenerate project detail every 60s

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const resolvedLang = isLocale(lang) ? lang : "ge";
  try {
    const { project } = await fetchServerProjectDetail(resolvedLang, slug);
    if (project) {
      const desc =
        project.short_description ||
        (project.description || "").replace(/<[^>]*>/g, "").slice(0, 160);

      return buildSeoMetadata({
        title: `${project.title} | Art Lighthouse`,
        description: desc || "View project details",
        locale: resolvedLang,
        pathname: `/projects/${slug}`,
        ogImage: project.primary_image_url || undefined,
        ogType: "article",
      });
    }
  } catch {}
  return buildSeoMetadata({
    title: "Project | Art Lighthouse",
    description: "View project details",
    locale: resolvedLang,
    pathname: `/projects/${slug}`,
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { lang, slug } = await params;
  const resolvedLang = isLocale(lang) ? lang : "ge";
  const dictionary = await getDictionary(resolvedLang);
  const { project, error } = await fetchServerProjectDetail(resolvedLang, slug);
  return (
    <ProjectDetailScreen
      dictionary={dictionary}
      lang={resolvedLang}
      initialProject={project}
      initialError={error}
    />
  );
}
