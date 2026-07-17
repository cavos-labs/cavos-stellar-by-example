import { EmptyState } from "@/components/app/EmptyState";

export default function ProjectNotFound() {
  return (
    <EmptyState
      title="Project not found"
      body="No demo scenario matches this project ID. The demo data is fixed, so only the documented scenario URLs resolve."
      action={{ href: "/dashboard", label: "Back to dashboard" }}
    />
  );
}
