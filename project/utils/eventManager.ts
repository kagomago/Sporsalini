import { Event, EventLocation, Notification } from './types';
import { mockEvents } from './mockData';

class EventManager {
  private static instance: EventManager;
  private events: Event[] = [...mockEvents];
  private notifications: Notification[] = [];
  private listeners: ((events: Event[]) => void)[] = [];
  private notificationListeners: ((notification: Notification) => void)[] = [];

  private constructor() {}

  static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  addEvent(event: Event) {
    this.events.unshift(event);
    this.notifyEventListeners();
    return event;
  }

  getEvents(): Event[] {
    return this.events;
  }

  addEventListener(listener: (events: Event[]) => void) {
    this.listeners.push(listener);
  }

  removeEventListener(listener: (events: Event[]) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  addNotificationListener(listener: (notification: Notification) => void) {
    this.notificationListeners.push(listener);
  }

  removeNotificationListener(listener: (notification: Notification) => void) {
    this.notificationListeners = this.notificationListeners.filter(l => l !== listener);
  }

  private notifyEventListeners() {
    this.listeners.forEach(listener => listener(this.events));
  }

  private notifyNotificationListeners(notification: Notification) {
    this.notificationListeners.forEach(listener => listener(notification));
  }

  createEventNotification(event: Event) {
    const notification: Notification = {
      id: `notification-${Date.now()}`,
      type: 'event',
      title: 'New Event Created',
      message: `${event.createdBy} created a new event: ${event.title}`,
      timestamp: new Date().toISOString(),
      read: false,
      data: event
    };

    this.notifications.push(notification);
    this.notifyNotificationListeners(notification);
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }
}

export default EventManager;