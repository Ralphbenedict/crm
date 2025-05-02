const { User, Role } = require('../models');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { Op } = require('sequelize');

const AuthController = {
  // Show login form
  getLoginForm: (req, res) => {
    res.render('auth/login', { title: 'Login' });
  },

  // Process login form
  login: async (req, res) => {
    const { email, password, rememberMe } = req.body;

    try {
      // Find user by email or username
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username: email }]
        }
      });

      if (!user || !(await user.isValidPassword(password))) {
        req.flash('error', 'Invalid email/username or password');
        return res.redirect('/auth/login');
      }

      if (!user.isActive) {
        req.flash('error', 'Your account is inactive. Please contact an administrator.');
        return res.redirect('/auth/login');
      }

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Save refresh token to database
      user.refreshToken = refreshToken;
      user.lastLogin = new Date();
      await user.save();

      // Set cookies
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      };

      if (rememberMe) {
        cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      }

      res.cookie('access_token', accessToken, cookieOptions);
      res.cookie('refresh_token', refreshToken, cookieOptions);

      req.flash('success', 'Successfully logged in');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      req.flash('error', 'An error occurred during login');
      res.redirect('/auth/login');
    }
  },

  // Show registration form
  getRegisterForm: (req, res) => {
    res.render('auth/register', { title: 'Register' });
  },

  // Process registration form
  register: async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
      // Check if passwords match
      if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/auth/register');
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }]
        }
      });

      if (existingUser) {
        req.flash('error', 'User with this email or username already exists');
        return res.redirect('/auth/register');
      }

      // Create new user
      const user = await User.create({
        username,
        email,
        password
      });

      // Assign default role (user role)
      const userRole = await Role.findOne({ where: { name: 'user' } });
      if (userRole) {
        await user.addRole(userRole);
      }

      req.flash('success', 'Registration successful! Please log in.');
      res.redirect('/auth/login');
    } catch (error) {
      console.error('Registration error:', error);
      req.flash('error', 'An error occurred during registration');
      res.redirect('/auth/register');
    }
  },

  // Process logout
  logout: async (req, res) => {
    try {
      // Clear refresh token in database if user is logged in
      if (req.user) {
        req.user.refreshToken = null;
        await req.user.save();
      }

      // Clear cookies
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');

      req.flash('success', 'Successfully logged out');
      res.redirect('/');
    } catch (error) {
      console.error('Logout error:', error);
      req.flash('error', 'An error occurred during logout');
      res.redirect('/');
    }
  }
};

module.exports = AuthController;
