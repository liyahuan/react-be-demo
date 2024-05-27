import { Dispatch, SetStateAction, useEffect, useState } from "react"

export function useLocalStorage(key:string,defaultvalue:string):[string,Dispatch<SetStateAction<string>>]{

  const [message,setMessage] = useState(defaultvalue)
  
  //每次只要message变化，就会自动同步到本地
  useEffect(()=>{
    window.localStorage.setItem(key,message)
  },[message,key])

  return [message, setMessage]
  // 仿照useState的写法
}