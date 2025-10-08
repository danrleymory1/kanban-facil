import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRateLimit, compose } from '@/lib/auth-middleware';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/services/mongodb.service';

// GET /api/notifications - Get user notifications
export const GET = withAuth(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const notifications = await getUserNotifications(user.uid, unreadOnly);

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    return NextResponse.json(
      { error: 'Failed to get notifications' },
      { status: 500 }
    );
  }
});

// POST /api/notifications - Mark notification as read
export const POST = compose(withRateLimit(20), withAuth)(async (request, user) => {
  try {
    const body = await request.json();
    const { notificationId, action } = body;

    if (action === 'markAsRead' && notificationId) {
      await markNotificationAsRead(notificationId, user.uid);
      return NextResponse.json({ success: true });
    }

    if (action === 'markAllAsRead') {
      await markAllNotificationsAsRead(user.uid);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing notificationId' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
});

// DELETE /api/notifications - Delete notification
export const DELETE = compose(withRateLimit(20), withAuth)(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('notificationId');

    if (!notificationId) {
      return NextResponse.json(
        { error: 'notificationId is required' },
        { status: 400 }
      );
    }

    await deleteNotification(notificationId, user.uid);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
});
