const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

// Admin-only middleware
exports.adminAuth = async (req, res, next) => {
    try {
        // Check if user is authenticated (protect middleware should run first)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required.'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Server error in admin authorization'
        });
    }
};

// Log admin actions
exports.logAdminAction = (action, resource) => {
    return async (req, res, next) => {
        try {
            const originalSend = res.send;
            const originalJson = res.json;

            // Capture response data
            let responseData;

            res.send = function (data) {
                responseData = data;
                originalSend.call(this, data);
            };

            res.json = function (data) {
                responseData = data;
                originalJson.call(this, data);
            };

            // Wait for response to complete
            res.on('finish', async () => {
                try {
                    // Only log successful actions (2xx status codes)
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        const logData = {
                            adminId: req.user._id,
                            adminEmail: req.user.email || 'N/A',
                            action,
                            resource,
                            resourceId: req.params.id || null,
                            details: {
                                method: req.method,
                                path: req.path,
                                body: req.body,
                                query: req.query,
                                params: req.params
                            },
                            ipAddress: req.ip || req.connection.remoteAddress,
                            userAgent: req.get('user-agent')
                        };

                        // Log to MongoDB (existing)
                        await AuditLog.create(logData);

                        // Log to File via Winston (for Logstash)
                        logger.info('Admin Action', { ...logData, type: 'audit_log' });
                    }
                } catch (error) {
                    console.error('Error logging admin action:', error);
                    logger.error('Error logging admin action', { error: error.message });
                }
            });

            next();
        } catch (error) {
            console.error('Error in logAdminAction middleware:', error);
            logger.error('Error in logAdminAction middleware', { error: error.message });
            next();
        }
    };
};
