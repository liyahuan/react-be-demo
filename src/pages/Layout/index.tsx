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
    <nav ref={navRef}>this is the banner</nav>
    <div>
        <ul style={{listStyle:'none',display:'flex',columnGap:'20px'}}>
          <li>
            <Link to='/'>面板入口→</Link>
            </li> 
          <li>
          <Link to="/form">Form表单→</Link>
          </li>
        </ul>
      </div>
    <div className="container">
      我是 一级路由layout组件
       {/*  when form not in view，fixed the form position bottom， 
     with windowScroll, form in viewport，remove the fixed position of form*/}
      <div style={{height:'900px', background:'yellowgreen',width:'100%'}}>我是占位的内容</div>
      <div className= {`formWrapper  ${isScrolled ? 'fixedForm' : 'normalForm'} `  }>
        <form action="" ref={formRef}>
          <input type="password" value={name} onChange={e => setName(e.target.value)} placeholder="请输入你的名字" />
          <button onClick={handlebuttonClick}>登录</button>
          <button onClick={handleResetClick}>重置</button>
          <p className="text" style={{'color':'white'}}>这是输入的内容: {name}</p>
          <p className="error" style={{'color':'white'}}>这是报的错误:  {error}</p>
        </form>
      </div>
      <div style={{height:'900px', background:'orange',width:'100%'}}>我是占位的内容</div>      
      {/* <Outlet/> */}
     
    </div>
    </>
  )
    
}
export default Layout;