import api from "./api";

// ---------------------------------------------------------------------------
// Consentimento LGPD
// ---------------------------------------------------------------------------

export interface ConsentRecord {
  id: string;
  client_id: string;
  link_id: string;
  consented_at: string;
  ip_address: string;
  user_agent: string;
  text_version: string;
}

/**
 * Registra o consentimento LGPD do cliente para um vínculo.
 * POST /api/cli/consent
 */
export async function registerConsent(linkId: string) {
  const res = await api.post<{ success: boolean; consent: ConsentRecord }>(
    "/cli/consent",
    { link_id: linkId },
  );
  return res.data;
}

/**
 * Verifica se existe consentimento para um vínculo.
 * GET /api/cli/consent/check/{link_id}
 */
export async function checkConsent(linkId: string) {
  const res = await api.get<{ has_consent: boolean }>(
    `/cli/consent/check/${linkId}`,
  );
  return res.data;
}

// ---------------------------------------------------------------------------
// Permissões de Documento (Advogado)
// ---------------------------------------------------------------------------

export interface DocPermission {
  id: string;
  document_id: string;
  link_id: string;
  granted_by: string;
  granted_at: string;
  revoked_at: string | null;
}

/**
 * Alterna (concede/revoga) permissão de um documento para um vínculo.
 * POST /api/adv/documents/{id}/permissions/{link_id}
 */
export async function toggleDocPermission(
  documentId: string,
  linkId: string,
) {
  const res = await api.post<{
    success: boolean;
    granted: boolean;
    status: string;
  }>(`/adv/documents/${documentId}/permissions/${linkId}`);
  return res.data;
}

/**
 * Lista permissões ativas de documentos para um vínculo.
 * GET /api/adv/links/{id}/permissoes
 */
export async function listDocPermissionsByLink(linkId: string) {
  const res = await api.get<{ permissions: DocPermission[] }>(
    `/adv/links/${linkId}/permissoes`,
  );
  return res.data;
}

/**
 * Lista permissões de um documento específico.
 * GET /api/adv/documents/{id}/permissoes
 */
export async function listDocPermissionsByDocument(documentId: string) {
  const res = await api.get<{ permissions: DocPermission[] }>(
    `/adv/documents/${documentId}/permissoes`,
  );
  return res.data;
}

// ---------------------------------------------------------------------------
// Solicitação de Documento (Advogado → Cliente)
// ---------------------------------------------------------------------------

export interface DocumentRequest {
  id: string;
  process_id: string;
  requested_by: string;
  client_id: string;
  description: string;
  status: "pendente" | "atendido" | "cancelado";
  created_at: string;
  updated_at: string;
}

/**
 * Solicita um documento do advogado ao cliente.
 * POST /api/adv/processes/{id}/solicitar-doc
 */
export async function requestDocument(
  processId: string,
  data: { description: string; client_id: string },
) {
  const res = await api.post<{ success: boolean; request: DocumentRequest }>(
    `/adv/processes/${processId}/solicitar-doc`,
    data,
  );
  return res.data;
}

/**
 * Lista solicitações de documento do cliente autenticado.
 * GET /api/cli/solicitacoes
 */
export async function listClientDocumentRequests() {
  const res = await api.get<{ requests: DocumentRequest[] }>(
    "/cli/solicitacoes",
  );
  return res.data;
}

/**
 * Lista solicitações de documento de um processo (advogado).
 * GET /api/adv/processes/{id}/solicitacoes
 */
export async function listProcessDocumentRequests(processId: string) {
  const res = await api.get<{ requests: DocumentRequest[] }>(
    `/adv/processes/${processId}/solicitacoes`,
  );
  return res.data;
}
