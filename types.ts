
export enum Category {
  QUOTE = "Favorite Mark Quote",
  MEMORY = "Favorite Memory",
  ESCALATION = "Best Escalation Story",
  LEADERSHIP = "Leadership Lesson",
  JOKE = "Inside Joke",
  WISHES = "Well Wishes",
  CUSTOM = "Custom Shoutout"
}

export interface Message {
  id: string;
  name: string;
  category: Category;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  timestamp: number;
  rotation: number;
  color: string;
  leadershipPrinciple?: string;
}

export interface Stats {
  totalMessages: number;
  teamMembers: number;
  daysAtAmazon: number;
}
