import React, { useState } from 'react';
import './Sell.css';
import Navbar from '../components/Navbar';

const SellPage = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: 'Excellent',
    color: '',
    transmission: 'Automatic',
    price: '',
    description: '',
    name: '',
    email: '',
    phone: '',
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      setFormData(prevData => ({
        ...prevData,
        images: [...prevData.images, ...files]
      }));

      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prevData => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted car details:', formData);
    // Here you would typically send the data to your backend
    alert('Your vehicle has been submitted for review. Our team will contact you shortly.');
  };

  const conditions = ['Excellent', 'Very Good', 'Good', 'Fair'];
  const transmissions = ['Automatic', 'Manual', 'Semi-Automatic'];

  return (
    <>
    <Navbar />
    <div className="sell-page-container">
      <div className="sell-header">
        <h1 className="luxurious-title">Sell Your Luxury Vehicle</h1>
        <p className="elegant-subtitle">Let us help you find the perfect buyer for your exclusive automobile</p>
      </div>

      <div className="sell-content">
        <div className="process-steps">
          <div className="step-item">
            <div className="step-number">01</div>
            <div className="step-info">
              <h3 className="step-title">Submit Details</h3>
              <p className="step-description">Provide comprehensive information about your vehicle</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">02</div>
            <div className="step-info">
              <h3 className="step-title">Expert Valuation</h3>
              <p className="step-description">Our specialists will assess your vehicle's market value</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">03</div>
            <div className="step-info">
              <h3 className="step-title">Professional Marketing</h3>
              <p className="step-description">We showcase your car to our network of discerning buyers</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">04</div>
            <div className="step-info">
              <h3 className="step-title">Secure Transaction</h3>
              <p className="step-description">We handle all paperwork and ensure a smooth sale</p>
            </div>
          </div>
        </div>

        <div className="sell-form-container">
          <h2 className="form-heading">Vehicle Details</h2>
          <form onSubmit={handleSubmit} className="sell-form">
            <div className="form-section vehicle-details">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="make">Make*</label>
                  <input 
                    type="text" 
                    id="make" 
                    name="make" 
                    className="form-control" 
                    placeholder="e.g. Porsche, Ferrari" 
                    value={formData.make}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="model">Model*</label>
                  <input 
                    type="text" 
                    id="model" 
                    name="model" 
                    className="form-control" 
                    placeholder="e.g. 911, 488" 
                    value={formData.model}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="year">Year*</label>
                  <input 
                    type="number" 
                    id="year" 
                    name="year" 
                    className="form-control" 
                    placeholder="e.g. 2022" 
                    min="1900" 
                    max="2025"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="mileage">Mileage*</label>
                  <input 
                    type="number" 
                    id="mileage" 
                    name="mileage" 
                    className="form-control" 
                    placeholder="e.g. 15000" 
                    min="0"
                    value={formData.mileage}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="condition">Condition*</label>
                  <select 
                    id="condition" 
                    name="condition" 
                    className="form-control form-select" 
                    value={formData.condition}
                    onChange={handleChange}
                    required
                  >
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="color">Color*</label>
                  <input 
                    type="text" 
                    id="color" 
                    name="color" 
                    className="form-control" 
                    placeholder="e.g. Alpine White" 
                    value={formData.color}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="transmission">Transmission*</label>
                  <select 
                    id="transmission" 
                    name="transmission" 
                    className="form-control form-select" 
                    value={formData.transmission}
                    onChange={handleChange}
                    required
                  >
                    {transmissions.map(transmission => (
                      <option key={transmission} value={transmission}>{transmission}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="price">Asking Price*</label>
                  <input 
                    type="number" 
                    id="price" 
                    name="price" 
                    className="form-control" 
                    placeholder="e.g. 120000" 
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group full-width">
                <label className="form-label" htmlFor="description">Description*</label>
                <textarea 
                  id="description" 
                  name="description" 
                  className="form-control form-textarea" 
                  placeholder="Please provide details about your vehicle, including special features, modifications, service history, etc." 
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>
            
            <div className="form-section photo-upload">
              <h3 className="section-subheading">Vehicle Photos</h3>
              <p className="section-description">High-quality photos significantly increase your chances of finding the right buyer. We recommend including exterior, interior, and engine compartment photos.</p>
              
              <div className="image-upload-container">
                <div className="upload-button-container">
                  <label htmlFor="image-upload" className="image-upload-label">
                    <div className="upload-icon">+</div>
                    <span>Add Photos</span>
                  </label>
                  <input 
                    type="file" 
                    id="image-upload" 
                    name="images" 
                    accept="image/*" 
                    multiple 
                    className="image-upload-input" 
                    onChange={handleImageChange}
                  />
                </div>
                
                <div className="image-preview-container">
                  {previewImages.map((src, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={src} alt={`Preview ${index + 1}`} className="image-preview" />
                      <button 
                        type="button" 
                        className="remove-image-btn" 
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="form-section contact-info">
              <h3 className="section-subheading">Contact Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name*</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="form-control" 
                    placeholder="Your full name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address*</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="form-control" 
                    placeholder="Your email address" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number*</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    className="form-control" 
                    placeholder="Your phone number" 
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="consent-section">
              <label className="consent-label">
                <input type="checkbox" required className="consent-checkbox" />
                <span className="consent-text">I consent to Luxewheels processing my data to contact me regarding the sale of my vehicle</span>
              </label>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-listing-btn">Submit Your Vehicle</button>
            </div>
          </form>
        </div>
        
        <div className="testimonials-section">
          <h2 className="testimonials-heading">What Our Sellers Say</h2>
          
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">"Selling my Bentley Continental GT through Luxewheels was effortless. They handled everything professionally and found a buyer within two weeks offering more than I expected."</p>
              </div>
              <div className="testimonial-author">
                <span className="author-name">Michael T.</span>
                <span className="testimonial-location">London, UK</span>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">"After struggling to sell my Ferrari privately for months, I turned to Luxewheels. Their network of serious buyers and expert valuation made all the difference."</p>
              </div>
              <div className="testimonial-author">
                <span className="author-name">Sophia R.</span>
                <span className="testimonial-location">Monaco</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SellPage;