import { Crown, Sparkles, TrendingUp, Rocket, Code, PenTool, BarChart2, Palette, Search, Brain, Zap } from 'lucide-react';

export const FILTER_SECTIONS = [
  {
    title: 'Type',
    items: [
      { id: 'all', name: 'All Assistants', icon: Sparkles },
      { id: 'agents', name: 'AI Agents', icon: Brain },
      { id: 'models', name: 'Core Models', icon: Zap },
    ]
  },
  {
    title: 'Featured',
    items: [
      { id: 'top', name: 'Top Rated', icon: Crown },
      { id: 'trending', name: 'Trending Now', icon: TrendingUp },
      { id: 'new', name: 'New & Notable', icon: Rocket },
    ]
  },
  {
    title: 'Categories',
    items: [
      { id: 'coding', name: 'Coding', icon: Code },
      { id: 'writing', name: 'Writing', icon: PenTool },
      { id: 'analysis', name: 'Analysis', icon: BarChart2 },
      { id: 'creative', name: 'Creative', icon: Palette },
      { id: 'research', name: 'Research', icon: Search },
      { id: 'productivity', name: 'Productivity', icon: Brain },
    ]
  }
] as const;