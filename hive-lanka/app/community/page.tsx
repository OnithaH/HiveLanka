'use client';
import { useState } from 'react';
import { MessageSquare, Heart, Share2, MoreHorizontal, Search, TrendingUp } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

// MOCK DATA FOR DEMO
const INITIAL_POSTS = [
  {
    id: 1,
    user: "Kasun Perera",
    role: "Seller",
    time: "2 hours ago",
    tag: "Pottery Tips",
    title: "Best clay for low-fire ceramics in Sri Lanka?",
    content: "I've been struggling to find a consistent supplier for low-fire terracotta clay near Colombo. Does anyone have recommendations for local suppliers who deliver?",
    likes: 12,
    comments: 4
  },
  {
    id: 2,
    user: "Amara Silva",
    role: "Artisan",
    time: "5 hours ago",
    tag: "Events",
    title: "Who is going to the Kandy Esala Fair?",
    content: "I just registered my stall for the upcoming fair in August. Would love to connect with other Hive sellers who are attending! Maybe we can share transport?",
    likes: 28,
    comments: 15
  },
  {
    id: 3,
    user: "Hive Team",
    role: "Admin",
    time: "1 day ago",
    tag: "Announcement",
    title: "New Feature: Fundraising Portal is Live! 🚀",
    content: "We are excited to announce the launch of our new Micro-Fundraising tool. You can now support your favorite artisans directly. Check it out in the dashboard!",
    likes: 145,
    comments: 42
  }
];

export default function CommunityForum() {
  const { user } = useUser();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    const post = {
      id: Date.now(),
      user: user?.fullName || "Guest User",
      role: "Seller",
      time: "Just now",
      tag: "General",
      title: newPost.title,
      content: newPost.content,
      likes: 0,
      comments: 0
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '' });
  };

  return (
    <div className="hcf-wrapper">
      <div className="hcf-container">
        
        {/* LEFT COLUMN: FEED */}
        <div className="hcf-feed">
          {/* Create Post Widget */}
          <div className="hcf-card">
            <h3 className="font-bold text-lg mb-4">Start a Discussion</h3>
            <form onSubmit={handlePost}>
              <input 
                className="hcf-input" 
                placeholder="Topic Title..." 
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              />
              <textarea 
                className="hcf-input" 
                style={{height: '100px'}} 
                placeholder="What's on your mind?" 
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              />
              <div className="flex justify-end mt-2">
                <button type="submit" className="hcf-btn" style={{width: 'auto'}}>Post Discussion</button>
              </div>
            </form>
          </div>

          {/* Post Feed */}
          {posts.map((post) => (
            <div key={post.id} className="hcf-card">
              <div className="hcf-user-info">
                <div className="hcf-avatar" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{post.user}</h4>
                  <p className="text-xs text-slate-500">{post.role} • {post.time}</p>
                </div>
                <MoreHorizontal size={16} className="ml-auto text-slate-400" />
              </div>
              
              <span className="hcf-tag">{post.tag}</span>
              <h2 className="text-xl font-bold mb-2 text-slate-800">{post.title}</h2>
              <p className="text-slate-600 leading-relaxed mb-4">{post.content}</p>
              
              <div className="flex items-center gap-6 border-t pt-4 text-slate-500 text-sm font-bold">
                <button className="flex items-center gap-2 hover:text-red-500 transition">
                  <Heart size={18} /> {post.likes} Likes
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500 transition">
                  <MessageSquare size={18} /> {post.comments} Comments
                </button>
                <button className="flex items-center gap-2 hover:text-green-500 transition ml-auto">
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="hcf-sidebar">
          <div className="hcf-card">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input className="hcf-input" style={{marginBottom: 0, paddingLeft: '40px'}} placeholder="Search discussions..." />
            </div>
            
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-blue-600" /> Trending Topics
            </h3>
            <ul className="space-y-3">
              <li className="text-sm font-medium text-slate-600 hover:text-blue-600 cursor-pointer"># ArtisanMarket2025</li>
              <li className="text-sm font-medium text-slate-600 hover:text-blue-600 cursor-pointer"># SustainablePackaging</li>
              <li className="text-sm font-medium text-slate-600 hover:text-blue-600 cursor-pointer"># ExportRegulations</li>
              <li className="text-sm font-medium text-slate-600 hover:text-blue-600 cursor-pointer"># PotteryWorkshops</li>
            </ul>
          </div>

          <div className="hcf-card bg-gradient-to-br from-blue-600 to-indigo-700 !text-white !border-none">
            <h3 className="font-bold text-lg mb-2">Join the Hive Premium</h3>
            <p className="text-sm opacity-90 mb-4">Get exclusive access to wholesale buyers and advanced analytics.</p>
            <button className="bg-white text-blue-700 font-bold py-2 px-4 rounded-lg text-sm w-full">Upgrade Now</button>
          </div>
        </div>

      </div>
    </div>
  );
}