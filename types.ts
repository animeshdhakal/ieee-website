export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  linkedin?: string;
}

export interface Committee {
  title: string;
  members: TeamMember[];
}

export enum EventCategory {
  WORKSHOP = 'Workshop',
  SEMINAR = 'Seminar',
  COMPETITION = 'Competition',
  SOCIAL = 'Social',
}

export interface IeeeEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  category: EventCategory;
  imageUrl?: string;
  isUpcoming: boolean;
}

export interface NavLink {
  label: string;
  path: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole?: string;
  date: string;
  category: string;
  imageUrl?: string;
  readTime: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
}