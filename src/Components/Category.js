import React, { useEffect, useState } from 'react';
import SideNavbar from './SideNavbar';
import axios from 'axios';
import CategoryTables from './CategoryTables';
import { Container } from '@mui/material';
import Stack from 'react-bootstrap/Stack';

const Category = () => {
  const [categoryCred, setCategoryCred] = useState({
    Name: '',
    Categoryimg: null,
  });

  

  const BASE_URL = 'http://localhost:3003/api';
  const authToken = localStorage.getItem('token');

  const handleNameChange = (e) => {
    setCategoryCred({
      ...categoryCred,
      Name: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCategoryCred({
      ...categoryCred,
      Categoryimg: file,
    });
  };

  const handleUploadClick = async () => {
    console.log(categoryCred.Categoryimg); // Log the file type for debugging

    try {
      const Data = await axios.post(`${BASE_URL}/get-upload-url`, {
        filename: categoryCred.Categoryimg.name,
        filetype: categoryCred.Categoryimg.type, // Use the actual file type
      }, {
        headers: {
          'auth-token': authToken,
        },
      });

      const url = Data.data.url.split('?')[0];
      console.log(url);

      await axios.put(url, categoryCred.Categoryimg, {
        headers: {
          'Content-Type': categoryCred.Categoryimg.type,
          // "x-amz-acl": "public-read",
        },
      });

      const response = await axios.post(`${BASE_URL}/category`, {
        Name: categoryCred.Name,
        Categoryimg: url,
      }, {
        headers: {
          'auth-token': authToken,
        },
      });

      setCategoryCred({
        Name: '',
        Categoryimg: null,
      });

      console.log('Category uploaded successfully:', response.data.category);
    } catch (error) {
      console.error('Error uploading category:', error.message);
    }
  };



  return (
    <div className="d-flex">
      <SideNavbar />
      <Stack gap={2} className="col-md-5 mx-auto">
        <div style={styles.container}>
          <h1>Category</h1>
          <input
            type="text"
            placeholder="Category Name"
            value={categoryCred.Name}
            onChange={handleNameChange}
            style={styles.input}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.input}
          />
          <button onClick={handleUploadClick} style={styles.button}>
            Upload Image
          </button>
        </div>
        <Container>
          <CategoryTables />
        </Container>
        </Stack>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: 'auto',
    marginTop: '50px',
    position: 'sticky'
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Category;
