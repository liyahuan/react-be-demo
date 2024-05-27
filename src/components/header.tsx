import { Button } from "./Button";
import './header.scss';

interface HeaderProps {
    backgroundColor?: string; 
    label: string;
}

export const Header = ({backgroundColor,label,...props}:HeaderProps) =>{
    return(
        <>
            <div className="hero-custom"
            title="Woman wearing diamond engagement ring and distinctive diamond wedding bands" style={{ backgroundColor }}
            {...props}>
                <div className="hero-custom__cont" style={{left:'0', right:'50%'}}>
                    <div className="hero-custom__body" style={{textAlign: 'left'}}>
                        <div className="hero-custom__heading">
                            <div className="hero-custom__title">{label}</div>
                        </div>
                        <Button
                            label="Button"
                            onClick={() => {}}
                            primary
                            size="medium"
                            />
                    </div>
                </div>
            </div>
        </>
    )
}