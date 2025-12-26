'use client';

import { useState } from 'react';
import { TUTORIALS } from '@/lib/tutorials';
import { Search, PlayCircle, BookOpen } from 'lucide-react';
import Image from 'next/image';

export default function TutorialsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(TUTORIALS.map(t => t.category)))];

  // Filter tutorials
  const filteredTutorials = TUTORIALS.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#2E7D32', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
            <BookOpen size={40} /> Artisan Knowledge Hub
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Master your craft and your business. Explore our library of video tutorials designed specifically for Sri Lankan artisans.
          </p>
        </div>

        {/* Controls */}
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '15px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          marginBottom: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          border: '1px solid #eee'
        }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={20} />
            <input 
              type="text" 
              placeholder="Search tutorials (e.g. 'Packaging', 'Photos')..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 45px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '25px',
                  border: 'none',
                  background: selectedCategory === cat ? '#2E7D32' : '#f0f0f0',
                  color: selectedCategory === cat ? 'white' : '#666',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '30px' 
        }}>
          {filteredTutorials.map(video => (
            <a 
              key={video.id} 
              href={video.videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ 
                background: 'white', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Thumbnail Container */}
                <div style={{ position: 'relative', height: '180px', background: '#000' }}>
                  <Image 
                    src={video.thumbnail} 
                    alt={video.title} 
                    fill 
                    style={{ objectFit: 'cover', opacity: 0.8 }} 
                  />
                  {/* Play Icon Overlay */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    color: 'white' 
                  }}>
                    <PlayCircle size={50} fill="rgba(0,0,0,0.5)" />
                  </div>
                  {/* Duration Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {video.duration}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ 
                    color: '#2E7D32', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold', 
                    textTransform: 'uppercase', 
                    marginBottom: '5px' 
                  }}>
                    {video.category}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', lineHeight: '1.4' }}>
                    {video.title}
                  </h3>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', color: '#666', fontSize: '0.9rem' }}>
                    Watch Tutorial →
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {filteredTutorials.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
            <p style={{ fontSize: '1.2rem' }}>No tutorials found matching "{searchTerm}"</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              style={{ marginTop: '10px', color: '#2E7D32', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}