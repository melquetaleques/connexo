import { useState, useEffect } from "react";
import { Icon, Pill } from "@/components/ui/connexo-primitives";
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

export function NotificationCenter() {
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

  return (
    <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-outline/30 overflow-hidden">
      <div className="p-8 border-b border-outline/30 bg-surface-1 flex items-center justify-between">
        <h3 className="text-xl font-black text-primary tracking-tight">Notificações</h3>
        {unreadCount > 0 && <Pill tone="gold">{unreadCount} Novas</Pill>}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="autorenew" className="text-2xl text-secondary animate-spin" />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-8 border-b border-outline/20 hover:bg-surface-1 transition-colors cursor-pointer relative ${!n.read ? 'bg-secondary/[0.02]' : ''}`}
            >
              {!n.read && <div className="absolute left-4 top-10 w-1.5 h-1.5 bg-secondary rounded-full" />}
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${kindTone(n.kind)}`}>
                  <Icon name={kindIcon(n.kind)} className="text-lg" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-black text-primary">{n.title}</p>
                    <span className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">
                      {new Date(n.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-xs text-primary/50 leading-relaxed font-medium">{n.body}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <Icon name="notifications_off" className="text-3xl text-primary/10 mb-2" />
            <p className="text-xs font-bold text-primary/30 uppercase tracking-widest">Tudo limpo por aqui</p>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-6 bg-surface-2 text-center">
          <button className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
            Marcar todas como lidas
          </button>
        </div>
      )}
    </div>
  );
}
