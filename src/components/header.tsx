import { Button } from "./Button";
import './header.scss';

interface HeaderProps {
    backgroundColor?: string; 
    /** the heading for header */ 
    heading: string;
    /** the subtitle for header */
    subtext: string;
    headercon: string
}
export const Header = ({backgroundColor,heading,subtext,headercon,...props}:HeaderProps) =>{
    function headerCon({ ISimage, IStext }: { ISimage: boolean, IStext: boolean }) {
        if (ISimage) {
            return (
                <>
                    <div className="hero-custom__flex">
                        <div className="hero-custom__cont" style={{ left: '5%' }}>
                            <div className="hero-custom__body" style={{ textAlign: 'left' }}>
                                <div className="hero-custom__heading">
                                    <div className="hero-custom__title">{heading}</div>
                                </div> 
                                <p className="hero-custom__subtext">{subtext}</p>
                                <Button
                                    label="Button"
                                    onClick={() => {}}
                                    primary
                                    size="medium"
                                />
                            </div>
                        
                        </div>
                        <div>
                            <img src="https://fakeimg.pl/300/" />
                        </div>
                    </div>
                </>
                
            );
        } else if (IStext) {
            return (
                <div className="hero-custom__cont" style={{ left: '5%' }}>
                    <div className="hero-custom__body" style={{ textAlign: 'left' }}>
                        <div className="hero-custom__heading">
                            <div className="hero-custom__title">{heading}</div>
                        </div>
                        <p className="hero-custom__subtext">{subtext}</p>
                        <Button
                            label="Button"
                            onClick={() => {}}
                            primary
                            size="medium"
                        />
                    </div>
                </div>
            );
        }
        return null;
    }       
    return(
        <>
            <div className="hero-custom"
            title="Woman wearing diamond engagement ring and distinctive diamond wedding bands" style={{ backgroundColor }}
            {...props}>
                {headerCon({ ISimage: true, IStext: false })}
            </div>
        </>
    )
}