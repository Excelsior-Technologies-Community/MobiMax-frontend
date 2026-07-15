import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, Phone, ArrowRight, Store, MapPin, Hash, FileText, CheckCircle, Upload, Globe, Map } from 'lucide-react';
import { Country, State, City } from 'country-state-city';

const PartnerSignup = () => {
  const [step, setStep] = useState(1);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  
  // Step 1: Account Info
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: KYC & Store Info
  const [storeName, setStoreName] = useState('');
  const [storeCategories, setStoreCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [otherCategoryDesc, setOtherCategoryDesc] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeCountry, setStoreCountry] = useState('');
  const [storeState, setStoreState] = useState('');
  const [storeCity, setStoreCity] = useState('');
  const [storeArea, setStoreArea] = useState('');
  const [storePincode, setStorePincode] = useState('');
  const [availableAreas, setAvailableAreas] = useState([]);
  const [aadharNumber, setAadharNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  
  // Files
  const [storeLogo, setStoreLogo] = useState(null);
  const [aadharCard, setAadharCard] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [partnerPhoto, setPartnerPhoto] = useState(null);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Dropdown data
  const countries = Country.getAllCountries();
  const states = storeCountry ? State.getStatesOfCountry(storeCountry) : [];
  const cities = storeState ? City.getCitiesOfState(storeCountry, storeState) : [];

  const carBrands = [
    'Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Honda', 
    'Toyota', 'Volkswagen', 'Skoda', 'Nissan', 'Renault', 'Kia', 'MG', 'Ford', 'Other'
  ];

  const toggleCategory = (brand) => {
    if (storeCategories.includes(brand)) {
      setStoreCategories(storeCategories.filter(c => c !== brand));
    } else {
      setStoreCategories([...storeCategories, brand]);
    }
  };

  // Pincode auto-lookup
  React.useEffect(() => {
    const fetchLocation = async () => {
      if (storePincode.length === 6 && /^\d+$/.test(storePincode)) {
        setIsFetchingLocation(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${storePincode}`);
          const data = await res.json();
          if (data && data[0] && data[0].Status === 'Success') {
            const postOffices = data[0].PostOffice;
            const details = postOffices[0];
            const stateName = details.State;
            const districtName = details.District;
            
            // Extract all areas
            const areas = postOffices.map(po => po.Name);
            setAvailableAreas(areas);
            if (areas.length > 0 && !areas.includes(storeArea)) {
              setStoreArea(areas[0]);
            }

            // Set Country to India
            setStoreCountry('IN');

            // Find State ISO Code
            const indianStates = State.getStatesOfCountry('IN');
            const stateObj = indianStates.find(s => s.name.toLowerCase() === stateName.toLowerCase());
            
            if (stateObj) {
              setStoreState(stateObj.isoCode);
              
              // Attempt to find City
              const stateCities = City.getCitiesOfState('IN', stateObj.isoCode);
              const cityObj = stateCities.find(c => 
                c.name.toLowerCase() === districtName.toLowerCase() || 
                districtName.toLowerCase().includes(c.name.toLowerCase()) ||
                c.name.toLowerCase().includes(districtName.toLowerCase())
              );
              
              if (cityObj) {
                setStoreCity(cityObj.name);
              }
            }
          } else {
            setAvailableAreas([]);
          }
        } catch (error) {
          console.error('Failed to fetch pincode details', error);
          setAvailableAreas([]);
        } finally {
          setIsFetchingLocation(false);
        }
      } else {
        setAvailableAreas([]);
      }
    };

    fetchLocation();
  }, [storePincode]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!company || !name || !email || !phone || !password) {
      setError('Please fill all account details.');
      return;
    }

    // Phone Number Validation (exactly 10 digits)
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    // Password Validation (at least one special character)
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError('Password must contain at least one special character.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!storeName || storeCategories.length === 0 || !storeAddress || !storeCountry || !storeState || !storeCity || !storeArea || !storePincode || !aadharNumber || !panNumber) {
      setError('Please fill all store and KYC details.');
      return;
    }
    if (!storeLogo || !aadharCard || !panCard || !partnerPhoto) {
      setError('Please upload all required documents.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // 1. Register Account
      const signupRes = await fetch('http://localhost:5001/api/partners/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, name, email, phone, password }),
      });

      const signupData = await signupRes.json();

      if (signupData.status !== 'success') {
        throw new Error(signupData.message || 'Signup failed');
      }

      const token = signupData.token;

      // Resolve country and state codes to names for the backend
      const resolvedCountry = Country.getCountryByCode(storeCountry)?.name || storeCountry;
      const resolvedState = State.getStateByCodeAndCountry(storeState, storeCountry)?.name || storeState;

      let finalCategories = [...storeCategories];
      if (finalCategories.includes('Other') && otherCategoryDesc) {
        finalCategories = finalCategories.map(c => c === 'Other' ? `Other: ${otherCategoryDesc}` : c);
      }
      const categoryString = finalCategories.join(', ');

      // 2. Upload Docs
      const formData = new FormData();
      formData.append('store_name', storeName);
      formData.append('store_category', categoryString);
      formData.append('store_address', storeAddress);
      formData.append('store_country', resolvedCountry);
      formData.append('store_state', resolvedState);
      formData.append('store_city', storeCity);
      formData.append('store_area', storeArea);
      formData.append('store_pincode', storePincode);
      formData.append('aadhar_number', aadharNumber);
      formData.append('pan_number', panNumber);
      
      formData.append('store_logo', storeLogo);
      formData.append('aadhar_card', aadharCard);
      formData.append('pan_card', panCard);
      formData.append('partner_photo', partnerPhoto);

      const docsRes = await fetch('http://localhost:5001/api/partners/upload-docs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const docsData = await docsRes.json();

      if (docsData.status !== 'success') {
        throw new Error(docsData.message || 'Failed to upload documents');
      }

      // Success
      setStep(3);

    } catch (err) {
      setError(err.message || 'Cannot connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <form className="space-y-5" onSubmit={handleNextStep}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
            className="pl-10 block w-full py-2.5 border border-gray-300 rounded-lg focus:ring-[#e26a1b] focus:border-[#e26a1b] sm:text-sm" placeholder="Your Company Ltd." />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
            className="pl-10 block w-full py-2.5 border border-gray-300 rounded-lg focus:ring-[#e26a1b] focus:border-[#e26a1b] sm:text-sm" placeholder="Jane Doe" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="pl-10 block w-full py-2.5 border border-gray-300 rounded-lg focus:ring-[#e26a1b] focus:border-[#e26a1b] sm:text-sm" placeholder="partner@company.com" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            maxLength={10}
            className="pl-10 block w-full py-2.5 border border-gray-300 rounded-lg focus:ring-[#e26a1b] focus:border-[#e26a1b] sm:text-sm" placeholder="e.g. 9876543210" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-xs text-gray-500 font-normal ml-1">(Min. 6 chars with 1 special character)</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="pl-10 block w-full py-2.5 border border-gray-300 rounded-lg focus:ring-[#e26a1b] focus:border-[#e26a1b] sm:text-sm" placeholder="••••••••" />
        </div>
      </div>
      <div className="pt-2">
        <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 transition-all">
          Continue to KYC
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </form>
  );

  const FileUploadField = ({ label, file, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${file ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400' : 'border-gray-300 bg-gray-50 hover:border-[#e26a1b]'}`}>
        <div className="space-y-1 text-center">
          {file ? <CheckCircle className="mx-auto h-8 w-8 text-emerald-500" /> : <Upload className="mx-auto h-8 w-8 text-gray-400" />}
          <div className="flex text-sm text-gray-600 justify-center">
            <label className={`relative cursor-pointer rounded-md font-medium px-2 py-1 shadow-sm transition-colors ${file ? 'bg-emerald-100 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-200' : 'bg-white text-[#e26a1b] hover:text-[#c45a16]'}`}>
              <span className="truncate max-w-[150px] inline-block align-bottom">{file ? file.name : 'Upload a file'}</span>
              <input type="file" className="sr-only" required={!file} accept="image/*" onChange={(e) => onChange(e.target.files[0])} />
            </label>
          </div>
          {file && <p className="text-xs text-emerald-600 font-medium mt-1">File selected</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <form className="space-y-5" onSubmit={handleFinalSubmit}>
      <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-4">
        <div className="sm:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Store Details</h3>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Store className="h-4 w-4 text-gray-400" /></div>
            <input type="text" required value={storeName} onChange={(e) => setStoreName(e.target.value)} className="pl-9 block w-full py-2 border border-gray-300 rounded-lg sm:text-sm" />
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Category (Car Brands)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Briefcase className="h-4 w-4 text-gray-400" /></div>
            <div 
              className="pl-9 block w-full py-2 border border-gray-300 rounded-lg sm:text-sm bg-white cursor-pointer select-none"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <span className={storeCategories.length === 0 ? "text-gray-500" : "text-gray-900 truncate block pr-6"}>
                {storeCategories.length === 0 ? "Select Categories" : storeCategories.join(', ')}
              </span>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className={`h-4 w-4 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            
            {isCategoryDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCategoryDropdownOpen(false)}></div>
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    {carBrands.map(brand => (
                      <label key={brand} className="flex items-center px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-[#e26a1b] border-gray-300 rounded focus:ring-[#e26a1b]"
                          checked={storeCategories.includes(brand)}
                          onChange={() => toggleCategory(brand)}
                        />
                        <span className="ml-3 text-sm text-gray-700 font-medium">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {storeCategories.includes('Other') && (
            <div className="mt-2 animate-fade-in">
              <input 
                type="text" 
                placeholder="Please describe other categories..." 
                value={otherCategoryDesc}
                onChange={(e) => setOtherCategoryDesc(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg sm:text-sm focus:ring-[#e26a1b] focus:border-[#e26a1b]"
                required
              />
            </div>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-4 w-4 text-gray-400" /></div>
            <input type="text" required value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} className="pl-9 block w-full py-2 border border-gray-300 rounded-lg sm:text-sm" />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode <span className="text-xs text-gray-500 font-normal ml-1">(Auto-fills location for India)</span>
            {isFetchingLocation && <span className="text-xs text-[#e26a1b] font-medium ml-2 animate-pulse">Fetching location...</span>}
          </label>
          <input 
            type="text" 
            required 
            value={storePincode} 
            onChange={(e) => setStorePincode(e.target.value)} 
            placeholder="e.g. 400001"
            maxLength={6}
            className="block w-full py-2 px-3 border border-gray-300 rounded-lg sm:text-sm focus:ring-[#e26a1b] focus:border-[#e26a1b]" 
          />
        </div>

        {/* Location Dropdowns */}
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Globe className="h-4 w-4 text-gray-400" /></div>
              <select 
                required 
                value={storeCountry} 
                onChange={(e) => {
                  setStoreCountry(e.target.value);
                  setStoreState('');
                  setStoreCity('');
                }} 
                className="pl-9 block w-full py-2 border border-gray-300 rounded-lg sm:text-sm bg-white"
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Map className="h-4 w-4 text-gray-400" /></div>
              <select 
                required 
                value={storeState} 
                disabled={!storeCountry}
                onChange={(e) => {
                  setStoreState(e.target.value);
                  setStoreCity('');
                }} 
                className="pl-9 block w-full py-2 border border-gray-300 rounded-lg sm:text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-4 w-4 text-gray-400" /></div>
              <select 
                required 
                value={storeCity} 
                disabled={!storeState}
                onChange={(e) => setStoreCity(e.target.value)} 
                className="pl-9 block w-full py-2 border border-gray-300 rounded-lg sm:text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area / Locality</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-4 w-4 text-gray-400" /></div>
              {availableAreas.length > 0 ? (
                <select 
                  required 
                  value={storeArea} 
                  onChange={(e) => setStoreArea(e.target.value)} 
                  className="pl-9 block w-full py-2 border border-gray-300 rounded-lg sm:text-sm bg-white"
                >
                  <option value="">Select Area</option>
                  {availableAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type="text" 
                  required 
                  value={storeArea} 
                  onChange={(e) => setStoreArea(e.target.value)} 
                  placeholder="Enter Area"
                  className="pl-9 block w-full py-2 border border-gray-300 rounded-lg sm:text-sm"
                />
              )}
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 mt-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">KYC Documents</h3>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Hash className="h-4 w-4 text-gray-400" /></div>
            <input type="text" required value={aadharNumber} onChange={(e) => setAadharNumber(e.target.value)} className="pl-9 block w-full py-2 border border-gray-300 rounded-lg sm:text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FileText className="h-4 w-4 text-gray-400" /></div>
            <input type="text" required value={panNumber} onChange={(e) => setPanNumber(e.target.value)} className="pl-9 block w-full py-2 border border-gray-300 rounded-lg sm:text-sm uppercase" />
          </div>
        </div>

        <div className="sm:col-span-2 grid grid-cols-2 gap-4 mt-2">
          <FileUploadField label="Store Logo" file={storeLogo} onChange={setStoreLogo} />
          <FileUploadField label="Partner Photo" file={partnerPhoto} onChange={setPartnerPhoto} />
          <FileUploadField label="Aadhar Card" file={aadharCard} onChange={setAadharCard} />
          <FileUploadField label="PAN Card" file={panCard} onChange={setPanCard} />
        </div>
      </div>

      <div className="pt-4 flex gap-4">
        <button type="button" onClick={() => setStep(1)} className="flex-1 py-2.5 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all">
          Back
        </button>
        <button type="submit" disabled={isLoading} className={`flex-1 flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#e26a1b] hover:bg-[#c45a16] transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {isLoading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-16 w-16 text-emerald-500 animate-bounce" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
      <p className="text-gray-600 mb-8 max-w-sm mx-auto">
        Your partner application and KYC documents have been successfully submitted and are currently <span className="font-semibold text-amber-600">under review</span> by our administration team.
        You will be notified once your account is approved.
      </p>
      <Link to="/" className="inline-flex justify-center py-2.5 px-6 border border-transparent text-sm font-bold rounded-lg text-white bg-gray-900 hover:bg-gray-800 transition-all">
        Return to Homepage
      </Link>
    </div>
  );

  return (
    <div className="flex-grow flex items-center justify-center bg-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className={`w-full bg-white rounded-xl shadow-lg p-5 sm:p-8 border-t-4 border-t-[#e26a1b] transition-all ${step === 2 ? 'max-w-3xl' : 'max-w-md'}`}>
        
        {step !== 3 && (
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-3">
              <div className="bg-[#fff7f2] p-3 rounded-full">
                <Briefcase className="h-8 w-8 text-[#e26a1b]" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Become a Partner</h2>
            <p className="text-gray-500 text-sm">
              {step === 1 ? 'Step 1: Account Information' : 'Step 2: KYC & Store Details'}
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-6 overflow-hidden">
              <div className="bg-[#e26a1b] h-1.5 rounded-full transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }}></div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 border border-red-200 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {step === 1 && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col space-y-4">
            <p className="text-center text-sm text-gray-600">
              Already a partner?{' '}
              <Link to="/partner/login" className="font-medium text-[#e26a1b] hover:text-[#c45a16] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerSignup;
