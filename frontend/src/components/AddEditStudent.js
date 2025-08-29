import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Container, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../services/localStorageService';

const AddEditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    profile_image: null
  });
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // If editing, fetch the student data from local storage
    if (isEditing) {
      try {
        console.log('Fetching student data for editing, ID:', id);
        const student = studentService.getById(id);
        
        if (!student) {
          setError(`Student with ID ${id} not found`);
          setLoading(false);
          return;
        }
        
        setFormData({
          name: student.name,
          date_of_birth: student.date_of_birth ? student.date_of_birth.split('T')[0] : '',
          profile_image: student.profile_image
        });
        
        if (student.profile_image) {
          setImagePreview(student.profile_image);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError(`Failed to fetch student data: ${err.message}`);
        setLoading(false);
      }
    }
  }, [id, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Compress and resize the image before storing
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create an image element to resize
        const img = new Image();
        img.onload = () => {
          // Create a canvas to resize the image
          const canvas = document.createElement('canvas');
          
          // Calculate new dimensions (max 300px width/height)
          const MAX_SIZE = 300;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round(height * (MAX_SIZE / width));
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round(width * (MAX_SIZE / height));
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw resized image on canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to compressed JPEG format with reduced quality
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
          
          setImagePreview(compressedImage);
          setFormData({
            ...formData,
            profile_image: compressedImage
          });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (isEditing) {
        // Update existing student in local storage
        console.log('Updating student:', id, formData);
        studentService.update(id, formData);
      } else {
        // Create new student in local storage
        console.log('Creating new student:', formData);
        studentService.create(formData);
      }
      
      // Redirect to student list
      navigate('/');
    } catch (err) {
      console.error('Error saving student:', err);
      
      // Provide more specific error message for storage quota issues
      if (err.name === 'QuotaExceededError' || 
          err.message.includes('quota') || 
          err.message.includes('storage') ||
          err.message.includes('exceeded')) {
        setError(
          'Storage quota exceeded. The image is too large. ' +
          'Please try using a smaller image or removing some existing students.'
        );
      } else {
        setError(`Failed to save student: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading student data...</div>;
  }

  return (
    <div>
      <h2>{isEditing ? 'Edit Student Profile' : 'Add New Student'}</h2>
      
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      
      <Card className="mt-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter student name"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Profile Image</Form.Label>
              {imagePreview && (
                <div className="mb-3">
                  <img 
                    src={imagePreview} 
                    alt="Profile Preview" 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} 
                  />
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditing ? 'Update Profile' : 'Create Profile'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEditStudent;
