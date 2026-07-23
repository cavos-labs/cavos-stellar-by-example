"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { demoProjects as fixtureProjects } from "../fixtures/projects";
import { clearDemoProjects, loadAllDemoProjects, saveDemoProject } from "../localDemoStore";
import { DemoEscrowGateway } from "./demoEscrowGateway";
import type { EscrowGateway, EscrowResult } from "./escrowGateway";
import type { Project } from "./types";

interface DemoEscrowContextValue {
  gateway: EscrowGateway;
  demoProjects: Project[];
  createDemoEscrow(input: Omit<Project, "escrowStatus">): Promise<EscrowResult<Project>>;
  fundMilestone(projectId: string, milestoneId: string): Promise<EscrowResult<Project>>;
  submitMilestone(projectId: string, milestoneId: string): Promise<EscrowResult<Project>>;
  approveMilestone(projectId: string, milestoneId: string): Promise<EscrowResult<Project>>;
  releaseMilestone(projectId: string, milestoneId: string): Promise<EscrowResult<Project>>;
  resetDemoProjects(): void;
  lastPersistError: string | null;
  clearPersistError(): void;
}

const DemoEscrowContext = createContext<DemoEscrowContextValue | null>(null);

function buildGateway(extra: Project[]): DemoEscrowGateway {
  return new DemoEscrowGateway([...fixtureProjects, ...extra]);
}

export function EscrowGatewayProvider({ children }: { children: ReactNode }) {
  const [demoProjects, setDemoProjects] = useState<Project[]>(() => loadAllDemoProjects());
  const [gateway, setGateway] = useState<DemoEscrowGateway>(() => buildGateway(demoProjects));
  const [lastPersistError, setLastPersistError] = useState<string | null>(null);
  const persistErrorRef = useRef<string | null>(null);

  const createDemoEscrow = useCallback(async (
    input: Omit<Project, "escrowStatus">
  ): Promise<EscrowResult<Project>> => {
    const result = await gateway.createEscrow(input);
    if (!result.success) return result;

    const persist = saveDemoProject(result.data);
    setDemoProjects(loadAllDemoProjects());

    if (!persist.ok) {
      persistErrorRef.current = persist.error;
      setLastPersistError(persist.error);
    } else {
      persistErrorRef.current = null;
      setLastPersistError(null);
    }

    return result;
  }, [gateway]);

  const fundMilestone = useCallback(async (
    projectId: string, milestoneId: string
  ): Promise<EscrowResult<Project>> => {
    const result = await gateway.fundMilestone(projectId, milestoneId);
    if (result.success) {
      const persist = saveDemoProject(result.data);
      setDemoProjects(loadAllDemoProjects());
      if (!persist.ok) {
        persistErrorRef.current = persist.error;
        setLastPersistError(persist.error);
      } else {
        persistErrorRef.current = null;
        setLastPersistError(null);
      }
    }
    return result;
  }, [gateway]);

  const submitMilestone = useCallback(async (
    projectId: string, milestoneId: string
  ): Promise<EscrowResult<Project>> => {
    const result = await gateway.submitMilestone(projectId, milestoneId);
    if (result.success) {
      const persist = saveDemoProject(result.data);
      setDemoProjects(loadAllDemoProjects());
      if (!persist.ok) {
        persistErrorRef.current = persist.error;
        setLastPersistError(persist.error);
      } else {
        persistErrorRef.current = null;
        setLastPersistError(null);
      }
    }
    return result;
  }, [gateway]);

  const approveMilestone = useCallback(async (
    projectId: string, milestoneId: string
  ): Promise<EscrowResult<Project>> => {
    const result = await gateway.approveMilestone(projectId, milestoneId);
    if (result.success) {
      const persist = saveDemoProject(result.data);
      setDemoProjects(loadAllDemoProjects());
      if (!persist.ok) {
        persistErrorRef.current = persist.error;
        setLastPersistError(persist.error);
      } else {
        persistErrorRef.current = null;
        setLastPersistError(null);
      }
    }
    return result;
  }, [gateway]);

  const releaseMilestone = useCallback(async (
    projectId: string, milestoneId: string
  ): Promise<EscrowResult<Project>> => {
    const result = await gateway.releaseMilestone(projectId, milestoneId);
    if (result.success) {
      const persist = saveDemoProject(result.data);
      setDemoProjects(loadAllDemoProjects());
      if (!persist.ok) {
        persistErrorRef.current = persist.error;
        setLastPersistError(persist.error);
      } else {
        persistErrorRef.current = null;
        setLastPersistError(null);
      }
    }
    return result;
  }, [gateway]);

  const resetDemoProjects = useCallback(() => {
    clearDemoProjects();
    setGateway(new DemoEscrowGateway());
    setDemoProjects([]);
    persistErrorRef.current = null;
    setLastPersistError(null);
  }, []);

  const clearPersistError = useCallback(() => {
    persistErrorRef.current = null;
    setLastPersistError(null);
  }, []);

  const value = useMemo<DemoEscrowContextValue>(() => ({
    gateway,
    demoProjects,
    createDemoEscrow,
    fundMilestone,
    submitMilestone,
    approveMilestone,
    releaseMilestone,
    resetDemoProjects,
    lastPersistError,
    clearPersistError,
  }), [gateway, demoProjects, createDemoEscrow, fundMilestone, submitMilestone, approveMilestone, releaseMilestone, resetDemoProjects, lastPersistError, clearPersistError]);

  return (
    <DemoEscrowContext.Provider value={value}>{children}</DemoEscrowContext.Provider>
  );
}

export function useEscrowGateway(): EscrowGateway {
  const ctx = useContext(DemoEscrowContext);
  if (!ctx) {
    throw new Error("useEscrowGateway must be used within an EscrowGatewayProvider.");
  }
  return ctx.gateway;
}

export function useEscrowGatewayWithDemo(): DemoEscrowContextValue {
  const ctx = useContext(DemoEscrowContext);
  if (!ctx) {
    throw new Error("useEscrowGatewayWithDemo must be used within an EscrowGatewayProvider.");
  }
  return ctx;
}
