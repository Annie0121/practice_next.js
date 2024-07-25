// app/accounting/page.tsx
"use client"
import styles from "./accountings.module.css";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";


interface Record{
  type: string, 
  amount: string, 
  detail: string 
}

interface Datatype{
  type:string ,
  setType:React.Dispatch<React.SetStateAction<string>>,
  amount:string,
  setAmount:React.Dispatch<React.SetStateAction<string>>,
  detail:string,
  setDetail:React.Dispatch<React.SetStateAction<string>>,
  record:Record[],
  setRecord:React.Dispatch<React.SetStateAction<Record[]>>
}





function addRecord({ type, setType, amount, setAmount, detail, setDetail, record, setRecord }: Datatype){
    const newRecord={type,amount,detail}
    setRecord([...record, newRecord]);
    setType('income');
    setAmount("");
    setDetail('');
    console.log();
    
}



export default function Accounting() {
    //設定useState接收表單狀態
    const [type,setType]=useState('income');
    const [amount,setAmount]=useState("");
    const [detail,setDetail]=useState("");

    //將數據放進record中
    const [record,setRecord]=useState<Record[]>([]); //<Record[]>狀態變數的型別是 Record []，([])初始值為空數組

    
   
    return (
      <div>
        <div className={styles.form}>{form({ type, setType, amount, setAmount, detail, setDetail, record, setRecord })}</div>
        <hr style={{width:"900px"}} ></hr>
        <div>{list(record,setRecord)}</div>
      </div>
    );
  }
  

  function form({ type, setType, amount, setAmount, detail, setDetail, record, setRecord }: Datatype){
    
    return(
        <>
            <select className={styles.inputoption} value={type} onChange={(e)=>setType(e.target.value)}>
                <option value="income">收入</option>
                <option value="expense">支出</option>
            </select>

            
            <input 
              className={styles.inputamount}  
              placeholder="請輸入金額" 
              value={amount} 
              onChange={(e)=> setAmount(e.target.value)}>
            </input>

            <input 
              className={styles.inputdetail}  
              placeholder="請輸入細項"
              value={detail}
              onChange={(e)=>setDetail(e.target.value)}>
            </input>

            <button 
              className={styles.addbutton} 
              onClick={() => addRecord({ type, setType, amount, setAmount, detail, setDetail, record, setRecord })}
            
            >新增紀錄</button>
        </>
        
        
    )
  }

  function list(record:Record[],setRecord:React.Dispatch<React.SetStateAction<Record[]>>){
    console.log(record);
    const router = useRouter();
    //計算總數
    const total =record.reduce((acc,res)=>(
       res.type === "expense" ? acc- parseFloat(res.amount): acc + parseFloat(res.amount)
    ),0)

    const handleDel=(index:number)=>{
      setRecord(record.filter((item,idx)=>idx !==index));
      
    }

    return(
        <div style={{width:"450px", margin:"40px auto"}}>
          {record.map((re,index)=>(
            <div key={index} style={{display:"flex"}}>
              <div className={styles.amount}
                   style={{ color: re.type === "expense" ? "red" : "green" }}>
                  {re.type === "expense" ? `-${re.amount}` : re.amount}
              </div>

              <div className={styles.detail}>{re.detail}</div>
              <button className={styles.deletebutton} onClick={()=>handleDel(index)}>刪除</button>
            </div>
          ))}
          <div style={{textAlign:"center",marginTop:'30px',fontSize:'18px',fontWeight:'550'}}>小記：{total}</div>
          <button style={{ display: "block", margin: "20px auto",cursor: "pointer" }}  onClick={()=>router.push("/")}>返回首頁</button>
        </div>

    )
  }