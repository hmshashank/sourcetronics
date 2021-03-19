import React from "react";
// import './App.css';
import {GoogleLogin} from "react-google-login";
import axios from 'axios';


const responseSuccessGoogle=response =>{
    console.log(response);
    axios({
      method : "post",
      url : "",     // server address url
      data:{tokenId: response.tokenId}                 
    }).then(response => {
      console.log("Google login success", response);
    })
}

const responseErrorGoogle=response =>{
console.log(response);
}

function App() {
  return  <div className="App">
      <GoogleLogin
      clientId="100334197755-0nps2ssqsmbh3r8lomd3j1gbhupe3mmv.apps.googleusercontent.com"
      onSuccess={responseSuccessGoogle}
      onFailure={responseErrorGoogle}
      />
    </div>
  
}
export default App;
