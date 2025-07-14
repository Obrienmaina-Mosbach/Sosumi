// app/api/blogs/[slug]/likes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '../../../../../Lib/config/db';
import { BlogPost, Like, User } from '../../../../../Lib/models/blogmodel';

// --- Authentication Middleware Helper ---
async function authenticateRequest(_request: NextRequest) {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');

    if (!tokenCookie || !tokenCookie.value) {
        return { authenticated: false, status: 401, message: 'Authorization token required.' };
    }

    try {
        const decoded: any = jwt.verify(tokenCookie.value, process.env.JWT_SECRET || 'supersecretjwtkey');
        const user = await User.findById(decoded.id).select('-passwordHash -tokens -accessToken');
        if (!user) {
            return { authenticated: false, status: 404, message: 'Authenticated user not found.' };
        }
        return { authenticated: true, user };
    } catch (error) {
        console.error('Authentication error in /api/blogs/[slug]/likes:', error);
        return { authenticated: false, status: 403, message: 'Invalid or expired token.' };
    }
}

// --- POST Request Handler (Toggle Like) ---
export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
    await connectDB();
    // Extract slug from the URL
    const { slug } = params;

    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
        return NextResponse.json({ success: false, msg: authResult.message }, { status: authResult.status });
    }
    const requestingUser = authResult.user;

    try {
        const blogPost = await BlogPost.findOne({ slug });
        if (!blogPost) {
            return NextResponse.json({ success: false, msg: 'Blog post not found.' }, { status: 404 });
        }

        const existingLike = await Like.findOne({
            userId: requestingUser._id,
            postId: blogPost._id,
        });

        let newLikesCount = blogPost.likesCount;
        let userLiked = false;
        let message = '';

        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            newLikesCount = Math.max(0, blogPost.likesCount - 1);
            userLiked = false;
            message = 'Blog unliked successfully!';
        } else {
            await Like.create({
                userId: requestingUser._id,
                postId: blogPost._id,
            });
            newLikesCount = blogPost.likesCount + 1;
            userLiked = true;
            message = 'Blog liked successfully!';
        }

        blogPost.likesCount = newLikesCount;
        await blogPost.save();

        return NextResponse.json(
            { success: true, msg: message, likesCount: newLikesCount, userLiked },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error toggling like:', error);
        return NextResponse.json({ success: false, msg: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    await connectDB();

    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
        return NextResponse.json({ success: true, userLiked: false, msg: 'Not authenticated, assuming not liked.' }, { status: 200 });
    }
    const requestingUser = authResult.user;

    const { slug } = params;

    try {
        const blogPost = await BlogPost.findOne({ slug });
        if (!blogPost) {
            return NextResponse.json({ success: false, msg: 'Blog post not found.' }, { status: 404 });
        }

        const userLiked = await Like.exists({
            userId: requestingUser._id,
            postId: blogPost._id,
        });

        return NextResponse.json({ success: true, userLiked: !!userLiked }, { status: 200 });
    } catch (error: any) {
        console.error('Error checking like status:', error);
        return NextResponse.json({ success: false, msg: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}