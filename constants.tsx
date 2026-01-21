
import React from 'react';
import { 
  MessageSquare, 
  History, 
  AlertTriangle, 
  Target, 
  Smile, 
  Sparkles,
  Award,
  Box,
  Cpu,
  Cloud,
  Layers,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { Category } from './types';

export const COLORS = {
  amazonOrange: '#FF9900',
  deepNavy: '#232F3E',
  accentGold: '#FFB84D',
  background: '#FAFAF8',
  charcoal: '#2D3748',
};

export const CATEGORY_METADATA: Record<Category, { icon: React.ReactNode; color: string }> = {
  [Category.QUOTE]: { icon: <MessageSquare className="w-4 h-4" />, color: '#FEF3C7' }, // Amber
  [Category.MEMORY]: { icon: <History className="w-4 h-4" />, color: '#DBEAFE' }, // Blue
  [Category.ESCALATION]: { icon: <AlertTriangle className="w-4 h-4" />, color: '#FEE2E2' }, // Red
  [Category.LEADERSHIP]: { icon: <Target className="w-4 h-4" />, color: '#D1FAE5' }, // Green
  [Category.JOKE]: { icon: <Smile className="w-4 h-4" />, color: '#F3E8FF' }, // Purple
  [Category.WISHES]: { icon: <Sparkles className="w-4 h-4" />, color: '#FFEDD5' }, // Orange light
  [Category.CUSTOM]: { icon: <Zap className="w-4 h-4" />, color: '#E0F2FE' }, // Light Blue
};

export const LEADERSHIP_PRINCIPLES = [
  "Customer Obsession",
  "Ownership",
  "Invent and Simplify",
  "Are Right, A Lot",
  "Learn and Be Curious",
  "Hire and Develop the Best",
  "Insist on the Highest Standards",
  "Think Big",
  "Bias for Action",
  "Frugality",
  "Earn Trust",
  "Dive Deep",
  "Have Backbone; Disagree and Commit",
  "Deliver Results",
  "Strive to be Earth's Best Employer",
  "Success and Scale Bring Broad Responsibility"
];

export const AWS_ICONS = [
  <Cpu key="cpu" className="w-6 h-6 text-gray-300" />,
  <Cloud key="cloud" className="w-6 h-6 text-gray-300" />,
  <Layers key="layers" className="w-6 h-6 text-gray-300" />,
  <ShoppingBag key="shop" className="w-6 h-6 text-gray-300" />,
  <Box key="box" className="w-6 h-6 text-gray-300" />,
  <Award key="award" className="w-6 h-6 text-gray-300" />
];
