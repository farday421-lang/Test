export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  tags: string[];
}

export type ThemeTemplate = 'minimal' | 'modern' | 'creative';

export interface Portfolio {
  userId: string;
  displayName: string;
  title: string;
  bio: string;
  skills: string[];
  projects: Project[];
  theme: ThemeTemplate;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  isPublished: boolean;
  publishedAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}