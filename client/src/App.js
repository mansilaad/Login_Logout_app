import React, {useState} from 'react';
import './App.css';
import Axios from 'axios';
require('dotenv').config();

function App() {

  const [usernameReg, setUsernameReg]= useState('');
  const [passwordReg, setPasswordReg]= useState('');
 
  const [values, setvalues] = useState({
    username: "",
    password: ""
  })

  const [loginStatus, setLoginStatus]= useState(false);
  
  // useEffect(() => {
  //   document.title = `You clicked ${count} times`;
  // }, [count]); // Only re-run the effect if count changes

  

  const register= async ()=>{
    
    // await Axios.post(`http://localhost:3001/register`,
     await Axios.post(`${process.env.REACT_APP_API_URL}/register`,
     {username: usernameReg, password: passwordReg
    }).then((response)=>{
      if(response){
        alert('User registered successfully');
        setUsernameReg('');
        setPasswordReg('');
      }
    }).catch((error)=>{
      alert('User not registered'); 
    });
  }

 

  const login= async ()=>{
    await Axios.post(`${process.env.REACT_APP_API_URL}/login`,
    //await Axios.post(`http://localhost:3001/login`,
    {username: values.username, password: values.password
   }).then((response)=>{
     //console.log(response.data, "22222")
     if(!response.data.auth){
      setLoginStatus(false);
     }
     else{
       localStorage.setItem("token", "Bearer "+response.data.token);
       setLoginStatus(true);
     }
     setvalues({username: "",password: ""});
   }).catch((error)=>{
     console.log("eeror in frontend", error)
     alert('User not registered'); 
   });
 }

 const userAuth = async()=>{
   Axios.get(`http://localhost:3001/isUserAuth`,
   {headers: 
    { authorization: localStorage.getItem("token")}
   }
    )
   .then((response)=> {
     console.log(response)
   })

 }
  return (
    <div className="App">
    <div className="registration">
      <h1>Registration</h1>
      <label>Username</label>
      <input type="text" onChange={(e)=> {setUsernameReg(e.target.value)}} value={usernameReg}/>
      <label>Password</label>
      <input type="password" onChange={(e)=> {setPasswordReg(e.target.value)}} value={passwordReg}/>
      <button onClick={register}>Register</button>
    </div>
    <br/>


    <div className="login"> 
    <h1>{ loginStatus  && 
    <button onClick={userAuth}> Check if authenticated</button>}
    </h1>                         
      <input type="text" placeholder="Username...." onChange={(event)=> setvalues({ ...values, username: event.target.value })} value={values.username}/>
      <input type="password" placeholder="Password...." onChange={(event)=> setvalues({ ...values, password: event.target.value })} value={values.password}/>
      <button onClick={login}>Login</button>

      
    </div>
      
    </div>
  );
}

export default App;
