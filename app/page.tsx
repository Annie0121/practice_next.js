import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div >
      {header()}
      <div className={styles.body}>
        {button()}
      </div>
      
    </div> 
  );
}

function button(){
  return(
    <button className={styles.button} >點此開始</button>
  )
}

function header(){
  return(
    <div className={styles.header}>React 練習專案</div>
  )
}