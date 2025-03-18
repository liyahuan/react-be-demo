import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import './layout.scss';
function Layout (){
  const [name, setName] = useState('')
  const [error, setError] = useState('null');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const navRef = useRef(null);
  function handlebuttonClick(){
    // event?.preventDefault();
    if(!(/^liyahuan$/.test(name))){
       console.log('请给input框输入文字')
       setError('Good guess but a wrong answer. Try again!')
    } else{
      navigate(`board/${name}`)
    }
  }
  function handleResetClick(){
    // event?.preventDefault();
    setName('');
  }
  function IsScrolled(){
    setTimeout(function(){
      setIsScrolled(true);
    },300)
  }
  function NoScrolled(){
    setTimeout(function(){
      setIsScrolled(false);
    },300)
  }
  useEffect(() => {
    if (formRef.current && navRef.current ) {
      const stickyHeight = (navRef.current as HTMLElement).offsetHeight;
      const offsetTop = (formRef.current as HTMLElement).offsetTop;
      const offsetHeight = (formRef.current as HTMLElement).offsetHeight;
      const windowHeight = window.innerHeight;
      console.log(`windowHeight1: ${windowHeight}`)
      console.log(`offsetHeight: ${offsetHeight}`)
      console.log(`offsetTop: ${offsetTop}`)
      if (offsetTop < windowHeight){
        console.log('我在页面内');
        NoScrolled()
      } else{
        console.log('我不在页面内');
        IsScrolled()
        const handleScroll = () => {
          const scrollY = window.scrollY;
          //document.documentElement.scrollTop == window.scrollY
          console.log(`scrollY: ${scrollY}`)
          // > offsetTop - windowHeight 
          {/* < offsetTop + offsetHeight */}
        if (scrollY >= offsetTop - windowHeight  &&  scrollY < offsetTop + offsetHeight - stickyHeight ) {
            console.log('我在页面内');
            //在页面内的规则是元素的顶部冒出windowView的底部，元素的底部离开windowView的顶部，
            NoScrolled()
          } else {
            console.log('我不在页面内');
            IsScrolled()
          }
        };  
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }     
    }    
  }, []);
  return(
    <>
    <nav className="tw:text-white! tw:text-center tw:text-xl" ref={navRef}>this is the banner</nav>
    <div className="container tw:mx-auto">
      <div className="tw:text-left tw:mr-auto tw:text-2xl tw:py-1">demo列表</div>
        <ul className="tw:w-full tw:text-left tw:gap-5 tw:bg-white tw:text-xl tw:[&>li]:py-2" style={{fontSize:'20px'}}>
          <li>
            <Link to='/'>面板入口→</Link>
            </li> 
          <li>
            <Link to="/form">Form表单→</Link>
          </li>
          <li>
            <Link to="/slider">Slider test→</Link>
          </li>
        </ul>
    </div>
    <div className="container tw:mx-auto tw:p-0">
      我是 一级路由layout组件
       {/*  when form not in view，fixed the form position bottom， 
     with windowScroll, form in viewport，remove the fixed position of form*/}
      <div className="tw:h-[900px] tw:bg-yellow-200 tw:w-full tw:text-center">我是占位的内容</div>
      <div className= {`formWrapper  ${isScrolled ? 'fixedForm' : 'normalForm'} `  }>
        <form className="tw:space-y-4 tw:p-3" action="" ref={formRef}>
          <div>
            <input className="tw:w-full" type="password" value={name} onChange={e => setName(e.target.value)} placeholder="请输入你的名字" />
          </div>
          <div className=" tw:flex tw:justify-between tw:space-x-4">
            <button className="tw:w-full tw:py-1 tw:bg-blue-700 tw:text-white" onClick={handlebuttonClick}>登录</button>
            <button className="tw:w-full tw:py-1 tw:bg-blue-700 tw:text-white" onClick={handleResetClick}>重置</button>
          </div>
          <p className="text" style={{'color':'white'}}>这是输入的内容: {name}</p>
          <p className="error" style={{'color':'white'}}>这是报的错误:  {error}</p>
        </form>
      </div>
      <div className="tw:h-[900px] tw:w-full tw:text-center" style={{background:'orange'}}>我是占位的内容</div>      
      {/* <Outlet/> */}
     
    </div>
    </>
  )
    
}
export default Layout;