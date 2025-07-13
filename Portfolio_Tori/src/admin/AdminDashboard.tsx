/* eslint-disable @typescript-eslint/no-unused-vars */
// File: src/pages/admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [title, setTitle] = useState(() => localStorage.getItem('title') || 'Beauty By Tori Allen');
  const [subtitle, setSubtitle] = useState(() => localStorage.getItem('subtitle') || 'Hairstyling with confidence, creativity, and care');
  const [about, setAbout] = useState(() => localStorage.getItem('about') || 'With years of experience in modern cuts, color transformations, and styling, Tori helps her clients feel bold and beautiful. Her work reflects creativity, precision, and a love for the craft — creating looks that are uniquely you.');
  const [phonenumber, setPhoneNumber] = useState(() => localStorage.getItem('phone_number') || '(123)-456-7890');
  const [email, setEmail] = useState(() => localStorage.getItem('email') || 'this@this.com');
  const [images, setImages] = useState<string[]>([]);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL_PRODUCTION
  : import.meta.env.VITE_API_BASE_URL_DEV;

    useEffect(() => {
      const token = localStorage.getItem('adminToken');
      if (token !== 'admin-logged-in') {
        navigate('/login');
      }
    }, [navigate]);
useEffect(() => {
  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}api/images`);
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error('Failed to fetch images:', err);
    }
  };

  fetchImages();
}, []);

 const handleSave = async () => {
  try {
    await axios.post(`${API_BASE_URL}api/homepage`, {
      title,
      subtitle,
      about,
      phonenumber,
      email,
       images,
    });
    alert('Changes saved!');
  } catch (err) {
    alert('Failed to save changes.');
  }
};
  

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => formData.append('images', file));

    try {
      const res = await fetch(`${API_BASE_URL}api/upload`, {
        method: 'POST',
        body: formData,
      });
      const cloudinaryUrls = await res.json();
      setImages(prev => [...prev, ...cloudinaryUrls]);
    } catch (err) {
      alert('Upload failed.');
    }
  }
};

   const toggleImageSelection = (img: string) => {
    setSelectedForDeletion(prev => {
      const updated = new Set(prev);
      if (updated.has(img)) {
        updated.delete(img);
      } else {
        updated.add(img);
      }
      return updated;
    });
  };


  const confirmDeletion = async () => {
    try {
        await fetch(`${API_BASE_URL}api/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images: Array.from(selectedForDeletion) }),
        });

        const res = await fetch(`${API_BASE_URL}api/images`);
        setImages(await res.json());

        setSelectedForDeletion(new Set());
        setShowConfirm(false);
        alert('Images deleted.');
    } catch (err) {
        alert('Error deleting images. Check server.');
    }
};
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">Subtitle</label>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

                <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">About Section</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-40"
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            value={phonenumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 mb-8"
        >
          Save Changes
        </button>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">Manage Gallery Images</h2>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />

          {selectedForDeletion.size > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded mb-4 hover:bg-red-700"
            >
              Delete Selected Images
            </button>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Image ${index}`}
                  loading="lazy"
                  className={`w-full max-h-80 object-contain rounded-lg border shadow-sm cursor-pointer ${selectedForDeletion.has(img) ? 'opacity-50 ring-2 ring-red-500' : ''}`}
                  onClick={() => toggleImageSelection(img)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-lg">Are you sure you want to delete the selected images?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletion}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}