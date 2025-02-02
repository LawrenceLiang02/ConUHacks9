import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DietaryPreferences {
  name: string;
  email: string;
  allergies: string[];
  dietaryRestrictions: string[];
}

const UserPreferencesRetrieval: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [userPreferences, setUserPreferences] = useState<DietaryPreferences | null>(null);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/list-users');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get-user-preferences`, {
        params: { name: userName }
      });
      setUserPreferences(response.data);
    } catch (error) {
      console.error('Error fetching user preferences', error);
      alert('User preferences not found');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">User Preferences</h2>

      <div className="mb-4">
        <label className="block mb-2">Select User</label>
        <select 
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
      </div>

      <button 
        onClick={fetchUserPreferences}
        disabled={!userName}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        Fetch Preferences
      </button>

      {userPreferences && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="text-xl font-semibold mb-4">Preferences for {userPreferences.name}</h3>
          
          <div>
            <strong>Email:</strong> {userPreferences.email}
          </div>
          
          <div className="mt-2">
            <strong>Allergies:</strong>
            <ul className="list-disc list-inside">
              {userPreferences.allergies.length > 0 
                ? userPreferences.allergies.map(allergy => (
                    <li key={allergy}>{allergy}</li>
                  ))
                : <li>No allergies reported</li>
              }
            </ul>
          </div>
          
          <div className="mt-2">
            <strong>Dietary Restrictions:</strong>
            <ul className="list-disc list-inside">
              {userPreferences.dietaryRestrictions.length > 0
                ? userPreferences.dietaryRestrictions.map(restriction => (
                    <li key={restriction}>{restriction}</li>
                  ))
                : <li>No dietary restrictions reported</li>
              }
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPreferencesRetrieval;