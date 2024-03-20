import React, { useEffect, useState } from 'react';
import SideNavbar from './SideNavbar';
import addfood from '../Images/addfood.png';
import Stack from 'react-bootstrap/Stack';
import { IoIosAddCircle } from 'react-icons/io';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import FoodTable from './FoodTable';
import { Container } from '@mui/material';
import { LuRefreshCcw } from "react-icons/lu";

const Food = () => {
  const BASE_URL = 'http://localhost:3003/api';
  const authToken = localStorage.getItem('token');
  const [category, setCategory] = useState();

  const [foodArr, setFoodArr] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // State variables for form fields
  const [foodCred, setFoodCred] = useState({
    Name: '',
    Foodimg: null,
    Price: '',
    Description: '',
    DiscountedPrice: '',
    CategoryName: '',
  });

  useEffect(() => {
    async function fetchFood() {
      try {
        const response = await axios.get(`${BASE_URL}/foodimages`);
        setFoodArr(response.data.food);
      } catch (error) {
        console.error('Error fetching food images:', error);
      }
    }

    fetchFood();
  }, [BASE_URL]);
  

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axios.get(`${BASE_URL}/categoryimages`);
        setCategory(response.data.categories);
      } catch (error) {
        console.error('Error fetching category data:', error.message);
      }
    }

    fetchCategory();
  }, []);

  const handleAddFoodClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleFileChange = (e) => {
    // Handle file input change
    const file = e.target.files[0];
    setFoodCred({
      ...foodCred,
      Foodimg: file,
    });
  };

  const handleInputChange = (e) => {
    // Handle other input changes
    const { name, value } = e.target;
    setFoodCred({
      ...foodCred,
      [name]: value,
    });
  };

  const handleAddFood = async () => {
    // Add logic for handling food addition
    try {
      const Data = await axios.post(
        `${BASE_URL}/get-upload-url`,
        {
          filename: foodCred.Foodimg.name,
          filetype: foodCred.Foodimg.type, // Use the actual file type
        },
        {
          headers: {
            'auth-token': authToken,
          },
        }
      );

      const url = Data.data.url.split('?')[0];
      console.log(url);

      await axios.put(url, foodCred.Foodimg, {
        headers: {
          'Content-Type': foodCred.Foodimg.type,
          // "x-amz-acl": "public-read",
        },
      });

      const response = await axios.post(
        `${BASE_URL}/food`,
        {
          Name: foodCred.Name,
          Foodimg: url,
          Price: foodCred.Price,
          Description: foodCred.Description,
          DiscountedPrice: foodCred.DiscountedPrice,
          CategoryName: foodCred.CategoryName,
        },
        {
          headers: {
            'auth-token': authToken,
          },
        }
      );

      handleModalClose();

      console.log('Food uploaded successfully:', response.data.food);
    } catch (error) {
      console.error('Error uploading food:', error.message);
    }
  };

  function pageRefresh(){

    window.location.reload();

  }

  return (
    <div className='d-flex'>
      <SideNavbar />
      <Stack gap={2} className='col-md-5 mx-auto'>

        {
          foodArr && foodArr.length<1 ? <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <img src={addfood} alt='Add Food' onClick={handleAddFoodClick} style={{ cursor: 'pointer' }} />
       
          <IoIosAddCircle style={{ width: '50px', height: '50px', cursor: 'pointer' }} onClick={handleAddFoodClick} />
          
        </div> : <Container>
        <IoIosAddCircle style={{ width: '50px', height: '50px', cursor: 'pointer',marginBottom: '20px' }} onClick={handleAddFoodClick} />
        <LuRefreshCcw style={{width: '40px', height: '40px', cursor: 'pointer',marginBottom: '20px',marginLeft: '20px'}} onClick={pageRefresh}/>
          <FoodTable />
        </Container>
        }
        
        {/* Display food images */}
       

       
      </Stack>

       {/* Modal for adding food */}
       <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Food</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Form for adding food */}
            <Form>
              {/* Input fields for adding food */}
              <Form.Group controlId='formFoodName'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' placeholder='Enter food name' name='Name' value={foodCred.Name} onChange={handleInputChange} />
              </Form.Group>

              <Form.Group controlId='formFoodImage'>
                <Form.Label>Food Image</Form.Label>
                <Form.Control type='file' accept='image/*' name='Foodimg' onChange={handleFileChange} />
              </Form.Group>

              <Form.Group controlId='formFoodPrice'>
                <Form.Label>Price</Form.Label>
                <Form.Control type='text' placeholder='Enter price' name='Price' value={foodCred.Price} onChange={handleInputChange} />
              </Form.Group>

              <Form.Group controlId='formFoodDescription'>
                <Form.Label>Description</Form.Label>
                <Form.Control as='textarea' placeholder='Enter description' name='Description' value={foodCred.Description} onChange={handleInputChange} />
              </Form.Group>

              <Form.Group controlId='formFoodDiscountedPrice'>
                <Form.Label>Discounted Price</Form.Label>
                <Form.Control type='text' placeholder='Enter discounted price' name='DiscountedPrice' value={foodCred.DiscountedPrice} onChange={handleInputChange} />
              </Form.Group>

              <Form.Group controlId='formFoodCategoryName'>
                <Form.Label>Category Name</Form.Label>
                <Form.Control as='select' name='CategoryName' value={foodCred.CategoryName} onChange={handleInputChange}>
                  <option value=''>Select a category</option>
                  {category
                    ? category.map((cat) => (
                        <option key={cat._id} value={cat.Name}>
                          {cat.Name}
                        </option>
                      ))
                    : null}
                </Form.Control>
              </Form.Group>

              <Button variant='primary' onClick={handleAddFood} style={{marginTop: '10px'}}>
                Add Food
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
    </div>
  );
};

export default Food;
