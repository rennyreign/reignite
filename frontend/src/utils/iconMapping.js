import {
  MessageCircle, Brain, Activity, Heart, Users, Star, Palette, Wrench,
} from 'lucide-react';

// Map emoji icons from database to Lucide React components
export const getIconComponent = (emojiIcon) => {
  const iconMap = {
    '💬': MessageCircle,
    '🧠': Brain,
    '🏃': Activity,
    '💛': Heart,
    '🤝': Users,
    '🌟': Star,
    '🎨': Palette,
    '🔧': Wrench,
  };
  
  return iconMap[emojiIcon] || MessageCircle; // Default fallback
};

// Render an icon with consistent styling
export const renderIcon = (emojiIcon, { size = 24, strokeWidth = 1.5, color = '#3D7A5F' } = {}) => {
  const IconComponent = getIconComponent(emojiIcon);
  return <IconComponent size={size} strokeWidth={strokeWidth} color={color} />;
};
