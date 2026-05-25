'use client';

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Input from "@/components/Input";

const steps = [
    { id: 1 , name : "The Basics"},
    { id: 2 , name : "Car Details"},
    { id: 3 , name : "Pricing"},
    { id: 4 , name : "Photos"},
];

export default function ListYourCarPage(){
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        make: "",
        model: "",
        year: "",
        type: "Sedan",
        description: "",
        seats: "4",
        transmission: "Automatic",
        pricePerDay:"",
    });

    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>{
        const {name,value} = e.target;
        setFormData((prev) => ({...prev,[name]: value}));
    };

    const handleNext = () =>{
        if(currentStep < steps.length){
            setCurrentStep((prev) => prev+1);
        }
    };

    const handleBack = () =>{
        if(currentStep > 1){
            setCurrentStep((prev) => prev - 1);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(()=>{
            setIsLoading(false);
            alert("Car listed successfully!! Redirecting to your Host Dashboard...");
            //router.push("/host/Dashboard");
        },2000);
    }

    const progress = ((currentStep) / steps.length)* 100;
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-8 h-20 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link href="/" className="text-2xl font-bold text-slate-900">
          Car<span className="text-orange-500">Rental</span>
        </Link>
        <Link href="/host" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-slate-100 px-4 py-2 rounded-full">
          Exit & Save
        </Link>
      </header>

      {/* Main Content Area - Centers the form vertically and horizontally */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 pb-32">
        <div className="w-full max-w-2xl">
          
          <form onSubmit={handleSubmit} className="w-full">
            
            {/* STEP 1: BASICS */}
            {currentStep === 1 && (
              <div className="animate-fadeIn space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">What kind of car is it?</h1>
                  <p className="text-lg text-slate-500">Guests will use this to filter and find your vehicle.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <Input label="Make (e.g. BMW)" name="make" value={formData.make} onChange={handleChange} required />
                  <Input label="Model (e.g. M3)" name="model" value={formData.model} onChange={handleChange} required />
                  <Input label="Year" name="year" type="number" min="2000" max="2026" value={formData.year} onChange={handleChange} required />
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 mb-2">Vehicle Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-slate-900 font-medium cursor-pointer transition-all hover:border-slate-300">
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Sports">Sports</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: DETAILS */}
            {currentStep === 2 && (
              <div className="animate-fadeIn space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Highlight the details</h1>
                  <p className="text-lg text-slate-500">What makes your car a great ride?</p>
                </div>
                
                <div className="space-y-6 pt-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      rows={5}
                      placeholder="e.g. Perfect for weekend getaways, great gas mileage, features a premium sound system..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-slate-900 resize-none transition-all hover:border-slate-300 text-lg"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Input label="Seats" name="seats" type="number" min="2" max="9" value={formData.seats} onChange={handleChange} required />
                    <Input label="Doors" name="doors" type="number" min="2" max="5" value={formData.doors} onChange={handleChange} required />
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-slate-700 mb-2">Transmission</label>
                      <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 outline-none focus:border-orange-500 text-slate-900 font-medium cursor-pointer">
                        <option value="Auto">Auto</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PRICING */}
            {currentStep === 3 && (
              <div className="animate-fadeIn flex flex-col items-center text-center space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Now, set your price</h1>
                  <p className="text-lg text-slate-500">You can always change this later.</p>
                </div>
                
                <div className="pt-8 w-full max-w-sm">
                  <div className="relative flex items-center justify-center">
                    <span className="text-6xl font-bold text-slate-900 mr-2">$</span>
                    <input 
                      name="pricePerDay" 
                      type="number" 
                      placeholder="00" 
                      value={formData.pricePerDay} 
                      onChange={handleChange} 
                      className="w-48 text-6xl font-bold text-slate-900 bg-transparent outline-none border-b-4 border-slate-200 focus:border-orange-500 text-center transition-colors pb-2 placeholder:text-slate-300"
                      required 
                    />
                  </div>
                  <p className="text-lg text-slate-500 font-medium mt-6">/ day</p>
                </div>
              </div>
            )}

            {/* STEP 4: PHOTOS */}
            {currentStep === 4 && (
              <div className="animate-fadeIn space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Show off your car</h1>
                  <p className="text-lg text-slate-500">High-quality photos increase your bookings by up to 30%.</p>
                </div>
                
                <div className="pt-4">
                  <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-3xl p-16 text-center hover:bg-orange-50 hover:border-orange-400 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-slate-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Drag and drop photos here</h3>
                    <p className="text-slate-500">or click to browse from your device</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Hidden submit button triggered by bottom bar */}
            <button type="submit" id="submitForm" className="hidden">Submit</button>
          </form>
        </div>
      </main>

      {/* Sticky Bottom Bar (The Magic Element) */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-slate-200 z-50 pb-safe">
        {/* Top edge progress bar */}
        <div className="w-full h-1.5 bg-slate-100 absolute top-0 left-0">
          <div 
            className="h-full bg-orange-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between px-8 py-5 max-w-5xl mx-auto w-full">
          {currentStep > 1 ? (
            <button onClick={handleBack} className="text-slate-900 font-bold underline hover:text-slate-600 transition-colors py-2">
              Back
            </button>
          ) : (
            <div></div> // Spacing placeholder
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
              className="px-10"
            >
              Publish Listing
            </Button>
          )}
        </div>
      </footer>

    </div>
  );
}

