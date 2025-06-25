import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [title, setTitle] = useState('Beauty By Tori Allen');
  const [subtitle, setSubtitle] = useState('Hairstyling with confidence, creativity, and care');
  const [about, setAbout] = useState('With years of experience in modern cuts, color transformations, and styling, Tori helps her clients feel bold and beautiful. Her work reflects creativity, precision, and a love for the craft — creating looks that are uniquely you.');
  const [phonenumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL_PRODUCTION
  : import.meta.env.VITE_API_BASE_URL_DEV;
  useEffect(() => {
    axios.get(`${API_BASE_URL}api/homepage`)
      .then(res => {
         console.log('API Response:', res.data);
        const { title, subtitle, about, phonenumber, email, images } = res.data;
        setTitle(title);
        setSubtitle(subtitle);
        setAbout(about);
        setPhoneNumber(phonenumber);
        setEmail(email);
        setImages(images);
      })
      .catch(err => {
        console.error('Error fetching homepage data:', err);
      });
  }, []);

  return (
    <div className="w-full bg-white text-gray-800 font-sans">
      {/* HERO */}
      <section className="bg-gradient-to-b from-pink-100 to-white py-10 border-b border-pink-200 shadow-sm text-center">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 italic mt-1">{subtitle}</p>
          <div className="flex justify-center">
            <img
              src="/hero_image/hero.jpg"
              alt="Tori styling hair"
              className="w-48 h-48 object-cover rounded-full ring-4 ring-white shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="w-full py-20 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center mb-12 text-gray-800 tracking-tight">Gallery</h2>
         
            <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(500px,1fr))]">
              {images.map((img, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
                  <img
                    src={img}
                    alt={`Style ${i + 1}`}
                    className="rounded-xl w-full object-cover max-h-[1000px]"
                    loading='lazy'
                  />
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="w-full bg-white py-20 border-t border-gray-200">
        <div className="max-w-screen-md mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">About Tori</h2>
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">{about}</p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="w-full bg-pink-50 py-20 border-t border-pink-100">
        <div className="max-w-screen-md mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Book an Appointment</h2>
          <p className="text-lg mb-2">📞 {phonenumber}</p>
          <p className="text-lg">
            📧{' '}
            <a href="mailto:tori.styles@example.com" className="text-pink-600 underline hover:text-pink-800">
              {email}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}