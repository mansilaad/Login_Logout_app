import React, {useState} from 'react';
import './App.css';
import Axios from 'axios';
import config from './config/config';

function App() {

  const [usernameReg, setUsernameReg]= useState('');
  const [passwordReg, setPasswordReg]= useState('');
 
  const [values, setvalues] = useState({
    username: "",
    password: ""
  })

  const [loginStatus, setLoginStatus]= useState("");


  

  const register= async ()=>{
     await Axios.post(`${config.api_url}/register`,
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
    await Axios.post(`${config.api_url}/login`,
    {username: values.username, password: values.password
   }).then((response)=>{
     console.log(response.data, "22222")
     if(response.data.message){
      setLoginStatus(response.data.message)
     }
     else{
       setLoginStatus(response.data.result[0].username);
     }
   }).catch((error)=>{
     console.log("eeror in frontend", error)
     alert('User not registered'); 
   });
 }
  return (
    <div className="App">
    <div className="registration">
      <h1>Registration</h1>
      <label>Username</label>
      <input type="text" onChange={(e)=> {setUsernameReg(e.target.value)}}/>
      <label>Password</label>
      <input type="password" onChange={(e)=> {setPasswordReg(e.target.value)}}/>
      <button onClick={register}>Register</button>
    </div>
    <br/>


    <div className="login">                          
      <input type="text" placeholder="Username...." onChange={(event)=> setvalues({ ...values, username: event.target.value })}/>
      <input type="password" placeholder="Password...." onChange={(event)=> setvalues({ ...values, password: event.target.value })}/>
      <button onClick={login}>Login</button>

      <h1>{loginStatus}</h1>
    </div>
      
    </div>
  );
}

export default App;
