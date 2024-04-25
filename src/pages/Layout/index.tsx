import { useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom"
import './layout.css';
function Layout (){
  const [name, setName] = useState('')
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  function handlebuttonClick(){
    event?.preventDefault();
    if(/^\s*$/.test(name)){
       console.log('请给input框输入文字')
       setError('Good guess but a wrong answer. Try again!')
    } else{
      navigate(`board/${name}`)
    }
  }
  return(
    <div>
      我是 一级路由layout组件
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
      <form action="">
        <input type="password" value={name} onChange={e => setName(e.target.value)} placeholder="请输入你的名字" />
        <button  onClick={handlebuttonClick}>登录</button>
        <p className="text">{name}</p>
        <p className="error">{error}</p>
      </form>
    </div>
  )
    
}
export default Layout;