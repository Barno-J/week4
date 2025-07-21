const express = require('express');
const { getPosts } = require('../controllers/postsController');

const router = express.Router();

// Import Post model
router.get('/', getPosts);

module.exports = router;