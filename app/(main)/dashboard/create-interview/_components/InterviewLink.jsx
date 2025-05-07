import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Calendar, Clock, Copy, Linkedin, List, Mail, Phone, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

const InterviewLink = ({ interview_id, formData }) => {
  const router = useRouter();
  const [isCopying, setIsCopying] = useState(false);
  
  // URL generation
  const baseUrl = process.env.NEXT_PUBLIC_HOST_URL?.replace(/\/$/, '') || window.location.origin;
  const url = `${baseUrl}/interview/${interview_id}`;

  // Expiry date calculation
  const expiresAt = () => {
    try {
      const createdDate = new Date(formData?.created_at || new Date());
      const futureDate = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      return futureDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      console.error("Date parsing error:", e);
      return "30 days from now";
    }
  };

  // Copy link functionality
  const onCopyLink = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard', {
        position: 'top-center',
        duration: 1500
      });
    } catch (err) {
      toast.error('Failed to copy link', {
        position: 'top-center'
      });
    } finally {
      setTimeout(() => setIsCopying(false), 1000);
    }
  };

  // Share functionality
  const shareVia = (platform) => {
    const interviewTitle = formData?.title || 'AI Interview';
    const text = `Join my ${interviewTitle} interview: ${url}`;

    switch(platform) {
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(interviewTitle)}&body=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank',
          'noopener,noreferrer'
        );
        break;
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text)}`,
          '_blank',
          'noopener,noreferrer'
        );
        break;
    }
  };

  // Navigation
  const navigateTo = (path) => {
    try {
      router.push(path);
    } catch (e) {
      window.location.href = path;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="mx-auto mb-5 flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100">
            <Image 
              src="/tick3.png" 
              alt="Success" 
              width={24} 
              height={24} 
              className="text-emerald-600" 
            />
          </div>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Your Interview is Ready</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Share the personalized interview link with candidates to begin the process
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* Link Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800">Interview Link</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
              Valid for 30 days
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Input 
                value={url} 
                readOnly 
                className="pl-3 pr-10 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors" 
                onFocus={(e) => e.target.select()}
              />
              <button 
                onClick={onCopyLink}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Copy link"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <Button 
              onClick={onCopyLink}
              disabled={isCopying}
              className="shrink-0"
              size="lg"
            >
              {isCopying ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                <span className="font-medium text-gray-700">{formData?.duration || '30 min'}</span> duration
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <List className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                <span className="font-medium text-gray-700">
                  {formData?.questionList?.length || formData?.questList?.length || '10'}
                </span> questions
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>Expires <span className="font-medium text-gray-700">{expiresAt()}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Share Interview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            onClick={() => shareVia('email')}
            className="h-12 flex flex-col items-center justify-center gap-1 hover:bg-gray-50"
          >
            <Mail className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Email</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => shareVia('linkedin')}
            className="h-12 flex flex-col items-center justify-center gap-1 hover:bg-gray-50"
          >
            <Linkedin className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">LinkedIn</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => shareVia('whatsapp')}
            className="h-12 flex flex-col items-center justify-center gap-1 hover:bg-gray-50"
          >
            <Phone className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">WhatsApp</span>
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          onClick={() => navigateTo('/dashboard')}
          className="flex-1 h-12"
          size="lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <Button 
          onClick={() => navigateTo('/dashboard/create-interview')}
          className="flex-1 h-12"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Interview
        </Button>
      </div>
    </div>
  );
};

export default InterviewLink;