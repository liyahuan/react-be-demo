import { useParams } from "react-router-dom";

function Board (){
  const params = useParams();
  const name = params.name
  return(
    <h1>
      Board,欢迎你 {name}!
    </h1>
  )    
}
export default Board;