import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import '../CSS/ForgotPass.css'
import { useNavigate } from 'react-router-dom';
const ForgotPass = () => {
  const BASE_URL = 'http://localhost:3003/api';
  const navigate = useNavigate();

  const [resetCred, setResetCred] = useState({
    Email: ''
  });

  const [cred, setCred] = useState({
    Email: '',
    Password: ''
  });

  const [key, setKey] = useState('');
  const [fetchedKey, setFetchedKey] = useState('');
  const [verifyKey, setVerifyKey] = useState(false);

  const [reset, setReset] = useState(false);
  const [loader, setLoader] = useState(false);

  function openLoader() {
    setLoader(true);
  }

  function closeLoader() {
    setLoader(false);
  }

  function changeHandler(e) {
    const { name, value } = e.target;
    setResetCred({ ...resetCred, [name]: value });
    setCred({ ...cred, [name]: value });
  }

  function changeCredHandler(e) {
    const { name, value } = e.target;
    setCred({ ...cred, [name]: value });
  }

  function changeKeyHandler(e) {
    setKey(e.target.value);
  }

  async function resetHandler() {

    if(resetCred.Email===''){
        alert("Enter an Email ID")
    } else{
    try {
      const response = await fetch(`${BASE_URL}/reset`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetCred),
      });

      console.log(response.status);

      if (response.ok) {
        const res = await response.json();
        localStorage.setItem('token', res.token);
        alert('Check your email for the password reset key');
        setFetchedKey(res);
        setReset(true);
      } else {
        alert('Cannot send the key now, try after sometime');
      }
    } catch (error) {
      console.log(error);
    } finally {
      closeLoader();
    }
}
  }

  function verifyHandler(){

    if(key===''){
        alert("Enter the key to proceed")
    }

   
   else if(fetchedKey.toString()==key.toString()){
        setVerifyKey(true)
    }else{
        alert("Invalid key")
    }
  }

  async function passHandler(){

    if(key===''){
        alert("Enter the new password")
    } else{



    try {
        const response = await fetch(`${BASE_URL}/update`, {
          method: 'PATCH',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cred),
        });
  
        console.log(response.status);
  
        if (response.ok) {
          const res = await response.json();
          localStorage.setItem('token', res.token);
          alert(res)
          navigate('/login')
            
        } else {
          alert('error');
        }
      } catch (error) {
        console.log(error);
      } finally {
        closeLoader();
      }

    }
    

  }

  return (
    <>
      {loader && (
        <div>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={openLoader}
            onClick={closeLoader}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      )}
      <div className='credbox' style={{ width: '500px', height: '200px', backgroundColor: 'white', boxShadow: '3px 3px rgba(0, 0, 0, 0.43)', borderRadius: '10px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
        {reset ? (
          verifyKey ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TextField
                required
                id="outlined-required"
                label="New Password"
                
                style={{ width: '90%', margin: '10px' }}
                name="Password"
                onChange={changeCredHandler}
                value={cred.Password}
              />
              <Button variant="contained" style={{ width: '90%', marginTop: '20px', backgroundColor: 'black', color: 'white', fontWeight: 'bold' }} onClick={passHandler}>Change Password </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              required
              id="outlined-required"
              label="Key"
              defaultValue="johndoe@example.com"
              style={{ width: '90%', margin: '10px' }}
              name="key"
              onChange={changeKeyHandler}
              value={key}
            />
            <Button variant="contained" style={{ width: '90%', marginTop: '20px', backgroundColor: '#6E4D57', color: 'white', fontWeight: 'bold' }} onClick={verifyHandler}>Verify the reset key </Button>
          </Box>
          )
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              required
              id="outlined-required"
              label="Email"
              defaultValue="johndoe@example.com"
              style={{ width: '90%', margin: '10px' }}
              name="Email"
              onChange={changeHandler}
              value={resetCred.Email}
            />
            <Button variant="contained" style={{ width: '90%', marginTop: '20px', backgroundColor: 'black', color: 'white', fontWeight: 'bold' }} onClick={resetHandler}>Get a reset key </Button>
          </Box>
        )}
      </div>
    </>
  );
};

export default ForgotPass;