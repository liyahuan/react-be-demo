import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import './layout.scss';
function Layout (){
  const RIGHT_user = 'liyahuan';
  const RIGHT_pwd = '123456';
  const MAX_attempt = 3;
  let CURRENT_attempt = 0;
  const [name, setName] = useState('')
  const [password, setPwd] = useState('')
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState('null');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const navRef = useRef(null);
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
  function handlebuttonClick(event: { preventDefault: () => void; }){
    event?.preventDefault();
    //useless !(/^liyahuan$/.test(name))
    //1、验证非空，也可以用假值特性，因为在js中 空字符串是假值。
    // ?是为了验证，是否非空的
    // if(!name?.trim '' || password!.?trim()){
    if(name.trim() == '' || password.trim() ==''){
      setError('用户名和密码不能为空')
      //尝试一次登录后，当前尝试次数+1
      CURRENT_attempt++; 
      //当前尝试次数>最大可尝试次数[3]
      if(CURRENT_attempt >= MAX_attempt){
        setError('账户已经锁定，请10s后尝试');
        setIsLocked(true);
      //账户锁定
      }
      return
    }
    
    //2、验证是对的，否则 currentAttempt+1
    if(name === RIGHT_user && password === RIGHT_pwd){
       navigate(`board/${name}`)  
    } else{
      CURRENT_attempt++
      console.log(`请给input框输入文字 ${CURRENT_attempt}`)
      setError('Good guess but a wrong answer. Try again!')
      if(CURRENT_attempt >= MAX_attempt){
        setError('账户已经锁定，请10s后尝试');
        setIsLocked(true);
      }
    }
  }
  function handleResetClick(){
    // event?.preventDefault();
    setName('');
    CURRENT_attempt = 0;
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
          <li>
            <Link to="/video-editor">Video Editor→</Link>
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
            <input className="tw:w-full" type="name" value={name}
            onChange={e => setName(e.target.value)} disabled={isLocked} placeholder="请输入你的名字" />
            <input className="tw:w-full" type="password" value={password}
             onChange={e => setPwd(e.target.value)} disabled={isLocked} placeholder="请输入你的密码" />
          </div>
          <div className="tw:flex tw:justify-between tw:space-x-4">
            <button className="tw:w-full tw:py-1 tw:bg-blue-700 tw:text-white"
             onClick={handlebuttonClick}  disabled={isLocked}>登录</button>
            <button className="tw:w-full tw:py-1 tw:bg-blue-700 tw:text-white"
             onClick={handleResetClick}  disabled={isLocked}>重置</button>
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