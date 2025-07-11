// import-hardcoded-blogs.js
// This script is for one-time use to import your initial hardcoded blog data into MongoDB.

import mongoose from 'mongoose';
import { BlogPost, User } from './Lib/models/blogmodel.js'; // Adjust path as needed
import dotenv from 'dotenv'; // To load environment variables from .env file
import slugify from 'slugify'; // To ensure slugs are generated correctly

// Load environment variables from .env file
dotenv.config();

// Your hardcoded blog data
const blog_data = [
    {
      id: 1,
      title: "A Detailed Step-by-Step Guide to Manage Your Lifestyle",
      slug: "detailed-lifestyle-guide",
      description: "How to retire early",
      image: "/images/photo1.png",
      date: new Date().toISOString(),
      category: "Lifestyle",
      author: "Naki Des",
      author_img: "/images/profile_icon.png",
    },
    {
      id: 2,
      title: "10 Simple Habits to Improve Your Mental Health",
      slug: "mental-health-habits",
      description: "Practical strategies for everyday calm",
      image: "/images/photo2.png",
      date: new Date().toISOString(),
      category: "Health",
      author: "Amara Ndebele",
      author_img: "/images/profile_icon_2.png",
    },
    {
      id: 3,
      title: "Mastering Your Finances in Your 20s",
      slug: "mastering-finances-20s", // Added missing slug
      description: "Budgeting, saving, and investing made simple",
      image: "/images/photo3.png",
      date: new Date().toISOString(),
      category: "Finance",
      author: "Leo Matovu",
      author_img: "/images/profile_icon_3.png",
    },
    {
      id: 4,
      title: "Remote Work Hacks for the Productive Nomad",
      slug: "remote-work-hacks", // Added missing slug
      description: "Tools and tips to stay efficient anywhere",
      image: "/images/photo4.png",
      date: new Date().toISOString(),
      category: "Lifestyle",
      author: "Samantha K.",
      author_img: "/images/profile_icon_4.png",
    },
    {
      id: 5,
      title: "Eating Clean Without Losing Your Mind",
      slug: "eating-clean-guide", // Added missing slug
      description: "Realistic ways to keep your diet balanced",
      image: "/images/photo5.png",
      date: new Date().toISOString(),
      category: "Lifestyle",
      author: "Naki Des",
      author_img: "/images/profile_icon.png",
    },
    {
      id: 6,
      title: "Traveling on a Budget: Secrets from a Pro",
      slug: "traveling-on-budget", // Added missing slug
      description: "Explore the world without draining your savings",
      image: "/images/photo6.png",
      date: new Date().toISOString(),
      category: "Travel",
      author: "Tariq L.",
      author_img: "/images/profile_icon_6.png",
    },
    {
      id: 7,
      title: "Building a Morning Routine that Works for You",
      slug: "morning-routine-guide", // Added missing slug
      description: "Ditch the 5am club and find your own rhythm",
      image: "/images/photo7.png",
      date: new Date().toISOString(),
      category: "Lifestyle",
      author: "Jenna Okeke",
      author_img: "/images/profile_icon_7.png",
    },
    {
      id: 8,
      title: "How I Built My First App in 30 Days",
      slug: "built-first-app", // Added missing slug
      description: "Lessons from a newbie turned full-stack dev",
      image: "/images/photo8.png",
      date: new Date().toISOString(),
      category: "Tech",
      author: "David Z.",
      author_img: "/images/profile_icon_8.png",
    },
    {
      id: 9,
      title: "5 Must-Read Books That Changed My Perspective",
      slug: "must-read-books", // Added missing slug
      description: "Expand your thinking with these gems",
      image: "/images/photo9.png",
      date: new Date().toISOString(),
      category: "Lifestyle",
      author: "Laila Achieng",
      author_img: "/images/profile_icon_9.png",
    },
    {
      id: 10,
      title: "The Ultimate Guide to Digital Decluttering",
      slug: "digital-decluttering-guide", // Added missing slug
      description: "Organize your online life like a pro",
      image: "/images/photo10.png",
      date: new Date().toISOString(),
      category: "Productivity",
      author: "Chris Danvers",
      author_img: "/images/profile_icon_10.png",
    },
    {
      id: 11,
      title: "Side Hustles That Actually Pay in 2025",
      slug: "side-hustles-2025", // Added missing slug
      description: "Real opportunities beyond surveys and dropshipping",
      image: "/images/photo11.png",
      date: new Date().toISOString(),
      category: "Finance",
      author: "Maya Kim",
      author_img: "/images/profile_icon_11.png",
    },
    {
      id: 12,
      title: "Mindfulness Without the Woo-Woo",
      slug: "mindfulness-without-woo-woo", // Added missing slug
      description: "Science-backed ways to reset your brain",
      image: "/images/photo12.png",
      date: new Date().toISOString(),
      category: "Health",
      author: "Yusuf B.",
      author_img: "/images/profile_icon_12.png",
    },
    {
      id: 13,
      title: "How to Start a Successful Podcast in 2025",
      slug: "start-successful-podcast", // Added missing slug
      description: "Equipment, topics, and audience growth tips",
      image: "/images/photo13.png",
      date: new Date().toISOString(),
      category: "Media",
      author: "Naki Des",
      author_img: "/images/profile_icon.png",
    },
    {
      id: 14,
      title: "From Couch to 5K: Beginner’s Guide to Running",
      slug: "couch-to-5k-guide", // Added missing slug
      description: "Fitness tips for total beginners",
      image: "/images/photo14.png",
      date: new Date().toISOString(),
      category: "Health",
      author: "Brenda Tendo",
      author_img: "/images/profile_icon_14.png",
    },
    {
      id: 15,
      title: "Eco-Friendly Living on a Student Budget",
      slug: "eco-friendly-student", // Added missing slug
      description: "Green habits that don’t break the bank",
      image: "/images/photo15.png",
      date: new Date().toISOString(),
      category: "Health",
      author: "Kwame A.",
      author_img: "/images/profile_icon_15.png",
    }
];

const importBlogs = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            // useNewUrlParser: true, // Deprecated in Mongoose 6+
            // useUnifiedTopology: true, // Deprecated in Mongoose 6+
        });
        console.log('MongoDB connected for import.');

        // --- Debugging and finding the specific user ---
        console.log('\n--- Attempting to find Petra Namuyiga ---');
        let defaultAuthor = await User.findOne({ firstName: "Petra", lastName: "Namuyiga" });
        console.log('Result of findOne by firstName/lastName:', defaultAuthor ? defaultAuthor.email : 'Not found');

        if (!defaultAuthor) {
            console.log('Attempting to find Petra by email as fallback...');
            defaultAuthor = await User.findOne({ email: "petranamatovu@gmail.com" });
            console.log('Result of findOne by email:', defaultAuthor ? defaultAuthor.email : 'Not found');
        }

        if (!defaultAuthor) {
            console.error('User "Petra Namuyiga" (or petranamatovu@gmail.com) not found in the database. Please ensure this user exists before importing blogs. Listing all users below:');
            const allUsers = await User.find({}).select('firstName lastName email username');
            console.log(JSON.stringify(allUsers, null, 2)); // Log all users for inspection
            mongoose.connection.close();
            return;
        }
        console.log(`Assigning blogs to user: ${defaultAuthor.email} (ID: ${defaultAuthor._id})`);
        // --- End of user finding logic ---

        let importedCount = 0;
        for (const blogEntry of blog_data) {
            // Ensure slug exists, generate if missing (though your provided data has them)
            const blogSlug = blogEntry.slug || slugify(blogEntry.title, { lower: true, strict: true });

            // Check if blog already exists by slug to prevent duplicates
            const existingBlog = await BlogPost.findOne({ slug: blogSlug });

            if (existingBlog) {
                console.log(`Skipping existing blog: "${blogEntry.title}" (Slug: ${blogSlug})`);
                continue;
            }

            // Create a new blog post document
            const newBlogPost = new BlogPost({
                title: blogEntry.title,
                slug: blogSlug,
                description: blogEntry.description,
                content: "This is placeholder content for the blog post. You can edit this later through the 'Edit Blog' functionality. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", // Add some default content
                category: blogEntry.category,
                thumbnail: blogEntry.image, // Use the 'image' field as thumbnail URL
                authorId: defaultAuthor._id, // Assign the found user's ID
                author: defaultAuthor.name || defaultAuthor.username || defaultAuthor.email, // Use default author's name
                authorImg: defaultAuthor.profilePictureUrl || '/images/default-profile.png', // Use default author's image
                date: new Date(blogEntry.date), // Convert date string to Date object
                isPublished: true, // Mark as published by default
                likesCount: 0,
                commentsCount: 0,
                views: 0,
            });

            await newBlogPost.save();
            importedCount++;
            console.log(`Imported: "${blogEntry.title}"`);
        }

        console.log(`\nSuccessfully imported ${importedCount} new blog posts.`);

    } catch (error) {
        console.error('Error importing blogs:', error);
    } finally {
        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
};

importBlogs();
