"use client";

import React from "react";
import Image from "next/image";

export const blog_data = [
  {
    id: 1,
    title: "A Detailed Step-by-Step Guide to Manage Your Lifestyle",
    slug: "detailed-lifestyle-guide",
    description: "How to retire early",
    content: `


Content:

Retiring early might sound like a dream, but it can be a practical and achievable goal with the right planning and discipline. This guide outlines a lifestyle management approach that helps you align your daily habits with long-term financial freedom.

1. Define Your Version of “Lifestyle”

Start by asking yourself what “freedom” looks like for you. Is it traveling the world? Working part-time? Living in a quiet countryside home? Your answers will shape your goals.

2. Track Your Current Habits

Before you change anything, monitor how you currently spend your time and money. Tools like Notion or budgeting apps can help visualize waste and inefficiency.

3. Cut the Noise

Reduce non-essential spending—not by deprivation, but through conscious decision-making. Unsubscribe from things you don’t use. Cook at home more. Practice mindful consumption.

4. Build Multiple Income Streams

Don’t rely on one salary. Start a side hustle, invest in index funds, or build passive income sources. Small, consistent investments compound over time.

5. Set Clear Milestones

Break down big dreams into actionable goals. For example: Save €10,000 this year, cut dining out by 50%, or start freelancing once a week.

6. Embrace Simplicity

A simpler lifestyle—fewer material needs, intentional choices—can reduce stress and speed up your path to freedom.

7. Automate Your Future

Use automation to your advantage: savings accounts, retirement contributions, recurring investments. This removes emotion from decision-making.

8. Review Regularly

Your goals will evolve. Reassess your budget and progress every few months. Celebrate wins. Adjust setbacks.

“Living well doesn’t always mean earning more. Sometimes, it’s about needing less and choosing better.”

`,
    image: "/images/photo1.png",
    date: new Date().toISOString(),
    category: "Lifestyle",
    author: "Naki Des",
    author_img: "/images/profile1.jpeg",
    socials: {
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    id: 2,
    title: "10 Simple Habits to Improve Your Mental Health",
    slug: "mental-health-habits",
    description: "Practical strategies for everyday calm",
    content: `

🧠 “10 Simple Habits to Improve Your Mental Health”

Discover ten practical habits to boost mental wellbeing and reduce stress—real strategies that fit into everyday life.

⸻

1. Start Your Day Without Your Phone

Avoid diving into social media or emails the moment you wake up. Instead, stretch, drink water, or take 5 minutes to breathe. Set your own tone for the day.

⸻

2. Practice Gratitude

Write down three things you’re thankful for every evening. Studies show that gratitude can significantly improve mood and resilience.

⸻

3. Get Outside Daily

Nature exposure—even for 10 minutes—has been linked to lower anxiety and improved concentration. A short walk can do wonders.

⸻

4. Sleep Like It Matters (Because It Does)

Create a consistent sleep routine. Wind down with no screens before bed, keep your room cool and dark, and aim for 7–9 hours.

⸻

5. Move Your Body

You don’t need a gym membership. Stretching, dancing, or walking all release endorphins that help balance stress hormones.

⸻

6. Limit Doomscrolling

Set app limits or “focus time” on your phone. Mindless scrolling adds background stress and disrupts sleep patterns.

⸻

7. Talk It Out

Whether with a friend, journal, or therapist, expressing how you feel reduces internal pressure and helps you process emotions.

⸻

8. Create Tech-Free Zones

Designate parts of your day or home where phones and screens are off-limits—like the dinner table or your bedroom.

⸻

9. Practice Mindfulness (Without the Woo-Woo)

Mindfulness just means paying attention. Try 5 minutes of focused breathing or simply eating a meal without distractions.

⸻

10. Say “No” Without Guilt

Overcommitting is a fast track to burnout. Respect your limits. Boundaries are a form of self-respect—not selfishness.

⸻

“Mental health is not a destination, but a daily practice. Small actions, repeated often, create lasting change.”`,

    image: "/images/photo2.png",
    date: new Date().toISOString(),
    category: "Health",
    author: "Amara Ndebele",
    author_img: "/images/profile2.jpeg",
    socials: {
      twitter: "#",
      linkedin: "#",
    },
  },
  // ... add the other 13 blogs using the same format, each with slug, content, etc.
];

const BlogPage = () => {
  const blogData = blog_data[0]; // Replace with dynamic selection logic in a real app

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <Image
          src={blogData.image}
          alt={blogData.title}
          width={800}
          height={256}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />

        <h1 className="text-4xl font-bold text-gray-800 mb-4">{blogData.title}</h1>

        <div className="flex items-center justify-between text-gray-600 mb-8">
          <div className="flex items-center gap-2">
            <Image
              src={blogData.author_img}
              alt={blogData.author}
              width={40}
              height={40}
              className="rounded-full"
            />
            <p className="text-lg font-medium">By {blogData.author}</p>
          </div>
          <p className="text-sm">{new Date(blogData.date).toDateString()}</p>
        </div>

        <div className="text-gray-700 leading-relaxed space-y-4">
          <p>{blogData.content}</p>
        </div>

        <div className="mt-12 border-t pt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect with the Author</h2>
          <div className="flex space-x-4">
            <a
              href={blogData.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Twitter
            </a>
            <a
              href={blogData.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;