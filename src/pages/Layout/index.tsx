import { useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom"

function Layout (){
  const [name, setName] = useState('')

  const navigate = useNavigate();
  function handlebuttonClick(){
    event?.preventDefault();
    navigate(`board/${name}`)
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
        <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="请输入你的名字" />
        <button onClick={handlebuttonClick}>登录</button>
        <p>{name}</p>

      </form>
    </div>
  )
    
}
export default Layout;