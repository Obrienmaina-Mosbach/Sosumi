// app/author/[userId]/page.tsx
"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import Breadcrumbs from '@/components/Breadcrumbs'; // Assuming you have a Breadcrumbs component

// Define a type for the public author profile data
interface AuthorProfileType {
  _id: string;
  username?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  bio?: string;
  country?: string;
  gender?: string;
  homepageUrl?: string;
  company?: string;
  city?: string;
  interests?: string[]; // Assuming interests are stored as an array of strings
  registeredAt: string; // Date string
  role: string;
}

interface AuthorProfilePageProps {
  params: { userId: string };
}

const AuthorProfilePage: React.FC<AuthorProfilePageProps> = ({ params }) => {
  const router = useRouter();
  const { userId } = use(params); // Use React.use() to unwrap params

  const [authorProfile, setAuthorProfile] = useState<AuthorProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch public author profile from the new API endpoint
        const response = await axios.get(`/api/public/user/${userId}`);
        if (response.data.success && response.data.author) {
          setAuthorProfile(response.data.author);
        } else {
          setError(response.data.message || "Author profile not found.");
          toast.error(response.data.message || "Failed to load author profile.");
        }
      } catch (err: any) {
        console.error("Error fetching author profile:", err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || "Failed to load author profile. Please try again.");
          toast.error(err.response.data.message || "Failed to load author profile. Please try again.");
        } else {
          setError("Failed to load author profile. An unexpected error occurred.");
          toast.error("Failed to load author profile. An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAuthorProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
        <p className="ml-4 text-gray-700">Loading author profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!authorProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-800 text-lg">Author profile not found.</p>
      </div>
    );
  }

  const displayName = authorProfile.name || (authorProfile.firstName && authorProfile.lastName ? `${authorProfile.firstName} ${authorProfile.lastName}` : authorProfile.username || 'Unknown Author');
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const breadcrumbPaths = [
    { label: 'Home', href: '/' },
    { label: 'Blogs', href: '/blog' },
    { label: displayName, href: `/author/${authorProfile._id}` },
  ];


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-10 lg:p-12">
        <Breadcrumbs paths={breadcrumbPaths} />

        {/* Author Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center flex-grow">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              {authorProfile.profilePictureUrl ? (
                <Image
                  src={authorProfile.profilePictureUrl}
                  alt={displayName}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = 'https://placehold.co/160x160/cccccc/333333?text=Profile+Photo')}
                />
              ) : (
                <span className="text-gray-500 text-center text-sm md:text-base">No Photo</span>
              )}
            </div>
            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-gray-800 break-words max-w-[calc(100%-60px)]">
                {displayName}
              </h2>
              {authorProfile.username && authorProfile.username !== displayName && (
                <p className="text-gray-600 text-lg mt-1">@{authorProfile.username}</p>
              )}
              <p className="text-gray-700 text-lg mt-2">
                <strong>Role:</strong> {authorProfile.role.charAt(0).toUpperCase() + authorProfile.role.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-4 p-4 bg-gray-100 rounded-md text-gray-700 leading-relaxed max-w-full">
            <h4 className="font-semibold text-lg mb-2">Bio</h4>
            <p className="text-gray-700">
                {authorProfile.bio || <span className="italic text-gray-500">No bio available.</span>}
            </p>
        </div>

        {/* Other Details Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          <p className="text-gray-700 text-lg md:col-span-2">
            <strong>Joined:</strong> {formatDate(authorProfile.registeredAt)}
          </p>
          {authorProfile.country && (
            <p className="text-gray-700 text-lg">
              <strong>Country:</strong> {authorProfile.country}
            </p>
          )}
          {authorProfile.city && (
            <p className="text-gray-700 text-lg">
              <strong>City:</strong> {authorProfile.city}
            </p>
          )}
          {authorProfile.gender && (
            <p className="text-gray-700 text-lg">
              <strong>Gender:</strong> {authorProfile.gender}
            </p>
          )}
          {authorProfile.company && (
            <p className="text-gray-700 text-lg">
              <strong>Company:</strong> {authorProfile.company}
            </p>
          )}
          {authorProfile.homepageUrl && (
            <p className="text-gray-700 text-lg md:col-span-2">
              <strong>Homepage:</strong> <a href={authorProfile.homepageUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{authorProfile.homepageUrl}</a>
            </p>
          )}
          {authorProfile.interests && authorProfile.interests.length > 0 && (
            <p className="text-gray-700 text-lg md:col-span-2">
              <strong>Interests:</strong> {authorProfile.interests.join(', ')}
            </p>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
            <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-700 text-white font-medium rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 text-lg transition-colors"
            >
                Back
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfilePage;
