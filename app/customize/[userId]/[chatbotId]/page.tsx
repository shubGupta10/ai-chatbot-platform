'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const CustomizationPage = () => {
  const router = useRouter();
  const params = useParams(); 
  const { userId, chatbotId } = params;

  const [loading, setLoading] = useState(true);
  const [customization, setCustomization] = useState({
    theme: 'light',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#4CAF50',
    fontFamily: 'Arial',
    avatarUrl: '',
    greetingMessage: 'Hello! How can I assist you today?',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        const response = await fetch(`/api/customization/${chatbotId}`);
        if (response.ok) {
          const data = await response.json();
          setCustomization(data); 
        } else {
          console.error('Failed to fetch customization data');
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomization();
  }, [chatbotId]);

  // Update customization state
  const handleInputChange = (key: string, value: any) => {
    setCustomization((prev) => ({ ...prev, [key]: value }));
  };

  // Save customization
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/customization/${chatbotId}`, {
        method: 'PUT', // Assuming the API supports PUT for updating customization
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customization),
      });
      if (response.ok) {
        alert('Customization saved successfully!');
        router.push(`/view-chatbot/${chatbotId}`); // Navigate back to ViewChatbot
      } else {
        console.error('Failed to save customization');
      }
    } catch (err) {
      console.error('Error saving customization:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return <div>Loading customization settings...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Customize Chatbot</h1>

      {/* Theme Selector */}
      <div className="space-y-2">
        <label className="block font-medium">Theme</label>
        <select
          value={customization.theme}
          onChange={(e) => handleInputChange('theme', e.target.value)}
          className="border p-2 rounded"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Customization Options */}
      {customization.theme === 'custom' && (
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Background Color</label>
            <input
              type="color"
              value={customization.backgroundColor}
              onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
              className="border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Text Color</label>
            <input
              type="color"
              value={customization.textColor}
              onChange={(e) => handleInputChange('textColor', e.target.value)}
              className="border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Button Color</label>
            <input
              type="color"
              value={customization.buttonColor}
              onChange={(e) => handleInputChange('buttonColor', e.target.value)}
              className="border rounded"
            />
          </div>
        </div>
      )}

      {/* Greeting Message */}
      <div className="space-y-2">
        <label className="block font-medium">Greeting Message</label>
        <input
          type="text"
          value={customization.greetingMessage}
          onChange={(e) => handleInputChange('greetingMessage', e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Font Selector */}
      <div>
        <label className="block font-medium">Font Family</label>
        <select
          value={customization.fontFamily}
          onChange={(e) => handleInputChange('fontFamily', e.target.value)}
          className="border p-2 rounded"
        >
          <option value="Arial">Arial</option>
          <option value="Roboto">Roboto</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
      </div>

      {/* Avatar */}
      <div>
        <label className="block font-medium">Avatar URL</label>
        <input
          type="text"
          value={customization.avatarUrl}
          onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`bg-blue-500 text-white py-2 px-4 rounded ${isSaving ? 'opacity-50' : ''}`}
      >
        {isSaving ? 'Saving...' : 'Save Customization'}
      </button>
    </div>
  );
};

export default CustomizationPage;
