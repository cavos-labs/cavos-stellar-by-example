import type { Project } from "../domain/types";

/**
 * Deterministic demo data: no randomness, no dates — every render of a
 * given scenario looks identical. A later gateway backed by Cavos +
 * Trustless Work replaces this module without touching the UI.
 */

export interface DemoScenario {
  projectId: string;
  label: string;
  description: string;
}

/** The scenario the landing-page product mock renders. */
export const LANDING_DEMO_PROJECT_ID = "landing-page-redesign";

export const demoProjects: Project[] = [
  {
    id: "mobile-onboarding-flow",
    title: "Mobile onboarding flow",
    summary: "UX research and prototypes for a fintech onboarding revamp.",
    client: { id: "client-atlas", role: "client", name: "Atlas Labs" },
    freelancer: {
      id: "freelancer-sofia",
      role: "freelancer",
      name: "Sofía Ramos",
      handle: "@sofia.builds",
      email: "sofia@ramos.mx",
      walletShort: "G…5C8",
    },
    escrowStatus: "draft",
    asset: "USDC",
    milestones: [
      { id: "m1", title: "UX research & interviews", amount: 300, state: "pending", funded: false },
      { id: "m2", title: "Flow prototypes", amount: 450, state: "pending", funded: false },
      { id: "m3", title: "Handoff specs", amount: 250, state: "pending", funded: false },
    ],
  },
  {
    id: "api-integration-audit",
    title: "API integration audit",
    summary: "Review and harden a storefront's payment-API integration.",
    client: { id: "client-helio", role: "client", name: "Helio Commerce" },
    freelancer: {
      id: "freelancer-marcus",
      role: "freelancer",
      name: "Marcus Lee",
      handle: "@marcus.dev",
      email: "marcus@lee.dev",
      walletShort: "G…9B2",
    },
    escrowStatus: "awaiting_funding",
    asset: "USDC",
    milestones: [
      { id: "m1", title: "Discovery & audit report", amount: 250, state: "pending", funded: false },
      { id: "m2", title: "Integration fixes", amount: 400, state: "pending", funded: false },
      { id: "m3", title: "Regression test pass", amount: 150, state: "pending", funded: false },
    ],
  },
  {
    id: "brand-identity-kit",
    title: "Brand identity kit",
    summary: "Logo system and brand guidelines for a specialty coffee brand.",
    client: { id: "client-quartz", role: "client", name: "Quartz & Co" },
    freelancer: {
      id: "freelancer-amara",
      role: "freelancer",
      name: "Amara Osei",
      handle: "@amara.creates",
      email: "amara@osei.studio",
      walletShort: "G…3D4",
    },
    escrowStatus: "funded",
    asset: "USDC",
    milestones: [
      { id: "m1", title: "Moodboard & direction", amount: 200, state: "submitted", funded: true },
      { id: "m2", title: "Logo system", amount: 450, state: "pending", funded: true },
      { id: "m3", title: "Brand guidelines", amount: 350, state: "pending", funded: true },
    ],
  },
  {
    id: LANDING_DEMO_PROJECT_ID,
    title: "Landing page redesign",
    summary: "Full redesign and rebuild of a marketing site landing page.",
    client: { id: "client-nova", role: "client", name: "Nova Studio" },
    freelancer: {
      id: "freelancer-jamie",
      role: "freelancer",
      name: "Jamie Rivera",
      handle: "@jamie.design",
      email: "jamie@studio.xyz",
      walletShort: "G…7f9",
    },
    escrowStatus: "partially_released",
    asset: "USDC",
    milestones: [
      { id: "m1", title: "Wireframes & IA", amount: 300, state: "released", funded: true },
      { id: "m2", title: "Visual design", amount: 400, state: "released", funded: true },
      { id: "m3", title: "Front-end build", amount: 500, state: "submitted", funded: true },
    ],
  },
  {
    id: "podcast-cover-art",
    title: "Podcast cover art",
    summary: "Cover illustration for a weekly design podcast.",
    client: { id: "client-waveform", role: "client", name: "Waveform Media" },
    freelancer: {
      id: "freelancer-ivo",
      role: "freelancer",
      name: "Ivo Petrov",
      handle: "@ivo.draws",
      email: "ivo@petrov.art",
      walletShort: "G…1A6",
    },
    escrowStatus: "cancelled",
    asset: "USDC",
    milestones: [
      { id: "m1", title: "Concept sketches", amount: 120, state: "pending", funded: false },
      { id: "m2", title: "Final artwork", amount: 280, state: "pending", funded: false },
    ],
  },
];

export const demoScenarios: DemoScenario[] = [
  {
    projectId: "mobile-onboarding-flow",
    label: "Draft",
    description:
      "The contract is still being drafted — milestones exist but nothing is locked in escrow yet.",
  },
  {
    projectId: "api-integration-audit",
    label: "Awaiting funding",
    description:
      "Both parties agreed to terms; the escrow waits for the client to lock the contract value.",
  },
  {
    projectId: "brand-identity-kit",
    label: "Funded · work submitted",
    description:
      "The escrow is fully funded and the first milestone has been submitted for client review.",
  },
  {
    projectId: LANDING_DEMO_PROJECT_ID,
    label: "Partially released",
    description:
      "Two milestones are approved and released on Stellar; the final one awaits client review.",
  },
  {
    projectId: "podcast-cover-art",
    label: "Cancelled (edge case)",
    description:
      "The contract was cancelled before funding — exercises the UI's fallback for terminal states.",
  },
];

export function getDemoProject(id: string): Project | undefined {
  return demoProjects.find((p) => p.id === id);
}

export function getDemoScenario(projectId: string): DemoScenario | undefined {
  return demoScenarios.find((s) => s.projectId === projectId);
}
