import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";

function Home() {
  const navigate = useNavigate();
  function handlebuttonClick(){
    navigate("about")
  }
  return (
    <div>
      <h1>Home</h1>
      <p>React Route路由的两种写法</p> 
      <p>1、声明式导航 写在菜单里面</p>
      <div>
        <code><Link to="about">About Us</Link></code>
      </div>
      <Link to="about">About Us</Link>
       <div>        
        <code>
          const navigate = useNavigate();
          function handlebuttonClick()`{`{
            navigate('about')
            }
          `}`
        </code>
        or
      </div>
      <div>
        <pre>
          <code>
          onClick=`{`{()=> navigate('about') }`}`
          </code>
        </pre>
      </div>
      <Button  onClick={handlebuttonClick} label="About Us"></Button>
    </div>   
  );
}
export default Home;