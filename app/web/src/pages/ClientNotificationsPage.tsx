import { useState, useEffect } from "react";
import { PageContainer, Icon, Pill, PageHeader, Card } from "@/components/ui/connexo-primitives";
import api from "@/services/api";

interface Notification {
  id: string;
  kind: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

function kindIcon(kind: string): string {
  const map: Record<string, string> = {
    new_client: "person_add",
    doc: "description",
    deadline: "schedule",
    update: "update",
    fee: "paid",
  };
  return map[kind] ?? "notifications";
}

function kindTone(kind: string): string {
  if (kind === "new_client" || kind === "fee") return "bg-secondary/10 text-secondary";
  if (kind === "deadline") return "bg-amber-500/10 text-amber-600";
  return "bg-primary/5 text-primary/30";
}

export function ClientNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<Notification[]>("/cli/notifications");
        setNotifications(data);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Icon name="autorenew" className="text-4xl text-secondary animate-spin" />
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        kicker="Alertas sobre seus processos e vínculos"
        title="Notificações"
        action={
          unreadCount > 0 ? (
            <Pill tone="gold">{unreadCount} {unreadCount === 1 ? "nova" : "novas"}</Pill>
          ) : undefined
        }
      />

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`p-6 rounded-[24px] border transition-all duration-300 cursor-pointer relative ${
                !n.read
                  ? "bg-secondary/[0.03] border-secondary/20"
                  : "bg-white border-outline/20"
              }`}
            >
              {!n.read && <div className="absolute left-5 top-8 w-2 h-2 bg-secondary rounded-full" />}
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${kindTone(n.kind)}`}>
                  <Icon name={kindIcon(n.kind)} className="text-lg" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-black text-primary">{n.title}</p>
                    <span className="text-[9px] font-bold text-primary/30 uppercase tracking-widest shrink-0">
                      {new Date(n.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-xs text-primary/50 leading-relaxed font-medium">{n.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-1 rounded-[32px] border-2 border-dashed border-outline/30">
          <Icon name="notifications_off" className="text-4xl text-primary/10 mb-4" />
          <p className="text-sm font-bold text-primary/30 uppercase tracking-widest">Nenhuma notificação</p>
        </div>
      )}
    </PageContainer>
  );
}
