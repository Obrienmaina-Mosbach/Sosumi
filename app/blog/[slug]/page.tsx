// app/blog/[slug]/page.tsx
// This component displays a single blog post, fetched from the backend.

"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaTwitter, FaFacebook, FaBookmark, FaRegBookmark, FaHeart, FaRegHeart } from "react-icons/fa"; // Import icons
import axios from "axios"; // Import axios for API calls
import { toast } from "react-toastify"; // For notifications
import { TailSpin } from 'react-loader-spinner'; // Example loading spinner
import Breadcrumbs from '@/components/Breadcrumbs'; // Assuming you have a Breadcrumbs component
import Link from 'next/link'; // Import Link for navigation to edit page
import Swal from 'sweetalert2'; // Import SweetAlert2 for confirmation dialogs

// Define a type for your blog post structure (should match your backend model)
interface BlogPostType {
  _id: string; // MongoDB ID
  title: string;
  slug: string;
  description: string;
  content: string; // HTML content
  thumbnail: string; // Renamed from 'image' to 'thumbnail' to match backend
  date: string;
  category: string;
  author: string;
  // CORRECTED: authorId can be a string (ObjectId) or a populated object with _id
  authorId: string | { _id: string; username?: string; name?: string; profilePictureUrl?: string; };
  authorImg: string;
  likesCount: number; // Assuming backend provides this
  commentsCount: number; // Denormalized count of comments
  views: number; // For popularity tracking
}

// Define a type for comments (matching backend Comment model structure)
interface CommentType {
  _id: string;
  userId: { // Populated user object
    _id: string;
    username?: string;
    name?: string;
    profilePictureUrl?: string;
  };
  content: string;
  createdAt: string; // Using createdAt from timestamps
}

// Define props for the component
interface FullBlogPageProps {
  params: { slug: string };
}

const FullBlogPage: React.FC<FullBlogPageProps> = ({ params }) => {
  const router = useRouter();

  // CORRECTED: Use React.use() to unwrap params as suggested by Next.js warning.
  const { slug } = use(params);

  interface BlogPostType {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    image: string;
    date: string;
    category: string;
    author: string;
    author_img: string;
    socials: {
      twitter: string;
      linkedin: string;
      likes?: number;
    };
    comments?: string[];
  }

  const [blog, setBlog] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for interactive features
  const [bookmarked, setBookmarked] = useState(false);
  const [userLiked, setUserLiked] = useState(false); // Track if current user liked
  const [likesCount, setLikesCount] = useState(0); // Actual likes count from backend
  const [likes, setLikes] = useState(0); // State for likes
  interface CommentType {
    _id: string;
    userId: {
      _id: string;
      username?: string;
      name?: string;
      profilePictureUrl?: string;
    };
    content: string;
    createdAt: string;
  }

  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");

  // Loading states for actions
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); // For delete action

  // State for current user's ID and role for authorization checks
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);


  // --- Fetch Blog Data and Interactive States from Backend ---
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params; // Unwrap the params Promise
      const foundBlog = blog_data.find((b) => b.slug === resolvedParams.slug);
      setBlog(foundBlog || null);

      // Check if the blog is already bookmarked
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setBookmarked(bookmarks.includes(resolvedParams.slug));

      // Initialize likes and comments (mock data for now)
      setLikes(foundBlog?.socials.likes || 0);
      setComments(foundBlog?.comments || []);
    };

    fetchParams();
  }, [params]);

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (bookmarked) {
      // Remove bookmark
      const updatedBookmarks = bookmarks.filter((savedSlug: string) => savedSlug !== blog?.slug);
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      setBookmarked(false);
    } else {
      // Add bookmark
      localStorage.setItem("bookmarks", JSON.stringify([...bookmarks, blog?.slug]));
      setBookmarked(true);
    }
  };

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + 1);
    // Optionally, send a request to the backend to persist likes
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments((prevComments) => [
        ...prevComments,
        {
          _id: `${Date.now()}`, // Generate a unique ID
          userId: {
            _id: currentUserId || "anonymous",
            username: "Guest",
          },
          content: newComment,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewComment("");
      // Optionally, send a request to the backend to persist the comment
    }
  };

  // Handle case where blog is not found
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-800 text-lg">Blog not found.</p>
        <button
          onClick={() => router.push("/blog")}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  const handleShare = (platform: "twitter" | "facebook") => {
    if (!blog) return;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/blog/${blog.slug}`; // Use env variable or current origin
    const text = `Check out this blog: ${blog.title}`;
    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank"
      );
    }
  };

  // --- Handle Delete Blog Post ---
  const handleDeleteBlog = async () => {
    if (!blog || deleteLoading) return;

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleteLoading(true);
        try {
          // Use the slug for deletion as per api-blog-slug-route (PUT/DELETE)
          const response = await axios.delete(`/api/blog/${blog.slug}`);
          if (response.data.success) {
            toast.success(response.data.msg || "Blog post deleted successfully!");
            router.push('/blog'); // Redirect to blog list after deletion
          } else {
            toast.error(response.data.msg || "Failed to delete blog post.");
          }
        } catch (error: any) {
          console.error("Error deleting blog post:", error);
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            toast.error("You are not authorized to delete this blog.");
            router.push('/signin');
          } else if (axios.isAxiosError(error) && error.response?.status === 403) {
            toast.error("You do not have permission to delete this blog.");
          } else {
            toast.error("An error occurred while deleting the blog post.");
          }
        } finally {
          setDeleteLoading(false);
        }
      }
    });
  };


  // --- Check if current user can edit/delete this blog ---
  const canModify = blog && currentUserId && (
    (typeof blog.authorId === 'string' ? blog.authorId : blog.authorId._id) === currentUserId || currentUserRole === 'admin'
  );


  // --- Loading and Error States ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
        <p className="ml-4 text-gray-700">Loading blog post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => router.push("/blog")} // Or router.back()
          className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  if (!blog) { // Should be caught by error state, but as a fallback
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-800 text-lg mb-4">Blog not found.</p>
        <button
          onClick={() => router.push("/blog")}
          className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  // Determine the author's ID for the link, handling both string and populated object types
  const authorProfileId = typeof blog.authorId === 'string' ? blog.authorId : blog.authorId._id;

  const breadcrumbPaths = [
    { label: 'Home', href: '/' },
    { label: 'Blogs', href: '/blog' },
    { label: blog.title, href: `/blog/${blog.slug}` },
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-10 lg:p-12">
        <Breadcrumbs paths={breadcrumbPaths} />

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">{blog.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 mb-6">
            {/* Link to Author Profile Page */}
            <Link href={`/author/${authorProfileId.toString()}`} className="flex items-center gap-2 hover:underline hover:text-indigo-600 transition-colors">
                <Image src={blog.authorImg} alt={blog.author} width={40} height={40} className="rounded-full object-cover"/>
                <p><strong>Author:</strong> {blog.author}</p>
            </Link>
            <p><strong>Published on:</strong> {new Date(blog.date).toLocaleDateString()}</p>
        </div>

        {/* Edit and Delete Blog Buttons (Conditional Rendering) */}
        {canModify && (
          <div className="mb-6 flex justify-end gap-3">
            <Link
              href={`/edit-blog/${blog.slug}`}
              className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
            >
              Edit Blog
            </Link>
            <button
              onClick={handleDeleteBlog}
              disabled={deleteLoading}
              className={`px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium ${
                deleteLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {deleteLoading ? (
                <TailSpin height="20" width="20" color="#fff" ariaLabel="deleting" />
              ) : (
                'Delete Blog'
              )}
            </button>
          </div>
        )}

        <Image
          src={blog.thumbnail} // Use 'thumbnail' as per backend model
          alt={blog.title}
          width={800}
          height={400} // Adjusted height for better aspect ratio
          className="w-full h-48 sm:h-64 object-cover rounded-lg mb-6"
          priority // Prioritize loading for LCP
        />
        {/* Render blog content using dangerouslySetInnerHTML */}
        <div
          className="text-gray-700 leading-relaxed prose prose-lg max-w-none" // Added prose classes for better typography
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Like ({likes})
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={`mt-8 px-4 py-2 rounded-md ${
            bookmarked ? "bg-purple-500 text-white" : "bg-orange-500 text-white"
          } hover:bg-purple-600 transition-colors`}
        >
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>

          <button
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <FaTwitter className="w-5 h-5" /> Twitter
          </button>
          <button
            onClick={() => handleShare("facebook")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            <FaFacebook className="w-5 h-5" /> Facebook
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Comments ({comments.length})</h3>
          <div className="space-y-4 mb-6">
            {comments.length > 0 ? (
                comments.map((comment, index) => (
                    <div key={comment._id || index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center mb-2">
                            {comment.userId?.profilePictureUrl && (
                                <Image
                                    src={comment.userId.profilePictureUrl}
                                    alt={comment.userId.username || comment.userId.name || 'User'}
                                    width={30}
                                    height={30}
                                    className="rounded-full object-cover mr-2"
                                />
                            )}
                            <p className="font-medium text-gray-800">
                                {comment.userId?.username || comment.userId?.name || `User ${comment.userId?._id.substring(0, 8)}...`}
                            </p>
                            <span className="text-sm text-gray-500 ml-auto">
                                {new Date(comment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>

          <h4 className="text-xl font-semibold mb-3 text-gray-800">Add a Comment</h4>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
            rows={4}
            placeholder="Write your comment here..."
            disabled={commentLoading}
          ></textarea>
          <button
            onClick={handleAddComment}
            disabled={commentLoading || !newComment.trim()}
            className={`mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center gap-2 ${
              commentLoading || !newComment.trim() ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {commentLoading ? (
                <TailSpin height="20" width="20" color="#fff" ariaLabel="loading" />
            ) : (
                'Add Comment'
            )}
          </button>
        </div>

        <button
          onClick={() => router.push("/blog")}
          className="mt-8 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
        >
          Back to Main Page
        </button>
      </div>
    </div>
  );
};

export default FullBlogPage;
