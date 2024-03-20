import Table from 'react-bootstrap/Table';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Modal, Button, Form } from 'react-bootstrap';
import { FaImage } from "react-icons/fa6";

const FoodTable = () => {
    const [foodArr, setFoodArr] = useState([]);
    const BASE_URL = 'http://localhost:3003/api';
    const authToken = localStorage.getItem('token');
    const [showModal, setShowModal] = useState(false);
    const [showModalImg,setShowModalImg] = useState(false);
    const [category, setCategory] = useState();
    const [selectedFood,setSelectedFood] = useState(null);
    const [foodIdToDelete, setFoodIdToDelete] = useState(null);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${BASE_URL}/foodimages`);
                setFoodArr(response.data.food);
            } catch (error) {
                console.error('Error fetching food images:', error);
            }
        }
        fetchData();
    }, []);

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

    function editSelector(elem) {
        setSelectedFood(elem);
        setShowModal(true);
    }

    function editImgSelector(elem) {
        setSelectedFood(elem);
        setShowModalImg(true);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFood({
          ...selectedFood,
          Foodimg: file,
        });
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedFood({
          ...selectedFood,
          [name]: value,
        });
    };

    const handleEditFood = async () => {
        try {
            const response = await axios.patch(
                `${BASE_URL}/food/${selectedFood._id}`,
                {
                    Name: selectedFood.Name,
                    Foodimg: selectedFood.Foodimg,
                    Price: selectedFood.Price,
                    Description: selectedFood.Description,
                    DiscountedPrice: selectedFood.DiscountedPrice,
                    CategoryName: selectedFood.CategoryName,
                },
                {
                    headers: {
                        'auth-token': authToken,
                    },
                }
            );
    
            // Close the modal after successful update
            setShowModal(false);
    
            console.log('Food updated successfully:', response.data.food);
        } catch (error) {
            console.error('Error updating food:', error.message);
        }
    };

    const handleEditFoodImg = async () => {
        try {
            const uploadUrlResponse = await axios.post(
                `${BASE_URL}/get-upload-url`,
                {
                    filename: selectedFood.Foodimg.name,
                    filetype: selectedFood.Foodimg.type,
                },
                {
                    headers: {
                        'auth-token': authToken,
                    },
                }
            );
    
            const imageUrl = uploadUrlResponse.data.url.split('?')[0];
            
            await axios.put(imageUrl, selectedFood.Foodimg, {
                headers: {
                    'Content-Type': selectedFood.Foodimg.type,
                },
            });
    
            const response = await axios.patch(
                `${BASE_URL}/food/${selectedFood._id}`,
                {
                    Name: selectedFood.Name,
                    Foodimg: imageUrl,
                    Price: selectedFood.Price,
                    Description: selectedFood.Description,
                    DiscountedPrice: selectedFood.DiscountedPrice,
                    CategoryName: selectedFood.CategoryName,
                },
                {
                    headers: {
                        'auth-token': authToken,
                    },
                }
            );
    
            setShowModalImg(false);
    
            console.log('Food updated successfully:', response.data.food);
        } catch (error) {
            console.error('Error updating food:', error.message);
        }
    };

    const handleDeleteConfirmation = (foodId) => {
        setFoodIdToDelete(foodId);
        setShowDeleteConfirmationModal(true);
    };

    const handleDeleteFood = async () => {
        try {
            await axios.delete(`${BASE_URL}/food/${foodIdToDelete}`, {
                headers: {
                    'auth-token': authToken,
                },
            });
            setFoodArr(foodArr.filter(food => food._id !== foodIdToDelete));
            console.log('Food deleted successfully');
            setShowDeleteConfirmationModal(false);
        } catch (error) {
            console.error('Error deleting food:', error.message);
        }
    };

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Price/Discounted price</th>
                    <th>Description</th>
                    <th>Item Image</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {foodArr && foodArr.length > 0 ? (
                    foodArr.map((elem, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{elem.Name}</td>
                            <td>{elem.Price}/{elem.DiscountedPrice}</td>
                            <td>{elem.Description}</td>
                            <td><img src={elem.Foodimg} alt={`Category ${index}`} style={{ width: '100px', height: '100px' }} /></td>
                            <td>
                                <FaRegEdit style={{color: 'Blue',cursor: 'pointer'}} onClick={() => editSelector(elem)} />
                                <FaImage onClick={() => editImgSelector(elem)} style={{color: 'purple',cursor: 'pointer'}}/>
                                <MdDelete style={{color: 'red',cursor: 'pointer'}} onClick={() => handleDeleteConfirmation(elem._id)} />
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">No food items available</td>
                    </tr>
                )}
            </tbody>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Add Food</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Form for adding food */}
            <Form>
              {/* Input fields for adding food */}
              <Form.Group controlId='formFoodName'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' placeholder='Enter food name' name='Name' value={selectedFood ? selectedFood.Name : null} onChange={handleInputChange} />
              </Form.Group>

             

              <Form.Group controlId='formFoodPrice'>
                <Form.Label>Price</Form.Label>
                <Form.Control type='text' placeholder='Enter price' name='Price' value={selectedFood ? selectedFood.Price : null} onChange={handleInputChange} />
              </Form.Group>

              <Form.Group controlId='formFoodDescription'>
                <Form.Label>Description</Form.Label>
                <Form.Control as='textarea' placeholder='Enter description' name='Description' value={selectedFood ? selectedFood.Description : null} onChange={handleInputChange} />
              </Form.Group>

              <Form.Group controlId='formFoodDiscountedPrice'>
                <Form.Label>Discounted Price</Form.Label>
                <Form.Control type='text' placeholder='Enter discounted price' name='DiscountedPrice' value={selectedFood ? selectedFood.DiscountedPrice : null} onChange={handleInputChange} />
              </Form.Group>

              <Form.Group controlId='formFoodCategoryName'>
                <Form.Label>Category Name</Form.Label>
                <Form.Control as='select' name='CategoryName' value={selectedFood ? selectedFood.CategoryName : null} onChange={handleInputChange}>
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

              <Button variant='primary' onClick={handleEditFood} style={{marginTop: '10px'}}>
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
            </Modal>

            <Modal show={showModalImg} onHide={() => setShowModalImg(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Edit Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Form for adding food */}
            <Form>
              {/* Input fields for adding food */}
              

              <Form.Group controlId='formFoodImage'>
                <Form.Label>Food Image</Form.Label>
                <Form.Control type='file' accept='image/*' name='Foodimg' onChange={handleFileChange} />
              </Form.Group>

              

              <Button variant='primary' onClick={handleEditFoodImg} style={{marginTop: '10px'}}>
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
            </Modal>

            <Modal show={showDeleteConfirmationModal} onHide={() => setShowDeleteConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this food item?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirmationModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteFood}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Table>
    );
};

export default FoodTable;
