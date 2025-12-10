import React, { memo } from 'react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-start p-6 bg-white border border-coffee-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-coffee-300 transition-all duration-300 group text-left w-full h-full"
  >
    <div className="p-3 bg-coffee-50 rounded-xl text-coffee-600 mb-4 group-hover:bg-coffee-600 group-hover:text-white transition-colors">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-brand font-bold text-coffee-900 mb-2 uppercase tracking-wide">{title}</h3>
    <p className="text-coffee-600 text-sm leading-relaxed">{description}</p>
  </button>
);

export default memo(FeatureCard);