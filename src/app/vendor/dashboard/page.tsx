'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Input from '@/components/Input';

const steps = [
  { id : 1, name: "Basics"},
  { id : 2, name: "Location & Photo"},
  { id : 3, name: "Pricing"},
];

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message,setMessage]  = useState("");
  
  const [loading, setLoading] = useState(false);

  
  // Form State
 const [formData, setFormData] = useState({
  make:"",
  carModel:"",
  year:"",
  location:"",
  imageUrl:"",
  pricePerDay:"",
 });

  // Protection: Kick out non-vendors
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'vendor') {
      router.push('/');
    }
  }, [status, session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const { name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  }

  const handleNext = ()=>{
    if(currentStep < steps.length) setCurrentStep((prev) => prev+1);
  }

  const handleBack = ()=>{
    if(currentStep > 1 ) setCurrentStep((prev) => prev-1); 
  }

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          make: formData.make,
          carModel: formData.carModel,
          year: formData.year,
          pricePerDay: formData.pricePerDay,
          location: formData.location,
          imageUrl: formData.imageUrl,
         }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('🚗 Car successfully added to your fleet!');
        // Clear the form
        setFormData({
          make: "",
          carModel: "",
          year: "",
         // type: "Sedan",
          location: "",
          imageUrl: "",
          pricePerDay: "",
        })
        setCurrentStep(1);
      } else {
        setMessage(`Error: ${data.message}`);
        setIsLoading(false);
      }
    } catch (error) {
      setMessage('An unexpected error occurred.');
      setIsLoading(false);
    } finally {
      setLoading(false);
    }
  };
  

  // Show a loading screen while NextAuth checks their role
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const progress = (currentStep / steps.length) * 100;
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-8 h-20 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link href="/" className="text-2xl font-bold text-slate-900">
          Car<span className="text-orange-500">Rental</span> <span className="text-slate-400 text-sm font-medium ml-2">Vendor Hub</span>
        </Link>
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 hidden sm:block">Hello, {session?.user?.name}</span>
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-slate-100 px-4 py-2 rounded-full">
            Exit
            </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 pb-32">
        <div className="w-full max-w-2xl">
          
          {/* Success/Error Message Display */}
          {message && (
            <div className={`p-4 rounded-xl mb-8 text-center font-semibold animate-fadeIn ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleAddCar} className="w-full">
            
            {/* STEP 1: BASICS */}
            {currentStep === 1 && (
              <div className="animate-fadeIn space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">What kind of car is it?</h1>
                  <p className="text-lg text-slate-500">Guests will use this to find your vehicle.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <Input label="Make (e.g. Hyundai)" name="make" value={formData.make} onChange={handleChange} required />
                  <Input label="Model (e.g. Creta)" name="carModel" value={formData.carModel} onChange={handleChange} required />
                  <Input label="Year" name="year" type="number" min="2000" max="2026" value={formData.year} onChange={handleChange} required />
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION & PHOTO */}
            {currentStep === 2 && (
              <div className="animate-fadeIn space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Where is it located?</h1>
                  <p className="text-lg text-slate-500">Add a location and a high-quality image URL.</p>
                </div>
                
                <div className="space-y-6 pt-4">
                   <Input 
                     label="Location (City/Area)" 
                     name="location" 
                     placeholder="e.g. Vijay Nagar, Indore"
                     value={formData.location} 
                     onChange={handleChange} 
                     required 
                   />
                   
                   <div className="space-y-2">
                     <Input 
                       label="Image URL" 
                       name="imageUrl" 
                       type="url"
                       placeholder="https://images.unsplash.com/photo-..."
                       value={formData.imageUrl} 
                       onChange={handleChange} 
                       required 
                     />
                     <p className="text-xs font-medium text-slate-400 pl-1">For best results, use an Unsplash URL.</p>
                   </div>
                   
                   {/* Image Preview (Only shows if they pasted a valid URL) */}
                   {formData.imageUrl && formData.imageUrl.startsWith("http") && (
                       <div className="w-full h-48 rounded-xl bg-slate-100 mt-4 overflow-hidden border border-slate-200">
                           <img src={formData.imageUrl} alt="Car Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                       </div>
                   )}
                </div>
              </div>
            )}

            {/* STEP 3: PRICING */}
            {currentStep === 3 && (
              <div className="animate-fadeIn flex flex-col items-center text-center space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Set your daily price</h1>
                  <p className="text-lg text-slate-500">You can always adjust this later based on demand.</p>
                </div>
                
                <div className="pt-8 w-full max-w-sm">
                  <div className="relative flex items-center justify-center">
                    <span className="text-6xl font-bold text-slate-900 mr-2">₹</span>
                    <input 
                      name="pricePerDay" 
                      type="number" 
                      placeholder="2500" 
                      value={formData.pricePerDay} 
                      onChange={handleChange} 
                      className="w-48 text-6xl font-bold text-slate-900 bg-transparent outline-none border-b-4 border-slate-200 focus:border-orange-500 text-center transition-colors pb-2 placeholder:text-slate-300"
                      required 
                    />
                  </div>
                  <p className="text-lg text-slate-500 font-medium mt-6">per day</p>
                </div>
              </div>
            )}
            
            <button type="submit" id="submitForm" className="hidden">Submit</button>
          </form>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-slate-200 z-50">
        <div className="w-full h-1.5 bg-slate-100 absolute top-0 left-0">
          <div className="h-full bg-orange-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="flex items-center justify-between px-8 py-5 max-w-5xl mx-auto w-full">
          {currentStep > 1 ? (
            <button onClick={handleBack} className="text-slate-900 font-bold underline hover:text-slate-600 transition-colors py-2">
              Back
            </button>
          ) : (
            <div></div> 
          )}

          {currentStep < steps.length ? (
            <Button type="button" variant="secondary" size="lg" onClick={handleNext} className="bg-slate-900 px-10">
              Next
            </Button>
          ) : (
            <Button 
              type="button" 
              variant="primary" 
              size="lg" 
              onClick={() => document.getElementById('submitForm')?.click()}
              isLoading={isLoading}
              className="px-10 shadow-lg shadow-orange-500/30"
            >
              List Car for Rent
            </Button>
          )}
        </div>
      </footer>

    </div>
  );
}