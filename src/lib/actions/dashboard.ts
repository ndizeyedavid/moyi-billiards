import { prisma } from '@/lib/prisma';

export async function getDashboardStats() {
  try {
    const [
      totalProducts,
      totalBlogPosts,
      totalContacts,
      totalTeamMembers,
      publishedPosts,
      activePosts,
      newContacts,
      repliedContacts
    ] = await Promise.all([
      prisma.product.count(),
      prisma.blogPost.count(),
      prisma.contact.count(),
      prisma.teamMember.count(),
      prisma.blogPost.count({ where: { status: 'Published' } }),
      prisma.product.count({ where: { status: 'Active' } }),
      prisma.contact.count({ where: { status: 'New' } }),
      prisma.contact.count({ where: { status: 'Replied' } })
    ]);

    return {
      totalProducts,
      totalBlogPosts,
      totalContacts,
      totalTeamMembers,
      publishedPosts,
      activePosts,
      newContacts,
      repliedContacts
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
}

export async function getRecentProducts(limit: number = 5) {
  try {
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        price: true,
        status: true,
        images: true,
        createdAt: true,
        slug: true
      }
    });

    return products;
  } catch (error) {
    console.error('Error fetching recent products:', error);
    throw new Error('Failed to fetch recent products');
  }
}

export async function getRecentBlogPosts() {
  try {
    const blogPosts = await prisma.blogPost.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
        author: true
      }
    });

    return blogPosts;
  } catch (error) {
    console.error('Error fetching recent blog posts:', error);
    throw new Error('Failed to fetch recent blog posts');
  }
}

export async function getAllBlogPosts() {
  try {
    const blogPosts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        featuredImage: true,
        author: true,
        status: true,
        category: true,
        tags: true,
        featured: true,
        readTime: true,
        wordCount: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return blogPosts;
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
}

export async function getBlogPostStats() {
  try {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      scheduledPosts,
      avgReadTime,
      totalWords
    ] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: 'Published' } }),
      prisma.blogPost.count({ where: { status: 'Draft' } }),
      prisma.blogPost.count({ where: { status: 'Scheduled' } }),
      prisma.blogPost.aggregate({
        _avg: { readTime: true }
      }),
      prisma.blogPost.aggregate({
        _sum: { wordCount: true }
      })
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      scheduledPosts,
      avgReadTime: Math.round(avgReadTime._avg.readTime || 0),
      totalWords: totalWords._sum.wordCount || 0
    };
  } catch (error) {
    console.error('Error fetching blog post stats:', error);
    throw new Error('Failed to fetch blog post statistics');
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({
      where: { id }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw new Error('Failed to delete blog post');
  }
}

export async function getRecentContacts(limit: number = 5) {
  try {
    const contacts = await prisma.contact.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        status: true,
        createdAt: true
      }
    });

    return contacts;
  } catch (error) {
    console.error('Error fetching recent contacts:', error);
    throw new Error('Failed to fetch recent contacts');
  }
}

export async function getRecentTeamMembers(limit: number = 5) {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        department: true,
        status: true,
        avatar: true,
        createdAt: true
      }
    });

    return teamMembers;
  } catch (error) {
    console.error('Error fetching recent team members:', error);
    throw new Error('Failed to fetch recent team members');
  }
}
