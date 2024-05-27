import { useParams, useLocation } from "react-router-dom";
import { useLocalStorage } from "../../hooks/useLocalStorage"
import { useEffect } from "react";
function Board(){
  const params = useParams();
  // useParams 可以拿到动态路由的值
  //userLocation 可以获取到Url的信息
  const name = params.name;
  const location = useLocation();
  const pram = `[${JSON.stringify(params)}]`
  const loction = `[${JSON.stringify(location)}]`
  console.log(`params: ${pram},location:${loction}`)

  const [message, setMessage] = useLocalStorage('hooks-key','阿菲')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessage('cp');
    }, 5000);

    return () => clearTimeout(timeout); // 清除定时器以避免内存泄漏
  }, [setMessage]);

  return(
    <h1>
      Board,欢迎你 {name}! message:{message}
    </h1>
  )    
}
export default Board;