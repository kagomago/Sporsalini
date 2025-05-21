import { LocationObject } from 'expo-location';

export interface Post {
  id: string;
  userName: string;
  userAvatar: string;
  timeAgo: string;
  text?: string;
  image?: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export interface Event {
  id: string;
  title: string;
  category: string;
  color: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  attendees: number;
  maxAttendees: number;
  latitude: number;
  longitude: number;
  distance: number;
  isPrivate: boolean;
  image: string;
  createdBy: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  distance: number;
  interests: string[];
  about: string;
  connected: boolean;
}

export interface ForumRoom {
  id: string;
  name: string;
  memberCount: number;
}

export interface ForumMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export interface EventLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Notification {
  id: string;
  type: 'event' | 'like' | 'comment' | 'share';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: {
    userAvatar?: string;
    eventId?: string;
    postId?: string;
    userId?: string;
  };
}