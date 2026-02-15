import { User, Portfolio, Project } from '../types';

// Keys for LocalStorage
const USERS_KEY = 'foliocraft_users';
const PORTFOLIOS_KEY = 'foliocraft_portfolios';

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class DatabaseService {
  private getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private getPortfolios(): Record<string, Portfolio> {
    const data = localStorage.getItem(PORTFOLIOS_KEY);
    return data ? JSON.parse(data) : {};
  }

  private savePortfolios(portfolios: Record<string, Portfolio>) {
    localStorage.setItem(PORTFOLIOS_KEY, JSON.stringify(portfolios));
  }

  async signUp(email: string, password: string, username: string, name: string): Promise<User> {
    await delay(500);
    const users = this.getUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    if (users.find(u => u.username === username)) {
      throw new Error('Username already taken');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username,
      name
    };

    users.push(newUser);
    this.saveUsers(users);
    
    // Initialize empty portfolio
    const portfolios = this.getPortfolios();
    portfolios[newUser.id] = {
      userId: newUser.id,
      displayName: name,
      title: 'Software Developer',
      bio: 'I build things for the web.',
      skills: ['JavaScript', 'React'],
      projects: [],
      theme: 'modern',
      socialLinks: {},
      isPublished: false
    };
    this.savePortfolios(portfolios);

    return newUser;
  }

  async login(email: string, password: string): Promise<User> {
    await delay(500);
    const users = this.getUsers();
    // In a real app, verify password hash
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async getPortfolio(userId: string): Promise<Portfolio | null> {
    await delay(300);
    const portfolios = this.getPortfolios();
    return portfolios[userId] || null;
  }

  async getPortfolioByUsername(username: string): Promise<Portfolio | null> {
    await delay(300);
    const users = this.getUsers();
    const user = users.find(u => u.username === username);
    if (!user) return null;

    const portfolios = this.getPortfolios();
    const portfolio = portfolios[user.id];
    
    if (!portfolio || !portfolio.isPublished) return null;
    return portfolio;
  }

  async savePortfolio(userId: string, portfolioData: Partial<Portfolio>): Promise<Portfolio> {
    await delay(400);
    const portfolios = this.getPortfolios();
    const current = portfolios[userId];
    
    if (!current) throw new Error('Portfolio not found');

    const updated = { ...current, ...portfolioData };
    portfolios[userId] = updated;
    this.savePortfolios(portfolios);
    
    return updated;
  }
}

export const db = new DatabaseService();