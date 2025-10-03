import React, { useState } from 'react';
import { UserInput } from '../types';
import { countries } from '../data/countries';

interface UserInputFormProps {
  onSubmit: (data: UserInput) => void;
}

const InputField: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; required?: boolean }> = ({ id, label, value, onChange, placeholder, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input
            type="text"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
    </div>
);

const SelectField: React.FC<{ id: string; name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; required?: boolean; disabled?: boolean }> = ({ id, name, label, value, onChange, children, required = true, disabled = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        >
            {children}
        </select>
    </div>
);

const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserInput>({
    destinationCountry: '',
    destinationCity: '',
    profession: '',
    age: '',
    lifestyle: 'Moderate',
  });

  const [cities, setCities] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'destinationCountry') {
        const selectedCountry = countries.find(c => c.name === value);
        setFormData(prev => ({
            ...prev,
            destinationCountry: value,
            destinationCity: '', // Reset city
        }));
        setCities(selectedCountry ? selectedCountry.cities.sort() : []);
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Start Your Journey</h2>
        <p className="text-slate-600 mb-6">Tell us about your plans so we can generate a personalized report.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField id="destinationCountry" name="destinationCountry" label="Destination Country" value={formData.destinationCountry} onChange={handleChange}>
                    <option value="" disabled>Select a country</option>
                    {countries.map(country => <option key={country.name} value={country.name}>{country.name}</option>)}
                </SelectField>
                <SelectField id="destinationCity" name="destinationCity" label="Destination City" value={formData.destinationCity} onChange={handleChange} disabled={!formData.destinationCountry || cities.length === 0}>
                    <option value="" disabled>Select a city</option>
                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                </SelectField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="profession" label="Your Profession" value={formData.profession} onChange={handleChange} placeholder="e.g., Software Engineer, Retired"/>
                <InputField id="age" label="Your Age" value={formData.age} onChange={handleChange} placeholder="e.g., 35"/>
            </div>
            <div>
                <label htmlFor="lifestyle" className="block text-sm font-medium text-slate-700 mb-1">Lifestyle Expectation</label>
                <select id="lifestyle" name="lifestyle" value={formData.lifestyle} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                    <option>Budget-conscious</option>
                    <option>Moderate</option>
                    <option>Luxury</option>
                </select>
            </div>
            <div className="flex justify-end">
                <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105">
                    Next
                </button>
            </div>
        </form>
    </div>
  );
};

export default UserInputForm;