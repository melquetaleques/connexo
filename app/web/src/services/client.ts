import api from "./api";
import { Process } from "@/types";

export interface ClientProcess extends Process {
  lawyer_name: string;
  accountant_id?: string;
  accountant_name?: string;
}

export async function listMyProcesses() {
  const { data } = await api.get<ClientProcess[]>("/cli/processes");
  return data;
}

export async function bindAccountantToProcess(processId: string, accountantId: string) {
  const { data } = await api.post(`/cli/vincular-contador`, {
    process_id: processId,
    accountant_id: accountantId,
  });
  return data;
}
