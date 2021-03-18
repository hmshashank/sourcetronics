import React from "react";
// import './App.css';
import {GoogleLogin} from "react-google-login";


const responseGoogle=response =>{
    console.log(response);
}


function App() {
  return  <div className="App">
      <GoogleLogin
      clientId="100334197755-k3an1g5senojh31fjg8nqjnafnl0uial.apps.googleusercontent.com"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      />
    </div>
  
}
export default App;
