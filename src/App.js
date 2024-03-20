import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


import ForgotPass from './Components/ForgotPass';
import Auth from './Components/Auth';
import Food from './Components/Food';
import Category from './Components/Category';
import Orders from './Components/Orders';




function App() {
  return (
    <BrowserRouter>
   
    <Routes>
     
      <Route path='/' element={<Auth />} />
      <Route path='/Category' element={<Category />} />
      <Route path='/Reset-Password' element={<ForgotPass />} />
      <Route path='/Food' element={<Food />} />
      <Route path='/Orders' element={<Orders />} />
     
      


    </Routes>
    
    </BrowserRouter>
  );
}

export default App;