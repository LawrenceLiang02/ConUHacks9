import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar as CalendarIcon, Copy } from 'lucide-react';
import KitchenRoles from './KitchenRoles';
import Roulette from './Roulette';

interface DietaryForm {
  name: string;
  email: string;
  allergies: string[];
  dietaryRestrictions: string[];
  specialties: string[];
}

const DietaryForm: React.FC = () => {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const [formData, setFormData] = useState<DietaryForm>({
    name: '',
    email: '',
    allergies: [],
    dietaryRestrictions: [],
    specialties: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [lobby, setLobby] = useState<{ title: string | undefined, eventDate: string | undefined }>({
    title: undefined,
    eventDate: undefined
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newRestriction, setNewRestriction] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  
  const [showAllergyInput, setShowAllergyInput] = useState(false);
  const [showRestrictionInput, setShowRestrictionInput] = useState(false);
  const [showSpecialtyInput, setShowSpecialtyInput] = useState(false);

  const ALLERGIES = ['Nuts', 'Dairy', 'Eggs', 'Shellfish', 'Soy', 'Wheat', 'Fish', 'Sesame'];
  const DIETARY_RESTRICTIONS = [
    'Vegetarian', 'Vegan', 'Gluten-free', 'Kosher', 'Halal', 'Keto', 'Paleo',
  ];

  const SPECIALTIES = ['Baking', 'Grilling', 'Sushi Making', 'Pastry Chef', 'Vegetarian Cooking', 'Italian Cuisine'];

  useEffect(() => {
    const fetchLobbyData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/lobby/${lobbyId}`);
        setLobby({ title: response.data.name, eventDate: response.data.date });
        if (response.data.date) {
          const eventDate = new Date(response.data.date);
          setSelectedDate(eventDate);
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
      const response = await axios.post(`http://localhost:5000/submit-dietary-info/${lobbyId}`, formData);
  
      setFormData({
        name: '',
        email: '',
        allergies: [],
        dietaryRestrictions: [],
        specialties: [],
      });
  
      alert('Dietary information submitted successfully!');
    } catch (error) {
      console.error('Error submitting dietary info', error);
      alert('Failed to submit dietary information');
    }
  };

  const toggleSelection = (field: 'allergies' | 'dietaryRestrictions' | 'specialties', value: string) => {
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

  const handleCustomAdd = (field: 'allergies' | 'dietaryRestrictions' | 'specialties', customValue: string) => {
    if (customValue.trim() === '') return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], customValue],
    }));
    // Reset input fields and hide the input box
    if (field === 'allergies') {
      setNewAllergy('');
      setShowAllergyInput(false);
    } else if (field === 'dietaryRestrictions') {
      setNewRestriction('');
      setShowRestrictionInput(false);
    } else if (field === 'specialties') {
      setNewSpecialty('');
      setShowSpecialtyInput(false);
    }
  };

  // Filter out predefined options that are already selected as custom values
  const getFilteredOptions = (field: 'allergies' | 'dietaryRestrictions' | 'specialties', predefinedOptions: string[]) => {
    return predefinedOptions.filter(option => !formData[field].includes(option));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="flex justify-around items-center max-w-7xl w-full space-y-8 bg-gray-50 p-8 rounded-xl shadow-xl">
        <div className="w-full max-w-md space-y-6">
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

            {/* Allergies */}
            <div>
              <h3 className="font-semibold mb-2">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {getFilteredOptions('allergies', ALLERGIES).map((allergy, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => toggleSelection('allergies', allergy)}
                    className={`px-3 py-1 rounded ${formData.allergies.includes(allergy) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {allergy}
                  </button>
                ))}
                {formData.allergies.map((allergy, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => toggleSelection('allergies', allergy)}
                    className={`px-3 py-1 rounded ${formData.allergies.includes(allergy) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {allergy}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowAllergyInput(!showAllergyInput)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  +
                </button>
                {showAllergyInput && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Enter custom allergy"
                      className="p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleCustomAdd('allergies', newAllergy)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <h3 className="font-semibold mb-2">Dietary Restrictions</h3>
              <div className="flex flex-wrap gap-2">
                {getFilteredOptions('dietaryRestrictions', DIETARY_RESTRICTIONS).map((restriction, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => toggleSelection('dietaryRestrictions', restriction)}
                    className={`px-3 py-1 rounded ${formData.dietaryRestrictions.includes(restriction) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  >
                    {restriction}
                  </button>
                ))}
                {formData.dietaryRestrictions.map((restriction, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => toggleSelection('dietaryRestrictions', restriction)}
                    className={`px-3 py-1 rounded ${formData.dietaryRestrictions.includes(restriction) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  >
                    {restriction}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowRestrictionInput(!showRestrictionInput)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  +
                </button>
                {showRestrictionInput && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newRestriction}
                      onChange={(e) => setNewRestriction(e.target.value)}
                      placeholder="Enter custom restriction"
                      className="p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleCustomAdd('dietaryRestrictions', newRestriction)}
                      className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Specialties */}
            <div>
              <h3 className="font-semibold mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {getFilteredOptions('specialties', SPECIALTIES).map((specialty, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => toggleSelection('specialties', specialty)}
                    className={`px-3 py-1 rounded ${formData.specialties.includes(specialty) ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                  >
                    {specialty}
                  </button>
                ))}
                {formData.specialties.map((specialty, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => toggleSelection('specialties', specialty)}
                    className={`px-3 py-1 rounded ${formData.specialties.includes(specialty) ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                  >
                    {specialty}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowSpecialtyInput(!showSpecialtyInput)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  +
                </button>
                {showSpecialtyInput && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      placeholder="Enter custom specialty"
                      className="p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleCustomAdd('specialties', newSpecialty)}
                      className="px-2 py-1 bg-purple-500 text-white rounded"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md mt-4"
            >
              Submit
            </button>
          </form>
          </div>

<div className="h-96 p-4 border rounded-xl shadow-sm scale-110">
  <DayPicker
    mode="single"
    selected={selectedDate}
    className="w-full"
  />
</div>
</div>

<div className="w-full mt-8">
<KitchenRoles />
<div className="flex justify-center items-center min-h-screen ">
    <Roulette />
  </div>
</div>
</div>
);
};

export default DietaryForm;
