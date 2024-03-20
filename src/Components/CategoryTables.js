import Table from 'react-bootstrap/Table';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryTables = () => {
    const [category, setCategory] = useState([]);
    const BASE_URL = 'http://localhost:3003/api';

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

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Category</th>
                    <th>Category Image</th>
                </tr>
            </thead>
            <tbody>
                {category && category.length > 0 ? (
                    category.map((elem, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{elem.Name}</td>
                            <td><img src={elem.Categoryimg} alt={`Category ${index}`} style={{ width: '100px', height: '100px' }} /></td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3">No categories available</td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
};

export default CategoryTables;
