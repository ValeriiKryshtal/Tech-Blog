const router = require('express').Router();
const sequelize = require('../config/connection');
const { Project, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!======================');
     Project.findAll({
          where: {
               // use the ID from the session
               user_id: req.session.user_id
          },
          attributes: [
               'id',
               'name',
               'created_at',
               'description'
               ],
          include: [
          {
               model: Comment,
               attributes: ['id', 'text', 'project_id', 'user_id', 'created_at'],
               include: {
               model: User,
               attributes: ['name']
          }
          },
          {
               model: User,
               attributes: ['name']
          }
          ]
     })
     .then(dbPostData => {
        // serialize data before passing to template
          const projects = dbPostData.map(project => project.get({ plain: true }));
          res.render('profile', { projects, logged_in: true });
     })
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
          });
     });

router.get('/edit/:id', withAuth, (req, res) => {
     Project.findOne({
          where: {
               id: req.params.id
          },
          attributes: [
               'id',
               'description',
               'created_at',
               'name'
               ],
          include: [{
               model: Comment,
               attributes: ['id', 'text', 'project_id', 'user_id', 'created_at'],
               include: {
                    model: User,
                    attributes: ['name']
               }
          },
          {
               model: User,
               attributes: ['name']
          }]})
     .then(dbPostData => {
          if (!dbPostData) {
               res.status(404).json({ message: 'No post found with this id' });
          return;
          }
        // serialize the data
          const project = dbPostData.get({ plain: true });

          res.render('edit-post', {
               project,
               logged_in: true
          })})
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
     });
});

router.get('/create/', withAuth, (req, res) => {
    Post.findAll({
      where: {
        // use the ID from the session
        user_id: req.session.user_id
      },
      attributes: [
        'id',
        'title',
        'created_at',
        'post_content'
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username', 'twitter', 'github']
          }
        },
        {
          model: User,
          attributes: ['username', 'twitter', 'github']
        }
      ]
    })
      .then(dbPostData => {
        // serialize data before passing to template
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('create-post', { posts, loggedIn: true });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });


module.exports = router;