var express = require('express');
var router = express.Router();
var request = require('sync-request');

const messagesModel = require('../models/messages');
const coursesModel = require('../models/courses');

const content = [
  {
    title: "Les bases du développement web",
    content: "Il faut commencer par HTML, CSS et JavaScript"
  },
  {
    title: "Initiation au backend",
    content: "Ensuite, prendre en main les mécaniques propres au serveur avec Express, Node, API et MongoDB"
  },
  {
    title: "Responsive frontend et framework JS",
    content: "Enfin, se former sur les techniques avancées de  développement côté client via Bootstrap, React et React Native"
  }
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '1er projet Express' });
});

// requêtes pour la collection Messages
router.post('/insert-db', async (req, res) => {

  var newMessage = new messagesModel({
    subject: req.body.subject,
    content: req.body.content,
    like: req.body.like,
    year: req.body.year,
    language: req.body.language,
  })

  var messageSaved = await newMessage.save();

  messageSaved ? res.json({result: true, messageSaved}) : res.json({result: false, message: "message non sauvegardé en BDD"})
});

router.get('/all-messages', async (req, res) => {
  let messages = await messagesModel.find();
  res.json(messages)
});

router.get('/search', async (req, res) => {

  var results = await messagesModel.find({$text: {$search: req.query.search}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}});

  results.length !== 0 ? res.json({result: true, results}) : res.json({result: false, message: "Aucun résultat trouvé"})
});

// requêtes collection Courses
router.post('/add-course', async (req, res) => {
  let newCourse = new coursesModel({
    course: content
  });

  let newCourseSaved = await newCourse.save();

  newCourseSaved ? res.json(newCourseSaved) : res.json({result: "erreur lors de la sauvegarde en BDD"})
});

router.get('/search-course', async (req, res) => {

  // var results = await coursesModel.find({$text: {$search: req.query.search}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}});

  // var results = await coursesModel.aggregate(
    // [{$search: {
    //   text: {
    //     path: ['course.content', 'course.title'],
    //     query: req.query.search
    //   },
  //     highlight: {
  //       path: ['course.content', 'course.title']
  //     }
  //   }}, {$project: {
  //     course: 1,
  //     score: {$meta: "searchScore"},
  //     highlights: {
  //       $meta: 'searchHighlights'
  //     }
  //   }}]
  // ).exec();

  var results = await coursesModel.find(
    {
      course: {
        $elemMatch: {
          $or: [
            {title: req.query.search},
            {content: req.query.search},
          ]
        }
      }
    }
  );

  console.log(results);

  results.length !== 0 ? res.json({result: true, results}) : res.json({result: false, message: "Aucun résultat trouvé"})
});

router.get('/all-courses', async (req, res) => {
  let messages = await coursesModel.find();
  res.json(messages)
});

module.exports = router;