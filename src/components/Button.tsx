import './variable.css';
import './button.scss';
import styled  from 'styled-components';

const PrimaryBlue: string = "#0400d2";
const SecondaryBlue: string = "#0400f8";
const TertiaryBlue: string = "#029964";

const myButton = styled.button`
    padding: 12px 24px;
    font-size: 1rem;
    border-radius: 2px;
    min-width: 100px;
    cursor: pointer;
    font-family: "Roboto  Mono", monospace;
`;

const PrimaryButton = styled(myButton)`
    background-color: ${PrimaryBlue};
    border: 1px solid ${PrimaryBlue};
    color: white;
`;
  
const SecondaryButton = styled(myButton)`
    background-color: transparent;
    border: 1px solid ${SecondaryBlue};
    color: ${SecondaryBlue};
` ;
const TertiaryButton = styled(myButton)`
    background-color: transparent;
    border: none;
    color: ${TertiaryBlue};
`;




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
    <>
    <PrimaryButton
      type="button"
      className={['btn', `btn--${size}`, mode].join(' ')}
      style={{ backgroundColor }}
      {...props}
    >
      {label} 
    </PrimaryButton>   
    <SecondaryButton>Goodbye World</SecondaryButton>
    <TertiaryButton>Hey World</TertiaryButton>
    </>
    
  );
};