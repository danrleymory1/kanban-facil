'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/types';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/services/api.service';
import { MdNotifications, MdCheck, MdDelete, MdCheckCircle } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getUserNotifications();
      setNotifications(data.notifications || []);

      const unread = (data.notifications || []).filter((n: Notification) => !n.lida).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const intervalId = setInterval(loadNotifications, 30000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.notificationId === notificationId ? { ...n, lida: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, lida: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
      const wasUnread = notifications.find(n => n.notificationId === notificationId && !n.lida);
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'mencao':
        return '💬';
      case 'atribuicao':
        return '👤';
      case 'comentario':
        return '💭';
      case 'prazo':
        return '⏰';
      case 'atualizacao':
        return '🔄';
      case 'convite':
        return '📨';
      default:
        return '🔔';
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[var(--content-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface-secondary)] rounded-lg transition"
      >
        <MdNotifications className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[var(--error)] rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 max-h-[600px] overflow-y-auto bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg shadow-2xl z-50">
            {/* Header */}
            <div className="sticky top-0 bg-[var(--surface-primary)] p-4 border-b border-[var(--border-primary)] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--content-primary)]">
                Notificações
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
                >
                  <MdCheckCircle />
                  Marcar todas como lidas
                </button>
              )}
            </div>

            {/* Content */}
            <div className="divide-y divide-[var(--border-secondary)]">
              {loading ? (
                <div className="p-8 flex items-center justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin text-2xl text-[var(--primary)]" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-[var(--content-tertiary)]">
                  Nenhuma notificação
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.notificationId}
                    className={`p-4 hover:bg-[var(--surface-secondary)] transition ${
                      !notif.lida ? 'bg-[var(--primary)] bg-opacity-5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notif.tipo)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--content-primary)] mb-1">
                          {notif.titulo}
                        </p>
                        <p className="text-sm text-[var(--content-secondary)] mb-2">
                          {notif.mensagem}
                        </p>
                        <p className="text-xs text-[var(--content-tertiary)]">
                          {dayjs(notif.createdAt).fromNow()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 flex-shrink-0">
                        {!notif.lida && (
                          <button
                            onClick={() => handleMarkAsRead(notif.notificationId)}
                            className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary)] hover:bg-opacity-10 rounded transition"
                            title="Marcar como lida"
                          >
                            <MdCheck className="text-lg" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.notificationId)}
                          className="p-1.5 text-[var(--error)] hover:bg-[var(--error)] hover:bg-opacity-10 rounded transition"
                          title="Remover"
                        >
                          <MdDelete className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
