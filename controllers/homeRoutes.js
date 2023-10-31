const router = require('express').Router();
const { Users, Posts, Comments } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
      const postsData = await Posts.findAll({
        include: [Users],
      });
      const posts = postsData.map((post) => posts.get({ plain: true }));

      res.render('homepage', {posts});
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

  router.get('/post/:id', async (req, res) => {
    try {
      const postsData = await Posts.findByPk(req.params.id, {
        include: [
            Users, 
            {
                model: Comments,
                inlcude: [Users]
            }
        ],
      });
  
      const posts = postsData.get({ plain: true });
  
      res.render('singlePost', {
        posts,
   
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/dashboard', withAuth, async (req, res) => {
    try {
      const usersData = await Users.findByPk(req.session.users_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Posts }],
      });
  
      const user = usersData.get({ plain: true });
  
      res.render('dashboard', {
        user,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/dashboard');
      return;
    }
  
    res.render('login');
  });

  // add new post
  router.get('/new', (req, res) => {
    res.render('new-post');
  })


  //edit my own current post
  router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postsData = await Posts.findByPk(req.params.id);
        const posts = postsData.get({plain: true})
        res.render('edit-post', {posts})
    } catch (err) {
        res.redirect('login');
    }
  });
  
  module.exports = router;
  