const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Track smart filter usage
router.post('/track', async (req, res) => {
  try {
    const { userId, feature, action, context } = req.body;
    
    if (!userId || !feature || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if this is a logged-in user (UUID format) or anonymous user
    const isLoggedInUser = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);

    const usage = await prisma.smartFilterUsage.create({
      data: {
        userId,
        feature,
        action,
        context: context || null,
        // Only set user relation if it's a logged-in user
        ...(isLoggedInUser ? { user: { connect: { id: userId } } } : {})
      }
    });

    res.json({ success: true, usage });
  } catch (error) {
    console.error('Error tracking smart filter usage:', error);
    res.status(500).json({ error: 'Failed to track usage' });
  }
});

// Get usage analytics (for admin/insights)
router.get('/analytics', async (req, res) => {
  try {
    const { days = 30, limit = 20 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Most used features
    const topFeatures = await prisma.smartFilterUsage.groupBy({
      by: ['feature'],
      where: {
        createdAt: {
          gte: startDate
        },
        action: 'added'
      },
      _count: {
        feature: true
      },
      orderBy: {
        _count: {
          feature: 'desc'
        }
      },
      take: parseInt(limit)
    });

    // Anonymous vs logged-in user stats
    const userTypeStats = await prisma.smartFilterUsage.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        userId: true
      }
    });

    const anonymousUsers = userTypeStats.filter(stat => 
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(stat.userId)
    ).length;
    const loggedInUsers = userTypeStats.length - anonymousUsers;

    // Usage by action type
    const actionStats = await prisma.smartFilterUsage.groupBy({
      by: ['action'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        action: true
      }
    });

    // Recent searches (for feature discovery)
    const recentSearches = await prisma.smartFilterUsage.findMany({
      where: {
        action: 'searched',
        createdAt: {
          gte: startDate
        }
      },
      select: {
        feature: true,
        context: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    });

    res.json({
      topFeatures,
      actionStats,
      recentSearches,
      userStats: {
        anonymousUsers,
        loggedInUsers,
        totalUsers: userTypeStats.length
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get user's personal usage history
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    // Check if this is a logged-in user (UUID format) or anonymous user
    const isLoggedInUser = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);

    const userUsage = await prisma.smartFilterUsage.findMany({
      where: {
        userId
      },
      include: {
        // Only include user data for logged-in users
        ...(isLoggedInUser ? { user: true } : {})
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit)
    });

    res.json({ 
      usage: userUsage,
      isAnonymous: !isLoggedInUser
    });
  } catch (error) {
    console.error('Error fetching user usage:', error);
    res.status(500).json({ error: 'Failed to fetch user usage' });
  }
});

module.exports = router; 