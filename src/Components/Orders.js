import React, { useEffect, useState } from 'react';
import SideNavbar from './SideNavbar';
import addfood from '../Images/addfood.png';
import Stack from 'react-bootstrap/Stack';
import { IoIosAddCircle } from 'react-icons/io';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import FoodTable from './FoodTable';
import { Container, Row, Col } from 'react-bootstrap'; // Import Row and Col from react-bootstrap
import Card from 'react-bootstrap/Card';

const Orders = () => {
    const BASE_URL = 'http://localhost:3003/api';

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        async function fetchOrders() {
            const response = await axios.get(`${BASE_URL}/orders`);
            console.log(response.data);
            setOrders(response.data);
        }

        fetchOrders();
    }, []);

    return (
        <div className='d-flex'>
            <SideNavbar />
            <Container fluid>
                <Row xs={1} md={2} lg={3} className='g-4'> {/* Use Row and specify the number of columns for different screen sizes */}
                    {orders &&
                        orders.map((order, index) => (
                            <Col key={index}>
                                <Card style={{width: '300px', height: '300px', overflowY: 'scroll', margin: '20px',boxShadow: '2px 2px grey'}}>
                                    <Card.Body>
                                        <Card.Title>Order by {order.Username}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{order.date}</Card.Subtitle>
                                        <Card.Text>
                                            <ul>
                                                {order.Order.map((elem, index) => (
                                                    <li key={index} style={{ color: 'green' }}>Order: {elem.food} x {elem.freq}</li>
                                                ))}
                                            </ul>
                                            <ul style={{ listStyleType: 'none' }}>
                                                <li>House No: {order.House_no}</li>
                                                <li>Area: {order.Area}</li>
                                                <li>City: {order.City}</li>
                                                <li>Phone No: {order.Phone_no}</li>
                                            </ul>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                </Row>
            </Container>
        </div>
    );
};

export default Orders;
