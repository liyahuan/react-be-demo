import { useParams } from "react-router-dom";

function Board (){
  const params = useParams();
  const query = params.query
  return(
    <h1>
      我是内容 Board: {query}
    </h1>
  )    
}
export default Board;