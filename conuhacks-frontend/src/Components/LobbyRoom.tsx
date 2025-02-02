import React, { useState } from 'react';
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar as CalendarIcon, Copy, Link as LinkIcon } from 'lucide-react';

interface Lobby {
  id: string;
  date: Date;
  link: string;
}

export default function CreateLobby() {
  const [date, setDate] = useState<Date>();
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [lobbyName, setLobbyName] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLobby = () => {
    if (!date || !lobbyName) return;

    const lobbyId = Math.random().toString(36).substring(2, 15);
    const dietaryFormLink = `/dietary-form/${lobbyId}`;

    setLobby({
      id: lobbyId,
      date: date,
      link: dietaryFormLink
    });
  };

  const copyLink = () => {
    if (lobby) {
      navigator.clipboard.writeText(`${window.location.origin}${lobby.link}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (lobby) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Lobby Created!</h1>
          <p className="text-gray-500 text-center mb-6">Share this link with your guests to collect their dietary preferences</p>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 justify-center">
            <CalendarIcon className="w-5 h-5" />
            <span>{lobby.date.toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <input 
              type="text"
              value={`${window.location.origin}${lobby.link}`}
              readOnly
              className="bg-gray-100 border p-4 rounded-xl w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={copyLink}
              className="p-4 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              {copied ? (
                <span className="text-green-500">✓</span>
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                setLobby(null);
                setDate(undefined);
                setLobbyName('');
              }}
              className="px-6 py-3 bg-teal-500 text-white rounded-xl shadow-md hover:bg-teal-600 transition duration-200"
            >
              Create Another Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create a Lobby</h1>
        <p className="text-gray-500 text-center mb-6">Select a date and name for your event to generate a dietary preferences form</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Lobby Name</label>
            <input
              type="text"
              placeholder="Enter lobby name"
              value={lobbyName}
              onChange={(e) => setLobbyName(e.target.value)}
              className="bg-gray-100 border p-4 rounded-xl w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-center items-center">
        <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-600 mb-2">Event Date</label>
            <div className="p-4 border rounded-xl shadow-sm mb-6">
            <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full"
            />
            </div>
        </div>
        </div>

          <button 
            onClick={generateLobby}
            disabled={!date || !lobbyName}
            className="w-full py-3 bg-teal-500 text-white rounded-xl shadow-md hover:bg-teal-600 transition duration-200"
          >
            <div className="text-lg justify-center text-center flex items-center">
                <div className="mr-2">
                    <LinkIcon className="w-5 h-5" />
                </div>
                <div>Generate Form Link</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
