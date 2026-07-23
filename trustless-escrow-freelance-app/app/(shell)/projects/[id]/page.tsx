import type { Metadata } from "next";
import { getProject } from "@/lib/gateway";
import { ProjectDetailClient } from "@/components/app/ProjectDetailClient";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  return {
    title: `${project?.title ?? "Project not found"} | Trustless Escrow Freelance App`,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const fixtureProject = await getProject(id);

  return <ProjectDetailClient id={id} fixtureProject={fixtureProject} />;
}
