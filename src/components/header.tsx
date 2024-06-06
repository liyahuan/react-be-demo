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

function HeaderImage({isImage}:{isImage:boolean}){
    // testimage, testimage:any,
    // let isContent = testimage
    // 条件渲染： if的写法，好麻烦呀。需要增加一个变量，来存放应该显示的html代码。这种方式是最冗长的，也是最灵活的。
    // if (isImage){
    //    isContent = (
    //     <div className="hero-custom__pic">
    //         <img src="https://fakeimg.pl/300/" />
    //     </div>
    //    )
    // } 
    // return(
    //     <>
    //         {isContent}
    //     </>
    // )
    //三目运算符，这种简单，即开即用型。
    return(
        <>
            {isImage ?  (<div className="hero-custom__pic"><img src="https://fakeimg.pl/300/" /></div>) : (null) }
        </>
    )
    // && 与运算符。但是数字不能放到 与运算符的左侧，代码少的地方，用这种吧。

}
export const Header = ({backgroundColor,heading,subtext,headercon,imageBoolean=true,...props}:HeaderProps) =>{  
    return(
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
                <HeaderImage isImage={imageBoolean}/>
            </div>
        </div>
    )
}