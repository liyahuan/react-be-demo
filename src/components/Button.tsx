import React from 'react';
import './variable.css';
import './button.css';

interface ButtonProps {
  primary?: boolean;
  backgroundColor?: string; 
  size?: 'small' | 'medium' | 'large';
  label: string;
  onClick?: () => void;
}

export const Button = ({ primary = false,size = 'medium',backgroundColor,label,...props}: ButtonProps) => {
  const mode = primary ? 'btn-default' : 'btn-success';
  return (
    <button
      type="button"
      className={['btn', `btn--${size}`, mode].join(' ')}
      style={{ backgroundColor }}
      {...props}
    >
      {label} 
    </button>
  );
};
