import React, { useState, useEffect } from 'react';
import { Lock, Fingerprint, ShieldAlert, CheckCircle } from 'lucide-react';

const PartnerLockScreen = ({ onUnlock, biometricEnabled }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (verifying || biometricScanning || biometricSuccess) return;
      
      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 4) {
          setPin(prev => prev + e.key);
        }
      } else if (e.key === 'Backspace') {
        setPin(prev => prev.slice(0, -1));
        setError(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, verifying, biometricScanning, biometricSuccess]);

  // Auto-verify when 4 digits are entered
  useEffect(() => {
    if (pin.length === 4 && !verifying) {
      verifyPin();
    }
  }, [pin]);

  const verifyPin = async () => {
    setVerifying(true);
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      const res = await fetch('http://localhost:5001/api/partners/verify-pin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        onUnlock();
      } else {
        setError(true);
        setPin('');
      }
    } catch (err) {
      console.error('Failed to verify PIN:', err);
      setError(true);
      setPin('');
    } finally {
      setVerifying(false);
    }
  };

  const handleBiometric = () => {
    setBiometricScanning(true);
    
    // Simulate a biometric scan delay
    setTimeout(() => {
      setBiometricScanning(false);
      setBiometricSuccess(true);
      
      // Unlock after showing success
      setTimeout(() => {
        onUnlock();
      }, 800);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-50 bg-gray-900/40 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className={`bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white/20 w-full max-w-sm flex flex-col items-center transform transition-all duration-300 ${error ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        
        <div className="w-16 h-16 bg-[#e26a1b]/10 rounded-2xl flex items-center justify-center text-[#e26a1b] mb-6">
          <Lock className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center">Dashboard Locked</h2>
        <p className="text-gray-500 text-sm text-center mt-2 mb-8">Enter your 4-digit master PIN to access the control panel.</p>

        {/* PIN Indicators */}
        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map((index) => (
            <div 
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${pin.length > index ? 'bg-[#e26a1b] scale-110 shadow-[0_0_10px_rgba(226,106,27,0.5)]' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        
        {error && (
          <div className="text-red-500 text-sm font-medium mb-4 flex items-center gap-1.5 animate-fade-in-up">
            <ShieldAlert className="w-4 h-4" /> Incorrect PIN. Try again.
          </div>
        )}
        
        {verifying && (
          <div className="text-[#e26a1b] text-sm font-medium mb-4 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#e26a1b]/30 border-t-[#e26a1b] rounded-full animate-spin"></div>
            Verifying...
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => {
                if (pin.length < 4) setPin(prev => prev + num);
                setError(false);
              }}
              className="w-16 h-16 rounded-full bg-gray-50 text-xl font-bold text-gray-900 hover:bg-[#e26a1b] hover:text-white hover:shadow-lg transition-all active:scale-95 flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div className="w-16 h-16"></div> {/* Empty space */}
          <button
            onClick={() => {
              if (pin.length < 4) setPin(prev => prev + '0');
              setError(false);
            }}
            className="w-16 h-16 rounded-full bg-gray-50 text-xl font-bold text-gray-900 hover:bg-[#e26a1b] hover:text-white hover:shadow-lg transition-all active:scale-95 flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={() => {
              setPin(prev => prev.slice(0, -1));
              setError(false);
            }}
            className="w-16 h-16 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
          </button>
        </div>

        {/* Biometric Integration */}
        {biometricEnabled && (
          <div className="w-full pt-6 border-t border-gray-100 flex flex-col items-center">
            {biometricSuccess ? (
              <div className="text-emerald-500 flex flex-col items-center animate-fade-in-up">
                <CheckCircle className="w-10 h-10 mb-2" />
                <span className="font-bold">Verified</span>
              </div>
            ) : (
              <button 
                onClick={handleBiometric}
                disabled={biometricScanning}
                className={`flex flex-col items-center gap-3 transition-all ${biometricScanning ? 'text-[#e26a1b]' : 'text-gray-500 hover:text-[#e26a1b]'}`}
              >
                <div className={`p-4 rounded-full ${biometricScanning ? 'bg-[#e26a1b]/10 shadow-[0_0_15px_rgba(226,106,27,0.3)]' : 'bg-gray-50'}`}>
                  <Fingerprint className={`w-8 h-8 ${biometricScanning ? 'animate-pulse' : ''}`} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold">
                  {biometricScanning ? 'Scanning...' : 'Use Biometrics'}
                </span>
              </button>
            )}
          </div>
        )}
        
      </div>
      
      {/* Keyframe for shaking */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}} />
    </div>
  );
};

export default PartnerLockScreen;
