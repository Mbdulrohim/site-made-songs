import React from 'react';
import giftBagImg from '../assets/IMage.png';
import './GiftBagVisual.css';

interface GiftBagVisualProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export const GiftBagVisual: React.FC<GiftBagVisualProps> = ({
  size = 'md',
  className = '',
  animate = true,
}) => {
  return (
    <div className={`gift-bag-container gift-bag-${size} ${animate ? 'gift-bag-animated' : ''} ${className}`}>
      {/* Ambient background glow */}
      <div className="gift-bag-glow" />

      {/* Rendered illustration */}
      <div className="gift-bag-image-wrapper">
        <img
          src={giftBagImg}
          alt="Gift box in cellophane bag"
          className="gift-bag-img"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default GiftBagVisual;
