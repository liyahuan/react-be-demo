import { useEffect, useRef, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom"
import './layout.css';
function Layout (){
  const [name, setName] = useState('')
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const navRef = useRef(null);
  function handlebuttonClick(){
    event?.preventDefault();
    if(/^\s*$/.test(name)){
       console.log('请给input框输入文字')
       setError('Good guess but a wrong answer. Try again!')
    } else{
      navigate(`board/${name}`)
    }
  }
  const windowHeight = window.innerHeight;
  useEffect(() => {
    if (formRef.current && navRef.current ) {
      const stickyHeight = navRef.current.offsetHeight;
      const offsetTop = formRef.current.offsetTop;
      const offsetHeight = formRef.current.offsetHeight;
      const handleScroll = () => {
        const scrollY = window.scrollY;
        console.log(`windowHeight1: ${windowHeight}`)
        console.log(`offsetHeight: ${offsetHeight}`)
        console.log(`offsetTop: ${offsetTop}`)
        console.log(`scrollY: ${scrollY}`)
      if (scrollY > 50 ) {
          console.log('我在页面内');
          setIsScrolled(false);
        } else {
          console.log('我不在页面内');
          setIsScrolled(true);
        }
        // console.log(scrollY)
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }     
    
  }, [formRef]);

  return(
    <>
    <nav ref={navRef}>this is the banner</nav>
    <div className="container">
            
      我是 一级路由layout组件
       {/*  when form not in view，fixed the form position bottom， 
     with windowScroll, form in viewport，remove the fixed position of form*/}
     <div style={{'height':'200px', 'background':'yellowgreen','width':'100%'}}>
      
     </div>
      <form action="" ref={formRef} className = {isScrolled ? 'normalForm' : 'scrolledForm' }>
        <input type="password" value={name} onChange={e => setName(e.target.value)} placeholder="请输入你的名字" />
        <button  onClick={handlebuttonClick}>登录</button>
        <p className="text">{name}</p>
        <p className="error">{error}</p>
      </form>
      {/* <div>
        <ul>
          <li>
            <Link to='/'>面板</Link>
            </li> 
          <li>
          <Link to="/about">关于</Link>
          </li>
        </ul>
      </div> */}
      
      {/* <Outlet/> */}
     
    </div>
    </>
  )
    
}
export default Layout;