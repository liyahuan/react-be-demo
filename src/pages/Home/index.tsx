import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";

function Home() {
  const navigate = useNavigate();
  function handlebuttonClick(){
    navigate("about")
  }
  return (
    <div style={{textAlign:'left'}}>
      <h2>Home-积累</h2>
      <dl>
        <dt>
        1、React Route 路由的两种写法<small>  need 安装这个插件react-router-dom</small>
        </dt>
        <dd>
          (1) 声明式导航 写在menu里面<br/>
            <code>{"<Link to='/about'>About Us</Link>"}</code>  
            <p>双引号里面，还有双引号，需要使用" \"转义</p>
            <code>{"<Link to=\"/about\">About Us</Link>"}</code>  
            <br/>     
          (2)写在函数里面<br/>
            <code>
              {"const navigate = useNavigate();"}
            </code>
            <br/>
            <pre>
              {"function handlebuttonClick(){ navigate('/about') }"}
            </pre>
            <pre>
              {"onClick={()=> navigate('/about') }"}
            </pre>
        </dd>
        <dt>
         2、form表单的写法
        </dt>
        <dd>
          <form style={{marginTop: '1rem'}} action="">
            <input type="text" />      
            <Button primary={true} onClick={handlebuttonClick} label="About Us"></Button>
          </form>
          <br />
        </dd>
        <dt>
          3、HTMLElement 的Instance properties[实例属性]
        </dt>
        <dd>
          需要进行断言，确定是HTMLElement，才会有这些属性的。
          <div>
            <pre>{"const stickyHeight = (navRef.current as HTMLElement).offsetHeight;"}</pre>
            <pre>{"const offsetTop = (formRef.current as HTMLElement).offsetTop;"}</pre>
            <pre>{"const offsetHeight = (formRef.current as HTMLElement).offsetHeight;" }</pre>
          </div>         
        </dd>
      </dl>
      
      
    </div>   
  );
}
export default Home;