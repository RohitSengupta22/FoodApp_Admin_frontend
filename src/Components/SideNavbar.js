import React, { useState } from 'react';
import { Container } from '@mui/material';
import { NavLink } from 'react-router-dom';
import '../CSS/SideNavbar.css';
import { AiOutlineLogout } from "react-icons/ai";
import { Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SideNavbar = () => {
  const [selectedTab, setSelectedTab] = useState();
  const navigate = useNavigate()

  function Logout(){
    localStorage.removeItem('token')
        navigate('/')
  }

  return (
    <nav className="col-md-2 d-none d-md-block bg-dark sidebar" style={{ minHeight: '100vh' }}>
      <div className="sidebar-sticky">
        <div>
          <Container style={{backgroundColor: 'blue'}}>
          <h5 style={{ color: 'snow' }}>Dashboard</h5>
          </Container>
          <hr style={{  borderBottom: '5px solid white', height: '20px' }}></hr>
        </div>
        <Container>
        
        
          <NavLink to="/Category"  style={{ textDecoration: 'none', color: 'white' }}>
            
              Category
           
          </NavLink>
          <br></br>
          <br></br>
          <NavLink to="/Food"  style={{ textDecoration: 'none', color: 'white' }}>
            
            Food
         
        </NavLink>

        <br></br>
          <br></br>

        <NavLink to="/Orders"  style={{ textDecoration: 'none', color: 'white' }}>
            
            Orders
         
        </NavLink>

        <div style={{display: 'flex',position: 'fixed',bottom: '0'}}>

        <AiOutlineLogout style={{color: 'red',height: '20px',width: '20px',cursor: 'pointer'}} onClick={Logout}/>
        <h6 style={{color:'white',marginLeft: '5px',cursor: 'pointer'}}>Logout</h6>

        </div>

       
        </Container>
      </div>
    </nav>
  );
};

export default SideNavbar;
