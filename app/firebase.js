import firebase from 'firebase/compat/app';


const firebaseConfig = {
  apiKey:process.env.NEXT_PUBLIC_api_Key,
  authDomain: process.env.NEXT_PUBLIC_auth_Domain,
  projectId: process.env.NEXT_PUBLIC_project_Id,
  storageBucket: process.env.NEXT_PUBLIC_storage_Bucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messaging_SenderId,
  appId: process.env.NEXT_PUBLIC_app_Id,
  measurementId:process.env.NEXT_PUBLIC_measurement_Id
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
