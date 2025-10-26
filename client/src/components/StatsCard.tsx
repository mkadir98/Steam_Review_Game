import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: string;
  label: string;
  value: number | string;
  bgColor?: string;
  animate?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  icon, 
  label, 
  value, 
  bgColor = 'bg-slate-800',
  animate = true 
}) => {
  const CardComponent = animate ? motion.div : 'div';
  const cardProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <CardComponent
      {...cardProps}
      className={`${bgColor} rounded-xl p-6 border border-slate-700 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-white text-3xl font-bold">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </CardComponent>
  );
};

export default StatsCard;

