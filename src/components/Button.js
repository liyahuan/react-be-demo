import styled from 'styled-components';

const PrimaryBlue = "#0400d2";
const SecondaryBlue = "#0400f8";
const TertiaryBlue = "#029964";

export const Button = styled.button`
    padding: 12px 24px;
    font-size: 1rem;
    border-radius: 2px;
    min-width: 100px;
    cursor: pointer;
    font-family: "Roboto  Mono", monospace;
`;

const PrimaryButton = styled(Button)`
    background-color: ${PrimaryBlue};
    border: 1px solid ${PrimaryBlue};
    color: white;
`;
  
export const SecondaryButton = styled(Button)`
    background-color: transparent;
    border: 1px solid ${SecondaryBlue};
    color: ${SecondaryBlue};
` ;
export const TertiaryButton = styled(Button)`
    background-color: transparent;
    border: none;
    color: ${TertiaryBlue};
`;
export default PrimaryButton;