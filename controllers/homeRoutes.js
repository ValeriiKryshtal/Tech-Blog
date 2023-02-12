const router = require('express').Router();
const { Project, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
     try {
    // Get all projects and JOIN with user data
          const projectData = await Project.findAll({
               include: [{
                         model: Comment,
                         attributes: ['id', 'text', 'project_id', 'created_at'],
                         include: {
                              model: User,
                              attributes: ['name'],
                              }},
                         {
                              model: User,
                              attributes: ['name']
                         }]
          });
          // Serialize data so the template can read it
          const projects = projectData.map((project) => project.get({ plain: true }));
          // Pass serialized data and session flag into template
          res.render('homepage', { 
          projects, 
          logged_in: req.session.logged_in 
          });
     } catch (err) {
          res.status(500).json(err);
     }
});

router.get('/project/:id', (req, res) => {
     Project.findOne({
               where: {
                    id: req.params.id
               },
               attributes: [
                    'id',
                    'description',
                    'name',
                    'created_at'
               ],
               include: [{
                    model: Comment,
                    attributes: ['id', 'text', 'project_id', 'user_id', 'created_at'],
                    include: {
                         model: User,
                         attributes: ['name']
                    }},
                    {  
                         model: User,
                         attributes: ['name']
                    }
               ]
          })
          .then(dbPostData => {
               if (!dbPostData) {
                    res.status(404).json({ message: 'No post found with this id' });
                    return;
               }
               const project = dbPostData.get({ plain: true });
               // console.log(project);
               res.render('single-post', { project, logged_in: req.session.logged_in });
          })
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
     try {
          // Find the logged in user based on the session ID
          const userData = await User.findByPk(req.session.user_id, {
               attributes: { exclude: ['password'] },
               include: [{ model: Project }],
          });
          const user = userData.get({ plain: true });
          res.render('profile', {
               ...user,
               logged_in: true
          });
     } catch (err) {
          res.status(500).json(err);
     }
});

router.get('/login', (req, res) => {
     // If the user is already logged in, redirect the request to another route
     if (req.session.logged_in) {
          res.redirect('/profile');
     return;
     }
     res.render('login');
});

module.exports = router;
