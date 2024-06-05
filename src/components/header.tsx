import { Button } from "./Button";
import './header.scss';

interface HeaderProps {
    backgroundColor?: string; 
    /** the heading for header */ 
    heading: string;
    /** the subtitle for header */
    subtext: string;
    headercon: string
    imageBoolean: boolean
}

function HeaderImage({testimage,isImage}:{testimage:any,isImage:boolean}){
    let isContent = testimage
    if (isImage){
       isContent = (
        <div className="hero-custom__pic">
            <img src="https://fakeimg.pl/300/" />
        </div>
       )
    } 
    return(
        <>
            {isContent}
        </>
    )
}
export const Header = ({backgroundColor,heading,subtext,headercon,imageBoolean=true,...props}:HeaderProps) =>{  
    return(
        <>
            <div className="hero-custom"
            title="Woman wearing diamond engagement ring and distinctive diamond wedding bands"
             style={{ backgroundColor }}
                {...props}>
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
                    <HeaderImage isImage={imageBoolean} testimage={undefined} />
                </div>
            </div>
        </>
    )
}