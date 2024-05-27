import './variable.css';
import './button.scss';

interface ButtonProps {
  primary?: boolean;
  warning?: boolean;
  backgroundColor?: string; 
  size?: 'small' | 'medium' | 'large';
  label: string;
  onClick?: () => void;
}

export const Button = ({ primary = false, warning = false, size = 'medium',backgroundColor,label,...props}: ButtonProps) => {
  const mode = primary ? 'btn-success' : '';
  const mode2 = warning ? 'btn-warning' : '';
  return (
    <>
    <button
      type="button"
      className={['btn btn--outline', `btn--${size}`, mode, mode2].join(' ')}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>     
    </>
    
  );
};