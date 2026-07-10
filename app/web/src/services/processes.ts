import api from "./api";
import type { Process } from "@/types";

export interface TimelineEntry {
  action: string;
  time: string;
  user: string;
}

export async function getProcess(id: string): Promise<Process> {
  const { data } = await api.get<Process>(`/adv/processes/${id}`);
  return data;
}

export async function listProcesses(): Promise<Process[]> {
  const { data } = await api.get<Process[]>("/adv/processes");
  return data;
}

export async function getProcessTimeline(processId: string): Promise<TimelineEntry[]> {
  try {
    const { data } = await api.get<TimelineEntry[]>(`/adv/processes/${processId}/timeline`);
    return data;
  } catch {
    return [];
  }
}
