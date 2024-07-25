"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
//import { useRouter } from "next/router";




export default function Home() {
  const rounter = useRouter();
  
  return (
    <div >
      
      <div className={styles.body}>
        <button type={"button"} onClick={()=>rounter.push("/accountings")} className={styles.button} >點此開始</button>
      </div>
      
    </div> 
  );
}



function header(){
  return(
    <div className={styles.header}>React 練習專案</div>
  )
}

