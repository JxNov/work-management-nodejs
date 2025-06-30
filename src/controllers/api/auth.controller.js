const {getUserByEmail} = require('../../services/auth.service');
const {comparePassword} = require('../../utils/hash');
const {
    createAccessToken,
    createRefreshToken,
    verifyRefreshToken,
} = require('../../utils/jwt');
const {successResponse, errorResponse} = require('../../utils/response');
const redis = require('../../utils/redis');

// TTL caculated in minutes
const REFRESH_TOKEN_TTL = convertExpireToMinutes(
    process.env.JWT_REFRESH_EXPIRE || '30d'
);
const BLACKLIST_TTL = 60; // 1 hour default

function convertExpireToMinutes(expireStr) {
    const match = /^(\d+)([smhd])$/.exec(expireStr);
    if (!match) return 43200; // default: 30 days

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's':
            return Math.ceil(value / 60);
        case 'm':
            return value;
        case 'h':
            return value * 60;
        case 'd':
            return value * 60 * 24;
        default:
            return 43200;
    }
}

module.exports = {
    login: async (req, res) => {
        try {
            const {email, password} = req.body;

            if (!email || !password) {
                return errorResponse({
                    res,
                    status: 400,
                    message: 'Email và mật khẩu không được để trống',
                });
            }

            const user = await getUserByEmail(email);
            if (!user || !comparePassword(password, user.password)) {
                return errorResponse({
                    res,
                    status: 401,
                    message: 'Thông tin đăng nhập không hợp lệ',
                });
            }

            const accessToken = createAccessToken({userId: user.id});
            const refreshToken = createRefreshToken(user.id);

            await redis.connect();
            await redis.set(
                `RefreshToken:${refreshToken}`,
                refreshToken,
                REFRESH_TOKEN_TTL
            );
            await redis.close();

            return successResponse({
                res,
                message: 'Đăng nhập thành công',
                data: {accessToken, refreshToken},
            });
        } catch (error) {
            return errorResponse({
                res,
                status: 500,
                message: 'Đăng nhập thất bại',
                errors: error.message,
            });
        }
    },

    profile: async (req, res) => {
        try {
            const {user} = req;

            if (!user) {
                throw new Error('User not found');
            }

            return successResponse({
                res,
                data: {
                    name: user.username,
                    role: user.role,
                },
                message: 'Lấy thông tin người dùng thành công',
            });
        } catch (error) {
            return errorResponse({
                res,
                status: 500,
                message: 'Lấy thông tin người dùng thất bại',
                errors: error.message,
            });
        }
    },

    logout: async (req, res) => {
        try {
            const {accessToken} = req;
            await redis.connect();
            await redis.set(`Blacklist:${accessToken}`, accessToken, BLACKLIST_TTL);
            await redis.close();

            return successResponse({
                res,
                message: 'Đăng xuất thành công',
            });
        } catch (error) {
            return errorResponse({
                res,
                status: 500,
                message: 'Đăng xuất thất bại',
                errors: error.message,
            });
        }
    },

    refreshToken: async (req, res) => {
        try {
            const {refreshToken} = req.body;

            if (!refreshToken) {
                return errorResponse({
                    res,
                    status: 400,
                    message: 'Thiếu refresh token',
                });
            }

            const {userId} = verifyRefreshToken(refreshToken);

            await redis.connect();
            const inRedis = await redis.get(`RefreshToken:${refreshToken}`);
            await redis.close();

            if (!inRedis) {
                return errorResponse({
                    res,
                    status: 401,
                    message: 'Refresh token không hợp lệ hoặc đã hết hạn',
                });
            }

            // Delete refresh token from Redis and add to blacklist
            await redis.connect();
            await redis.set(`Blacklist:${refreshToken}`, refreshToken, BLACKLIST_TTL);
            await redis.delete(`RefreshToken:${refreshToken}`);
            await redis.close();

            // Create new token
            const newRefreshToken = createRefreshToken(userId);
            const newAccessToken = createAccessToken({userId});

            await redis.connect();
            await redis.set(
                `RefreshToken:${newRefreshToken}`,
                newRefreshToken,
                REFRESH_TOKEN_TTL
            );
            await redis.close();

            return successResponse({
                res,
                message: 'Làm mới token thành công',
                data: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                },
            });
        } catch (error) {
            return errorResponse({
                res,
                status: 401,
                message: 'Refresh token thất bại',
                errors: error.message,
            });
        }
    },
};
