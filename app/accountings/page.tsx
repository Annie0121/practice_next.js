"use client"
import styles from "./accountings.module.css";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { auth ,db} from "../firebase.js";
import { doc, setDoc,collection, addDoc,getDoc, onSnapshot , query, where,getDocs,deleteDoc } from "firebase/firestore"; 
import {onAuthStateChanged, User} from "firebase/auth"



interface Record{
  id:string,
  type: string, 
  amount: string, 
  detail: string ,
  userid: string
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

function  addRecord({ type, setType, amount, setAmount, detail, setDetail, record, setRecord }: Datatype){
    const user = auth.currentUser;
    const userid = user?.uid
    addDoc(collection(db, "record"), {
      type,
      amount,
      detail,
      userid
    });
    //清空輸入框
    setAmount("");
    setDetail('');
    setType('income')
}



export default function Accounting() {
    //設定路由
    const router = useRouter();
    //設定useState接收表單狀態
    const [type,setType]=useState('income');
    const [amount,setAmount]=useState("");
    const [detail,setDetail]=useState("");
    const [user, setUser] = useState<User | null>(null);
    const[userEmail,setUseremail]=useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    //將數據放進record中
    const [record,setRecord]=useState<Record[]>([]); //<Record[]>狀態變數的型別是 Record []，([])初始值為空數組

    //確認用戶狀態
    useEffect(()=>{
      const unsubscribe = onAuthStateChanged(auth,(currentUser) => {
        if(currentUser){
          setUser(currentUser);
          setUseremail(currentUser.email)
          fetchUserData(currentUser.uid);
          console.log(currentUser.uid); 
          console.log(currentUser.email);
          setLoading(false);
        }else{
          router.push("/")
        }
        
      });
      
      const fetchUserData = async(userId: string) => {
          console.log(userId);
          const q = query(collection(db, "record"), where("userid", "==", userId));
          try {
            //抓取數據
            const querySnapshot = await getDocs(q);
            const userRecords: Record[] = [];
            querySnapshot.forEach((doc) => {
              //加入doc.id，後續刪除抓id
              userRecords.push({ ...doc.data(), id: doc.id }as Record);
            });
            setRecord(userRecords);
           
            //更新觸發
            onSnapshot(q, (snapshot) => {
              const updatedRecords: Record[] = [];
              snapshot.forEach((doc) => {
                  updatedRecords.push({ ...doc.data(), id: doc.id }as Record);
              });
              setRecord(updatedRecords);
              
          });
           
          } catch (error) {
            console.error( error);
          }
          
        }

      return () => unsubscribe();
       }, []);  

       if (loading) {
        return <div>Loading...</div>; 
      }

    return (
      <div>
        <div style={{marginTop:'40px',textAlign:'center'}}>您已使用{userEmail}登入</div>
        <div className={styles.form}>{form({ type, setType, amount, setAmount, detail, setDetail, record, setRecord })}</div>
        <hr style={{width:"900px"}} ></hr>
        <div><List record={record} setRecord={setRecord} /></div>
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

  function List({ record, setRecord }: { record: Record[], setRecord: React.Dispatch<React.SetStateAction<Record[]>> }){
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    //計算總數
    const total =record.reduce((acc,res)=>(
       res.type === "expense" ? acc- parseFloat(res.amount): acc + parseFloat(res.amount)
    ),0)

    const handleDel= (id:string)=>{
      console.log(id);
      try {
        deleteDoc(doc(db, "record", id));
        setRecord(record.filter((item) => item.id !== id));
      } catch (error) {
        console.error("刪除文件時出錯: ", error);
      }
      
    }

    return(
        <div style={{width:"450px", margin:"40px auto"}}>
          {record.map((re)=>(
            <div key={re.id} style={{display:"flex"}}>
              <div className={styles.amount}
                   style={{ color: re.type === "expense" ? "red" : "green" }}>
                  {re.type === "expense" ? `-${re.amount}` : re.amount}
              </div>

              <div className={styles.detail}>{re.detail}</div>
              <button className={styles.deletebutton} onClick={()=>handleDel(re.id)}>刪除</button>
            </div>
          ))}
          <div style={{textAlign:"center",marginTop:'30px',fontSize:'18px',fontWeight:'550'}}>小記：{total}</div>
          <button style={{ display: "block", margin: "20px auto",cursor: "pointer" }}  onClick={()=>router.push("/")}>返回首頁</button>
        </div>

    )
  }