'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, BellRing, Info, AlertTriangle, CheckCircle2, XCircle, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/authStore';
import api from '@/src/services/api';
import toast from 'react-hot-toast';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      fetchNotifications();
      updateGreeting();
      setUserName(user.firstName || user.email?.split('@')[0] || 'User');

      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      // Update greeting every minute
      const greetingInterval = setInterval(updateGreeting, 60000);

      return () => {
        clearInterval(interval);
        clearInterval(greetingInterval);
      };
    }
  }, [user]);

  const updateGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      const notifs = response.data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n: Notification) => !n.isRead).length);
    } catch (error: any) {
      // Silently fail - don't block the UI if notifications endpoint fails
      if (error?.response?.status !== 404) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch notifications:', error?.message || error);
      }
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent marking as read when clicking delete
    try {
      await api.delete(`/notifications/${id}`);
      const deletedNotif = notifications.find(n => n.id === id);
      setNotifications(notifications.filter(n => n.id !== id));
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await api.post('/notifications/delete-all');
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications deleted');
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
      toast.error('Failed to delete notifications');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'ERROR': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'SUCCESS': return 'bg-green-50 hover:bg-green-100';
      case 'ERROR': return 'bg-red-50 hover:bg-red-100';
      case 'WARNING': return 'bg-yellow-50 hover:bg-yellow-100';
      default: return 'bg-blue-50 hover:bg-blue-100';
    }
  };

  return (
    <div className="h-16 bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm border-b border-gray-200/50 shadow-sm flex items-center justify-between px-4 md:px-6 relative overflow-hidden">
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient" />

      {/* Left Section - Welcome Message & Mobile Menu */}
      <div className="flex-1 relative z-10 flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        {user && (
          <div className="flex items-center gap-2.5 group">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow hidden sm:flex">
                <span className="text-xl">👋</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:block">{greeting}</span>
                <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent leading-tight">
                  {userName}
                </h2>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4 relative z-10">
        {/* Notifications - Enhanced */}
        <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all group"
            >
              {unreadCount > 0 ? (
                <BellRing className="h-5 w-5 text-blue-600 animate-pulse" />
              ) : (
                <Bell className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              )}
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center text-[10px] font-bold bg-gradient-to-r from-red-500 to-red-600 border-2 border-white shadow-lg animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 md:w-96 shadow-2xl border-2 border-gray-100 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-base bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 font-bold shadow-sm">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-8 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg px-3"
                  >
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                    Mark read
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={deleteAllNotifications}
                    className="h-8 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-3"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <div className="max-h-[32rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">No notifications</p>
                  <p className="text-xs text-gray-400">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`p-4 cursor-pointer flex gap-3 items-start group transition-all relative ${!notification.isRead
                        ? getNotificationBgColor(notification.type) + ' border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                        }`}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                    >
                      {/* Icon */}
                      <div className="mt-0.5 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-bold text-sm text-gray-900 leading-tight">{notification.title}</p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-2 mb-2">{notification.message}</p>
                        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                          {new Date(notification.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => deleteNotification(notification.id, e)}
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date & Time - Hidden on mobile */}
        <div className="hidden md:flex flex-col items-end px-4 py-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50 shadow-sm">
          <div className="text-xs font-semibold text-gray-700">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </div>
          <div className="text-[10px] font-medium text-gray-500">
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

