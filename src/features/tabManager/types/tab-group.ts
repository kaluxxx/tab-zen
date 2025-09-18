import type { Tab } from './tab';

export type GroupCategory =
  | 'development'
  | 'social'
  | 'media'
  | 'shopping'
  | 'productivity'
  | 'documentation'
  | 'news'
  | 'entertainment'
  | 'education'
  | 'other';

export interface TabGroup {
  id: string;
  name: string;
  category: GroupCategory;
  tabs: Tab[];
  isExpanded: boolean;
  color?: string;
}

export interface GroupingRule {
  category: GroupCategory;
  name: string;
  patterns: string[];
  priority: number;
}

export interface GroupingConfig {
  enabled: boolean;
  rules: GroupingRule[];
  defaultCategory: GroupCategory;
}