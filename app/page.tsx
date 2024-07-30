"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react'
import { auth } from "./firebase.js";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword ,onAuthStateChanged} from "firebase/auth";




export default function Home() {
  //const rounter = useRouter();
  return (
    <>
      <SignUp/> 
      <SignIn />
    </>

  );
}
function SignUp(){

  const[signUpemail,setsignUpEmail]=useState('')
  const[password,setPassword]=useState('')
  const[Message,setMessage]=useState('')

  const handleSignUp=()=>{
      createUserWithEmailAndPassword(auth,signUpemail,password).then((res)=>{
          console.log(res);
          setsignUpEmail('');
          setPassword('');         
      })
      .catch((error)=>{
        switch(error.code){
            case"auth/missing-password" :
              setMessage("未輸入密碼");
              break
            case "auth/invalid-email":
              setMessage("信箱格式錯誤");
              break
            case "auth/missing-email":
              setMessage("未輸入信箱");
              break
            case "auth/weak-password":
              setMessage("密碼太弱");
              break
            case "auth/email-already-in-use":
              setMessage("信箱已註冊");
              break
        }
      setsignUpEmail('');
      setPassword('');        
      })
  }
  return(
    <div style={{margin:'40px auto',width:'250px',fontSize:'25px',fontWeight:600,textAlign:'center'}}>註冊帳號:
      
      <div style={{display:'flex',marginTop:'10PX'}}>
        <div style={{width:'50px',fontSize:'16px',fontWeight:'500'}}>信箱：</div>
        <input
          style={{width:'200px',height:'25px'}}
          value={signUpemail}
          placeholder="請輸入信箱"
          onChange={(e)=>setsignUpEmail(e.target.value)}
        >
        </input>
      </div>
      
      <div style={{display:'flex',marginTop:'10PX'}}>
        <div  style={{width:'50px',fontSize:'16px',fontWeight:'500'}}>密碼：</div>
        <input
          style={{width:'200px',height:'25px'}}
          value={password}
          placeholder="請輸入密碼"
          type="password"
          onChange={(e)=>setPassword(e.target.value)}
        ></input>
      </div>
      <button style={{width:'50px' }}  onClick={handleSignUp}>註冊</button>
      <div style={{color:"red"}}>{Message}</div>
    </div>
  )
}

function SignIn(){
  
  const[email,setEmail]=useState('')
  const[password,setPassword]=useState('')
  const [user, setUser] = useState<string | null>(null);
  const[errorMessage,setErrorMessage]=useState('')
  const router = useRouter();
  const handleSignIn =()=>{
    signInWithEmailAndPassword(auth,email,password)
    .catch((error) => {
      switch(error.code){
        case"auth/invalid-email" :
          setErrorMessage("信箱格式錯誤");
          break
        case "auth/missing-password":
          setErrorMessage("未輸入密碼");
          break
        case "auth/invalid-credential":
          setErrorMessage("信箱未註冊/密碼錯誤");
          break
    }
    setEmail('');
    setPassword('');  
    });
    }

    const handleSignout =()=>{
      auth.signOut();
      setEmail('');
      setPassword('');
    }

    useEffect(()=>{
      const unsubscribe =onAuthStateChanged(auth,(currentUser) => {
        console.log(currentUser?.email);
        const userEmail = currentUser?.email || null;
        setUser(userEmail);
        //setUserEmail(currentUser?.email);
      });
      return () => unsubscribe();
    }, []);   
    /*onAuthStateChanged(auth,(currentUser)=>{
      console.log(currentUser?.email);
      setUser(currentUser)
    })*/




  return(
    <>
      {user?(
        <div style={{marginTop:'40px',textAlign:'center'}}>
          <div>您已使用 {user} 登入</div>
          <button onClick={()=>router.push("/accountings")}>開始</button>
          <button style={{marginTop:'10PX'}} onClick={handleSignout}>登出</button>
        </div>):(
          <div style={{margin:'40px auto',width:'250px',fontSize:'25px',fontWeight:600,textAlign:'center'}}>登入帳號:
            
            <div style={{display:'flex',marginTop:'10PX'}}>
              <div style={{width:'50px',fontSize:'16px',fontWeight:'500'}}>信箱：</div>
              <input
                  style={{width:'200px',height:'25px'}}
                  value={email}
                  placeholder="請輸入信箱"
                  onChange={(e)=>setEmail(e.target.value)}
              >
              </input>
            </div>
            <div style={{display:'flex',marginTop:'10PX'}}>
              <div style={{width:'50px',fontSize:'16px',fontWeight:'500'}}>密碼：</div>
              <input
                  style={{width:'200px',height:'25px'}}
                  value={password}
                  placeholder="請輸入密碼"
                  type="password"
                  onChange={(e)=>setPassword(e.target.value)}
              ></input>
            </div>
            <button style={{width:'50px' }} onClick={handleSignIn} >登入</button>
            <div style={{color:'red'}}>{errorMessage}</div>
          </div>
        )
      }
    </>  
  )
}

