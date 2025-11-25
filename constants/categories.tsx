import { JSX } from 'react'
import {
  Utensils,
  Car,
  ShoppingBag,
  Heart,
  Home,
  MoreHorizontal,
} from 'lucide-react'

export type Category = {
  id: string
  label: string
  color: string
  icon: JSX.Element
}

export const CATEGORY_OPTIONS: Category[] = [
  { id: 'food',
    label: 'Food',
    color: '#F87171',
    icon: <Utensils size={16} /> },
  {
    id: 'transport',
    label: 'Transport',
    color: '#60A5FA',
    icon: <Car size={16} />,
  },
  {
    id: 'shopping',
    label: 'Shopping',
    color: '#F472B6',
    icon: <ShoppingBag size={16} />,
  },
  { id: 'home',
    label: 'Home',
    color: '#4ADE80',
    icon: <Home size={16} /> },
  {
    id: 'health',
    label: 'Health',
    color: '#C084FC',
    icon: <Heart size={16} />,
  },
  {
    id: 'other',
    label: 'Other',
    color: '#9CA3AF',
    icon: <MoreHorizontal size={16} />,
  },
]
