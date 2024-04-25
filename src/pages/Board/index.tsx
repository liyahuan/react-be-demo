import { useParams, useLocation } from "react-router-dom";

function Board (){
  const params = useParams();
  // useParams 可以拿到动态路由的值
  //userLocation 可以获取到Url的信息
  const name = params.name;
  const location = useLocation();
  console.log(params);
  console.log(location)
  
  const pram = `[${JSON.stringify(params)}]`
  const loction = `[${JSON.stringify(location)}]`
  console.log(`params: ${pram},location:${loction}`)
  return(
    <h1>
      Board,欢迎你 {name}!
    </h1>
  )    
}
export default Board;