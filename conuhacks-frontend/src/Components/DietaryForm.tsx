import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar as CalendarIcon, Copy } from 'lucide-react';

interface DietaryForm {
  name: string;
  email: string;
  allergies: string[];
  dietaryRestrictions: string[];
}

const DietaryForm: React.FC = () => {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const [formData, setFormData] = useState<DietaryForm>({
    name: '',
    email: '',
    allergies: [],
    dietaryRestrictions: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [lobby, setLobby] = useState<{ title: string | undefined, eventDate: string | undefined }>({
    title: undefined,
    eventDate: undefined
  });

  const ALLERGIES = ['Nuts', 'Dairy', 'Eggs', 'Shellfish', 'Soy', 'Wheat', 'Fish', 'Sesame'];
  const DIETARY_RESTRICTIONS = [
    'Vegetarian', 'Vegan', 'Gluten-free', 'Kosher', 'Halal', 'Keto', 'Paleo',
  ];

  useEffect(() => {
    const fetchLobbyData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/lobby/${lobbyId}`);
        setLobby({ title: response.data.name, eventDate: response.data.date });
        if (response.data.date) {
          const eventDate = new Date(response.data.date);
          setSelectedDate(eventDate);  // Set the date for the calendar
        }
      } catch (error) {
        console.error('Error fetching lobby data:', error);
      }
    };

    fetchLobbyData();
  }, [lobbyId]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      // Post the dietary info to the Flask backend
      const response = await axios.post(`http://localhost:5000/submit-dietary-info/${lobbyId}`, formData);
  
      setFormData({
        name: '',
        email: '',
        allergies: [],
        dietaryRestrictions: [],
      });
  
      alert('Dietary information submitted successfully!');
    } catch (error) {
      console.error('Error submitting dietary info', error);
      alert('Failed to submit dietary information');
    }
  };

  const toggleSelection = (field: 'allergies' | 'dietaryRestrictions', value: string) => {
    setFormData((prev) => {
      const currentSelections = prev[field];
      const isSelected = currentSelections.includes(value);

      return {
        ...prev,
        [field]: isSelected
          ? currentSelections.filter((item) => item !== value)
          : [...currentSelections, value],
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-7xl w-full flex space-x-8 bg-white p-8 rounded-xl shadow-xl">
        <div className="w-full max-w-md space-y-6">
          

          {/* Display lobby title and event date only if they are available */}
          {lobby.title && (
            <div className="text-center text-lg font-semibold mb-6">
              <h1 className='font-serif text-6xl'>{lobby.title}</h1>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {ALLERGIES.map((allergy) => (
                  <button
                    type="button"
                    key={allergy}
                    onClick={() => toggleSelection('allergies', allergy)}
                    className={`px-3 py-1 rounded ${formData.allergies.includes(allergy) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Dietary Restrictions</h3>
              <div className="flex flex-wrap gap-2">
                {DIETARY_RESTRICTIONS.map((restriction) => (
                  <button
                    type="button"
                    key={restriction}
                    onClick={() => toggleSelection('dietaryRestrictions', restriction)}
                    className={`px-3 py-1 rounded ${formData.dietaryRestrictions.includes(restriction) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  >
                    {restriction}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Submit Dietary Information
            </button>
          </form>
        </div>
        {/* Calendar section */}
        <div className="flex-none w-96 ">
        <div className="flex-none flex-grow p-4 border rounded-xl shadow-sm">
            <DayPicker
              mode="single"
              selected={selectedDate}
              disabled={[...Array.from({ length: 31 }, (_, i) => new Date(new Date().getFullYear(), new Date().getMonth(), i + 1)).filter(date => date.getTime() !== selectedDate?.getTime())]}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietaryForm;
