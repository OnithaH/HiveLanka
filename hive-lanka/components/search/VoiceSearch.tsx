'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VoiceSearchProps {
  onSearch?:  (query: string) => void;
  className?: string;
}

export default function VoiceSearch({ onSearch, className }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if browser supports Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;
      
      setSupported(!! SpeechRecognition);
    }
  }, []);

  const startListening = () => {
    if (! supported) {
      alert('Voice search is not supported in your browser.  Try Chrome or Edge.');
      return;
    }

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      console.log('🎤 Voice recognition started');
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      console.log('🗣️ You said:', speechResult);
      setTranscript(speechResult);
      
      // Process the search
      handleVoiceSearch(speechResult);
    };

    recognition.onerror = (event: any) => {
    console.error('❌ Speech recognition error:', event. error);
    setIsListening(false);
    
    if (event.error === 'no-speech') {
        // Don't alert for no-speech, just silently end
        console.log('⚠️ No speech detected, listening ended');
    } else if (event.error === 'not-allowed') {
        alert('Microphone access denied.  Please enable it in browser settings.');
    } else if (event.error === 'aborted') {
        // User stopped or cancelled
        console.log('🛑 Voice recognition aborted');
    } else {
        alert(`Error: ${event.error}`);
    }
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('🎤 Voice recognition ended');
    };

    recognition.start();
  };

  const handleVoiceSearch = (query: string) => {
    // Clean up the query
    const cleanQuery = query
      .toLowerCase()
      .replace(/show me /gi, '')
      .replace(/find /gi, '')
      .replace(/search for /gi, '')
      .replace(/i want /gi, '')
      .replace(/looking for /gi, '')
      .trim();

    console.log('🔍 Searching for:', cleanQuery);

    if (onSearch) {
      onSearch(cleanQuery);
    } else {
      // Redirect to shop with search query
      router.push(`/shop?search=${encodeURIComponent(cleanQuery)}`);
    }
  };

  return (
    <button
      onClick={startListening}
      disabled={isListening || !supported}
      className={`voice-search-btn ${isListening ? 'listening' :  ''} ${className || ''}`}
      title={supported ? 'Voice Search' : 'Voice search not supported'}
      type="button"
    >
      {isListening ? (
        <MicOff 
          style={{ 
            width: '20px', 
            height: '20px', 
            color:  '#DC2626',
            animation: 'pulse 1s infinite'
          }} 
        />
      ) : (
        <Mic 
          style={{ 
            width:  '20px', 
            height: '20px', 
            cursor: 'pointer', 
            flexShrink: 0, 
            color: supported ? '#000000' : '#CCCCCC'
          }} 
        />
      )}
    </button>
  );
}