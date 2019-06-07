var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
let passwords = {
  'hmi': '0000',
  'mod': '0000'
}
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');

});

router.get('/template', (req,res) => {
  res.render('template');
});

router.post('/', function(req, res) {
  if (req.body.pass == passwords[req.body.cluster]) {
    if (req.body.site == 'home') {

      var MongoClient = mongodb.MongoClient;
      var url = 'mongodb://127.0.0.1:27017/quiz';
      MongoClient.connect(url, function(err, client) {
        if (err) {
          console.log('Unable to connect to the Server', err);
        } else {
          var db = client.db("quiz");
          console.log('Connection established to', url);
          var quizzes;
          var ankety;
          db.collection(req.body.cluster + '_quizzes').find().toArray().
          then(function(data) {
            quizzes = data;
            db.collection(req.body.cluster + '_ankety').find().toArray().
            then(function(data2) {
              ankety = data2;
              res.render('home', {
                "quizzes": quizzes,
                "ankety": ankety,
                "cluster": req.body.cluster
              });
            });
          });
        }
      });
    } else if (req.body.site == 'settings') {

      var MongoClient = mongodb.MongoClient;
      var url = 'mongodb://127.0.0.1:27017/quiz';
      MongoClient.connect(url, function(err, client) {
        if (err) {
          console.log('Unable to connect to the Server', err);
        } else {
          var db = client.db("quiz");
          console.log('Connection established to', url);
          var quizzes;
          var ankety;
          db.collection(req.body.cluster + '_quizzes').find().toArray().
          then(function(data) {
            quizzes = data;
            db.collection(req.body.cluster + '_ankety').find().toArray().
            then(function(data2) {
              ankety = data2;
              res.render('settings', {
                "quizzes": quizzes,
                "ankety": ankety
              });
            });
          });
        }
      });

    } else if (req.body.site == 'createanketa') {
      res.render('createanketa');
    } else if (req.body.site == 'createquiz') {
      res.render('createquiz');
    } else if (req.body.site == 'results') {

      let target = req.body.params;
      var MongoClient = mongodb.MongoClient;
      var url = 'mongodb://127.0.0.1:27017/quiz';
      MongoClient.connect(url, function(err, client) {
        if (err) {
          console.log('Unable to connect to the Server', err);
        } else {
          var db = client.db("quiz");
          var collection = db.collection(req.body.cluster + '_anketa_results');
          collection.find({
            'name': target
          }).toArray(function(err, result) {
            if (err) {
              console.log(err);
            } else {
              res.render('results', {
                result: result,
                name: target
              });
            }
          });
        }
      });

    } else if (req.body.site == 'editanketa') {
      let target = req.body.params;
      var MongoClient = mongodb.MongoClient;
      var url = 'mongodb://127.0.0.1:27017/quiz';
      MongoClient.connect(url, function(err, client) {
        if (err) {
          console.log('Unable to connect to the Server', err);
        } else {
          var db = client.db("quiz");
          var collection = db.collection(req.body.cluster + '_ankety');
          collection.find({
            'name': target
          }).toArray(function(err, result) {
            if (err) {
              console.log(err);
            } else {
              res.render('editanketa', {
                'anketa': result
              });
            }
          });
        }
      });
    } else if (req.body.site == 'editquiz') {
      let target = req.body.params;
      var MongoClient = mongodb.MongoClient;
      var url = 'mongodb://127.0.0.1:27017/quiz';
      MongoClient.connect(url, function(err, client) {
        if (err) {
          console.log('Unable to connect to the Server', err);
        } else {
          var db = client.db("quiz");
          var collection = db.collection(req.body.cluster + '_quizzes');
          collection.find({
            'name': target
          }).toArray(function(err, result) {
            if (err) {
              console.log(err);
            } else {
              res.render('editquiz', {
                'quiz': result
              });
            }
          });
        }
      });
    }

  } else {
    res.send('Incorrect password');
  }

});
router.get('/edit_anketa/:quiz', function(req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      var db = client.db("quiz");
      var collection = db.collection('ankety');
      collection.find({
        'name': req.params.quiz
      }).toArray(function(err, result) {
        if (err) {
          res.send(err);
        } else if (result.length) {
          res.render('edit', {
            "title": req.params.quiz,
            "anketa": result
          });
          console.log(result);
        } else {
          res.send('No documents found');
        }
      });

    }
  });
});
router.post('/edit_anketa', function(req, res) {
  let imgJson = JSON.parse(req.body.imgJson);

  let fs = require('fs');
  const tmpDirName = 'tmptmptmp'
  const ppath = require('path');
  const rootDir = ppath.join(__dirname, '..');
  fs.renameSync(rootDir + '/public/data/' + req.body.originalName, rootDir + '/public/data/' + tmpDirName);
  // let originalImgs = fs.readdirSync(rootDir+'/public/data/'+tmpDirName);
  // console.log(originalImgs);
  //
  // var dir = './public/data/' + req.body.name;
  // fs.mkdirSync(dir);

  // let re = new RegExp(req.body.originalName+'1.');
  // for (var i = 0; i < originalImgs.length; i++) {
  //     if(re.exec(originalImgs[i]) != null){
  //       console.log(originalImgs[i]);
  //       var filename = originalImgs[i];
  //       filename = filename.replace(filename.split('.').slice(0, -1).join('.'), req.body.name+1);
  //       fs.copyFileSync(rootDir+'/public/data/'+tmpDirName+'/'+originalImgs[i], rootDir+'/public/data/'+req.body.name+'/'+filename);
  //       break;
  //     }
  // }



  let date = new Date();
  let time = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

  //create object
  var anketa = {
    name: req.body.name,
    img: null,
    count: req.body.count,
    desc: req.body.desc,
    date: time,
    questions: []
  };
  for (var i = 0; i < anketa.count; i++) {
    var o = {};
    o.q = req.body['question' + i];
    o.img = null;
    anketa.questions.push(o);
  }
  var root = require('app-root-path');
  var path = root.path;
  // var fs = require('fs');
  var dir = './public/data/' + anketa.name;
  fs.mkdirSync(dir);
  // if (!fs.existsSync(dir)){
  //     fs.mkdirSync(dir);
  // }
  var Jimp = require('jimp');

  if (req.files) {
    if (req.files['img']) {
      var file = req.files['img'];
      var filename = file.name;
      filename = filename.replace(filename.split('.').slice(0, -1).join('.'), anketa.name);
      anketa.img = "data/" + anketa.name + "/" + filename;
      file.mv(path + "\\public/data/" + anketa.name + "\\" + filename, function(err) {
        if (err) {
          console.log(err);;
        } else {

        }
      });
    }

  } else {
    let originalImgs = fs.readdirSync(rootDir + '/public/data/' + tmpDirName);
    // var dir = './public/data/' + req.body.name;
    // fs.mkdirSync(dir);
    let re = new RegExp(req.body.originalName + '.');
    let foundImg = null;
    for (var i = 0; i < originalImgs.length; i++) {
      if (re.exec(originalImgs[i]) != null) {
        foundImg = originalImgs[i];
        break;
      }
    }
    if (foundImg != null) {
      var filename = foundImg;
      filename = filename.replace(filename.split('.').slice(0, -1).join('.'), anketa.name);
      anketa.img = "data/" + anketa.name + "/" + filename;
      fs.copyFileSync(rootDir + '/public/data/' + tmpDirName + '/' + foundImg, rootDir + '/public/data/' + anketa.name + '/' + filename);
    } else {
      anketa.img = 'data/default.png';
    }
    // if (imgJson[99]) {
    //   let oldSrc = imgJson[99];
    //   console.log(oldSrc);
    //   var filename = oldSrc;
    //   filename = filename.replace(filename.split('.').slice(0, -1).join('.'), anketa.name);
    //   console.log(filename);
    //   anketa.img = "data/" + anketa.name + "/" + filename;
    //   oldSrc = oldSrc.replace(req.body.originalName, tmpDirName);
    //   console.log(oldSrc);
    //   fs.copyFileSync(rootDir+'/public/'+oldSrc, rootDir+'/public/data/'+anketa.name+'/'+filename);
    // }else{
    //   anketa.img = 'data/default.png';
    // }
  }


  for (var i = 0; i < anketa.count; i++) {
    if (req.files) {
      if (req.files['img' + i]) {
        var file = req.files['img' + i];
        var filename = file.name;
        filename = filename.replace(filename.split('.').slice(0, -1).join('.'), anketa.name + i);
        anketa.questions[i].img = "data/" + anketa.name + "/" + filename;
        file.mv(path + "\\public/data/" + anketa.name + "\\" + filename, function(err) {
          if (err) {
            throw err;
          } else {
            // Jimp.read('public/data/' + quiz.name + '/' + filename)
            //   .then(function(file) {
            //     file
            //       .cover(400, 400)
            //       .write('public/data/' + quiz.name + '/' + filename);
            //   })
            //   .catch(function(err) {
            //     console.log(err);
            //   });

          }

        });
      }
    } else {

      if (imgJson[i]) {
        let oldSrc = imgJson[i];
        var filename = oldSrc;
        filename = filename.replace(filename.split('.').slice(0, -1).join('.'), anketa.name + i);
        anketa.questions[i].img = "data/" + anketa.name + "/" + filename;
        oldSrc = oldSrc.replace(req.body.originalName, tmpDirName);
        fs.copyFileSync(rootDir + '/public/' + oldSrc, rootDir + '/public/data/' + anketa.name + '/' + filename);
      } else {
        anketa.questions[i].img = 'data/default.png';
      }
    }
  }


  // delete tmp folder
  var target = req.body.originalName;
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      var db = client.db("quiz");
      db.collection(req.body.cluster + '_ankety').deleteOne({
        'name': target
      });
    }
  });
  var rimraf = require('rimraf');
  rimraf('public/data/' + tmpDirName, function() {
    // console.log('folder ' + target + ' deleted');
    // res.status(200).send('Success');
  });


  //size files
  // var fs = require('fs');
  fs.readdir('public/data/' + anketa.name, function(err, files) {
    if (err) {
      console.log(err);
    } else {
      files.forEach(function(file) {
        var path = 'public/data/' + anketa.name + '/' + file;
        console.log('path = ' + path);
        Jimp.read(path)
          .then(function(file) {
            file
              .cover(400, 400)
              .write(path);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    }

  });
  //adding object to db
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      res.send(err);
    } else {
      console.log('Connection established to', url);
      var db = client.db("quiz");
      var collection = db.collection(req.body.cluster + '_ankety');
      console.log(req.body.cluster + '_ankety');
      collection.insert([anketa], function(err, result) {
        if (err) {
          console.log(err);
        } else {

          // Redirect to the updated student list
          res.status(200).send('Success');
          // var MongoClient = mongodb.MongoClient;
          // var url = 'mongodb://127.0.0.1:27017/quiz';
          // MongoClient.connect(url, function(err, client) {
          //   if (err) {
          //     console.log('Unable to connect to the Server', err);
          //   } else {
          //     var db = client.db("quiz");
          //     console.log('Connection established to', url);
          //     var quizzes;
          //     var ankety;
          //     db.collection(req.body.cluster + '_quizzes').find().toArray().
          //     then(function(data) {
          //       quizzes = data;
          //       db.collection(req.body.cluster + '_ankety').find().toArray().
          //       then(function(data2) {
          //         ankety = data2;
          //         res.render('settings', {
          //           "quizzes": quizzes,
          //           "ankety": ankety
          //         });
          //       });
          //     });
          //   }
          // });

        }

        // Close the database
        client.close();
      });
    }
  });

});
router.post('/edit_quiz', function(req, res) {
  console.log('editing quiz');
  console.log(req.body.originalName);
  let imgJson = JSON.parse(req.body.imgJson);
  console.log('parse succes');
  let fs = require('fs');
  const tmpDirName = 'tmptmptmptmp';
  const ppath = require('path');
  const rootDir = ppath.join(__dirname, '..');
  fs.renameSync(rootDir + '/public/data/' + req.body.originalName, rootDir + '/public/data/' + tmpDirName);


  let date = new Date();
  let time = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

  //create object
  var quiz = {
    name: req.body.name,
    img: null,
    desc: req.body.desc,
    count: req.body.count,
    date: time,
    questions: []
  };
  for (var i = 0; i < quiz.count; i++) {
    var o = {};
    o.question = req.body['question' + i];
    o.img = null;
    o.answers = [];
    o.correct_answers = [];
    for (var j = 0; j < req.body['answers-count' + i]; j++) {
      o.answers.push(req.body['a' + i + j]);
      if (req.body['ra' + i + j]) {
        o.correct_answers.push(j);
      }
    }
    quiz.questions.push(o);

  }

  var root = require('app-root-path');
  var path = root.path;
  var dir = './public/data/' + quiz.name;
  fs.mkdirSync(dir);
  // if (!fs.existsSync(dir)){
  //     fs.mkdirSync(dir);
  // }
  var Jimp = require('jimp');
  if (req.files) {
    if(req.files['img']){
      var file = req.files['img'];
      var filename = file.name;
      filename = filename.replace(filename.split('.').slice(0, -1).join('.'), quiz.name);
      console.log('filename = ' + filename);
      quiz.img = "data/" + quiz.name + "/" + filename;
      file.mv(path + "\\public/data/" + quiz.name + "\\" + filename, function(err) {
        if (err) {
          console.log(err);;
        } else {
          // Jimp.read('public/' + quiz.img, (err, file) => {
          //   if (err) throw err;
          //   file
          //     .cover(400, 400)
          //     .write(quiz.img);
          // });
        }
      });
    }

  } else {
    let originalImgs = fs.readdirSync(rootDir + '/public/data/' + tmpDirName);
    // var dir = './public/data/' + req.body.name;
    // fs.mkdirSync(dir);
    let re = new RegExp(req.body.originalName + '.');
    let foundImg = null;
    for (var i = 0; i < originalImgs.length; i++) {
      if (re.exec(originalImgs[i]) != null) {
        foundImg = originalImgs[i];
        break;
      }
    }
    if (foundImg != null) {
      var filename = foundImg;
      filename = filename.replace(filename.split('.').slice(0, -1).join('.'), quiz.name);
      quiz.img = "data/" + quiz.name + "/" + filename;
      fs.copyFileSync(rootDir + '/public/data/' + tmpDirName + '/' + foundImg, rootDir + '/public/data/' + quiz.name + '/' + filename);
    } else {
      quiz.img = 'data/default.png';
    }
  }

  for (var i = 0; i < quiz.count; i++) {
    if (req.files) {
      if(req.files['img' + i]){

        var file = req.files['img' + i];
        var filename = file.name;
        filename = filename.replace(filename.split('.').slice(0, -1).join('.'), quiz.name + i);
        quiz.questions[i].img = "data/" + quiz.name + "/" + filename;
        file.mv(path + "\\public/data/" + quiz.name + "\\" + filename, function(err) {
          if (err) {
            throw err;
          } else {
            // Jimp.read('public/data/' + quiz.name + '/' + filename)
            //   .then(function(file) {
            //     file
            //       .cover(400, 400)
            //       .write('public/data/' + quiz.name + '/' + filename);
            //   })
            //   .catch(function(err) {
            //     console.log(err);
            //   });

          }

        });
      }

    } else {
      if (imgJson[i]) {
        let oldSrc = imgJson[i];
        var filename = oldSrc;
        filename = filename.replace(filename.split('.').slice(0, -1).join('.'), quiz.name + i);
        quiz.questions[i].img = "data/" + quiz.name + "/" + filename;
        oldSrc = oldSrc.replace(req.body.originalName, tmpDirName);
        fs.copyFileSync(rootDir + '/public/' + oldSrc, rootDir + '/public/data/' + quiz.name + '/' + filename);
      } else {
        quiz.questions[i].img = 'data/default.png';
      }
    }
  }
  console.log(quiz);
  //delete original dir
  var target = req.body.originalName;
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      var db = client.db("quiz");
      db.collection(req.body.cluster + '_quizzes').deleteOne({
        'name': target
      });
    }
  });
  var rimraf = require('rimraf');
  rimraf('public/data/' + tmpDirName, function() {
    // console.log('folder ' + target + ' deleted');
    // res.status(200).send('Success');
  });
  //
  //size files
  fs.readdir('public/data/' + quiz.name, function(err, files) {
    if (err) {
      console.log(err);
    } else {
      files.forEach(function(file) {
        var path = 'public/data/' + quiz.name + '/' + file;
        console.log('path = ' + path);
        Jimp.read(path)
          .then(function(file) {
            file
              .cover(400, 400)
              .write(path);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    }

  });
  //adding object to db
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      res.send(err);
    } else {
      console.log('Connection established to', url);
      var db = client.db("quiz");
      var collection = db.collection(req.body.cluster + '_quizzes');



      collection.insert([quiz], function(err, result) {
        if (err) {
          console.log(err);
        } else {

          // Redirect to the updated student list
          res.redirect("/settings");
        }

        // Close the database
        client.close();
      });
    }
  });
});
router.get('/settings', function(req, res) {
  // res.render('index', {
  //   title: 'Express'
  // });

  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;

  // Define where the MongoDB server is
  var url = 'mongodb://127.0.0.1:27017/quiz';

  // Connect to the server
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      var db = client.db("quiz");
      // We are connected
      console.log('Connection established to', url);


      var quizzes;
      var ankety;
      db.collection('hmi_quizzes').find().toArray().
      then(function(data) {
        quizzes = data;
        db.collection('hmi_ankety').find().toArray().
        then(function(data2) {
          ankety = data2;
          console.log(quizzes.length);
          console.log(ankety.length);
          res.render('settings', {

            // Pass the returned database documents to Jade
            "quizzes": quizzes,
            "ankety": ankety
          });
        });
      });

      // Find all students

    }
  });
});
router.get('/results/:anketa', function(req, res) {
  let target = req.params.anketa;
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      var db = client.db("quiz");
      var collection = db.collection('anketa_results');
      collection.find({
        'name': target
      }).toArray(function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.render('results', {
            result: result,
            name: target
          });
        }
      });
    }
  });
});

router.post('/deleteAnketa', function(req, res) {
  if (req.body.pass == passwords[req.body.cluster]) {
    var target = req.body.item;
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://127.0.0.1:27017/quiz';
    MongoClient.connect(url, function(err, client) {
      if (err) {
        console.log('Unable to connect to the Server', err);
      } else {
        var db = client.db("quiz");
        db.collection(req.body.cluster + '_ankety').deleteOne({
          'name': target
        });
      }
    });
    var rimraf = require('rimraf');
    rimraf('public/data/' + target, function() {
      console.log('folder ' + target + ' deleted');
      res.status(200).send('Success');
    });
  }
});

router.post('/deleteQuiz', function(req, res) {
  if (req.body.pass == passwords[req.body.cluster]) {
    var target = req.body.item;
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://127.0.0.1:27017/quiz';
    MongoClient.connect(url, function(err, client) {
      if (err) {
        console.log('Unable to connect to the Server', err);
      } else {
        var db = client.db("quiz");
        db.collection(req.body.cluster + '_quizzes').deleteOne({
          'name': target
        });
      }
    });
    var rimraf = require('rimraf');
    rimraf('public/data/' + target, function() {
      console.log('folder ' + target + ' deleted');
      res.status(200).send('Success');
    });
  }
});

router.get('/delete/:quiz', function(req, res) {
  var target = req.params.quiz;
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      var db = client.db("quiz");
      db.collection('quizzes').deleteOne({
        'name': target
      });
      db.collection('ankety').deleteOne({
        'name': target
      });
    }
  });
  var rimraf = require('rimraf');
  rimraf('public/data/' + target, function() {
    console.log('folder ' + target + ' deleted');
  });
  res.redirect("/settings");
});

router.get('/createquiz', function(req, res, next) {
  res.render('createquiz', {
    title: 'Nový quiz'
  });
});

router.get('/createanketa', function(req, res, next) {
  res.render('createanketa', {
    title: 'Nová anketa'
  });
});

// router.get('/playQ/:cluster/:quiz', function(req, res) {
//   var MongoClient = mongodb.MongoClient;
//   var url = 'mongodb://127.0.0.1:27017/quiz';
//   MongoClient.connect(url, function(err, client) {
//     if (err) {
//       console.log('Unable to connect to the Server', err);
//     } else {
//       var db = client.db("quiz");
//       var collection = db.collection('quizzes');
//       collection.find({
//         'name': req.params.quiz
//       }).toArray(function(err, result) {
//         if (err) {
//           console.log(err);
//         } else {
//
//           res.render('playQ', {
//             'quiz': result,
//             'cluster' : req.params.cluster
//           })
//
//         }
//       });
//     }
//   });
// });

router.get('/playA/:cluster/:anketa', function(req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      var db = client.db("quiz");
      var collection = db.collection(req.params.cluster + '_ankety');
      collection.find({
        'name': req.params.anketa
      }).toArray(function(err, result) {
        if (err) {
          console.log(err);
        } else {

          res.render('playA', {
            'anketa': result,
            'cluster': req.params.cluster
          })

        }
      });
    }
  });
});

router.get('/playQ/:cluster/:quiz', function(req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      var db = client.db("quiz");
      var collection = db.collection(req.params.cluster + '_quizzes');
      collection.find({
        'name': req.params.quiz
      }).toArray(function(err, result) {
        if (err) {
          console.log(err);
        } else {

          res.render('playQ', {
            'quiz': result,
            'cluster': req.params.cluster
          })

        }
      });
    }
  });
});

router.post('/quiz_result', function(req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      res.send(err);
    } else {
      var db = client.db("quiz");
      var collection = db.collection(req.body.cluster + '_quiz_results');

      collection.insert(req.body.result, function(err, result) {
        if (err) {
          console.log(err);
        } else {

          // Redirect to the updated student list
          res.redirect("/");
        }

        // Close the database
        client.close();
      });
    }
  });

});

router.post('/anketa_result', function(req, res) {
  console.log(req.body);
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      res.send(err);
    } else {
      var db = client.db("quiz");
      var collection = db.collection(req.body.cluster + '_anketa_results');
      collection.insert(req.body.result, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
        client.close();
      });
    }
  });
});

router.get('/quiz_result', function(req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      var db = client.db("quiz");
      var collection = db.collection('quiz_results');
      collection.find().toArray(function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var o = {
            "r": result
          };
          res.send(o);
        }
      });
    }
  });
});

router.get('/anketa_results/:cluster', function(req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      var db = client.db("quiz");
      var collection = db.collection(req.params.cluster + '_anketa_results');
      collection.find().toArray(function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var o = {
            "r": result
          };
          res.send(o);
        }
      });
    }
  });
});

router.get('/quiz_results/:cluster', function(req, res) {
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      var db = client.db("quiz");
      var collection = db.collection(req.params.cluster + '_quiz_results');
      collection.find().toArray(function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var o = {
            "r": result
          };
          res.send(o);
        }
      });
    }
  });
});

//adding new quiz
router.post('/addquiz', function(req, res) {
  let date = new Date();
  let time = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

  //create object
  var quiz = {
    name: req.body.name,
    img: null,
    desc: req.body.desc,
    count: req.body.count,
    date: time,
    questions: []
  };
  for (var i = 0; i < quiz.count; i++) {
    var o = {};
    o.question = req.body['question' + i];
    o.img = null;
    o.answers = [];
    o.correct_answers = [];
    for (var j = 0; j < req.body['answers-count' + i]; j++) {
      o.answers.push(req.body['a' + i + j]);
      if (req.body['ra' + i + j]) {
        o.correct_answers.push(j);
      }
    }
    quiz.questions.push(o);

  }

  var root = require('app-root-path');
  var path = root.path;
  var fs = require('fs');
  var dir = './public/data/' + quiz.name;
  fs.mkdirSync(dir);
  // if (!fs.existsSync(dir)){
  //     fs.mkdirSync(dir);
  // }
  var Jimp = require('jimp');
  if (req.files['img']) {
    var file = req.files['img'];
    var filename = file.name;
    filename = filename.replace(filename.split('.').slice(0, -1).join('.'), quiz.name);
    console.log('filename = ' + filename);
    quiz.img = "data/" + quiz.name + "/" + filename;
    file.mv(path + "\\public/data/" + quiz.name + "\\" + filename, function(err) {
      if (err) {
        console.log(err);;
      } else {
        // Jimp.read('public/' + quiz.img, (err, file) => {
        //   if (err) throw err;
        //   file
        //     .cover(400, 400)
        //     .write(quiz.img);
        // });
      }
    });

  } else {
    quiz.img = 'data/default.png';
  }

  for (var i = 0; i < quiz.count; i++) {
    if (req.files['img' + i]) {
      var file = req.files['img' + i];
      var filename = file.name;
      filename = filename.replace(filename.split('.').slice(0, -1).join('.'), quiz.name + i);
      quiz.questions[i].img = "data/" + quiz.name + "/" + filename;
      file.mv(path + "\\public/data/" + quiz.name + "\\" + filename, function(err) {
        if (err) {
          throw err;
        } else {
          // Jimp.read('public/data/' + quiz.name + '/' + filename)
          //   .then(function(file) {
          //     file
          //       .cover(400, 400)
          //       .write('public/data/' + quiz.name + '/' + filename);
          //   })
          //   .catch(function(err) {
          //     console.log(err);
          //   });

        }

      });

    } else {
      quiz.questions[i].img = "data/default.png";
    }
  }
  //size files
  var fs = require('fs');
  fs.readdir('public/data/' + quiz.name, function(err, files) {
    if (err) {
      console.log(err);
    } else {
      files.forEach(function(file) {
        var path = 'public/data/' + quiz.name + '/' + file;
        console.log('path = ' + path);
        Jimp.read(path)
          .then(function(file) {
            file
              .cover(400, 400)
              .write(path);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    }

  });
  //adding object to db
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      res.send(err);
    } else {
      console.log('Connection established to', url);
      var db = client.db("quiz");
      var collection = db.collection(req.body.cluster + '_quizzes');



      collection.insert([quiz], function(err, result) {
        if (err) {
          console.log(err);
        } else {

          // Redirect to the updated student list
          res.redirect("/settings");
        }

        // Close the database
        client.close();
      });
    }
  });
});

router.post('/addanketa', function(req, res) {
  let date = new Date();
  let time = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
  console.log(req.body['sector_count']);
  //create object
  var anketa = {
    name: req.body.name,
    img: null,
    count: req.body.count,
    desc: req.body.desc,
    date: time,
    questions: [],
    random_order: false,
    weights: false,
    sectors: false,
    comments: false,
    user_data: false
  };
  for (var i = 0; i < anketa.count; i++) {
    var o = {};
    o.q = req.body['question' + i];
    o.img = null;
    anketa.questions.push(o);
  }
  if(req.body.random_order){
    anketa.random_order = true;
  }
  if(req.body.note){
    anketa.comments = true;
  }
  if (req.body.user_data) {
    anketa.user_data = true;
  }
  if(req.body.weights){
    anketa.weights = true;
    for(var i = 0; i < anketa.count; i++){
      anketa.questions[i].weight = req.body['weight'+i];
    }
  }
  if(req.body.sectors){
    anketa.sectors = true;
    anketa.sector_count = req.body['sector_count'];
    for(var i = 0; i < anketa.count; i++){
      anketa.questions[i].sector = req.body['sector'+i];
    }
  }
  var root = require('app-root-path');
  var path = root.path;
  var fs = require('fs');
  var dir = './public/data/' + anketa.name;
  fs.mkdirSync(dir);
  // if (!fs.existsSync(dir)){
  //     fs.mkdirSync(dir);
  // }
  var Jimp = require('jimp');
  if (req.files['img']) {
    var file = req.files['img'];
    var filename = file.name;
    filename = filename.replace(filename.split('.').slice(0, -1).join('.'), anketa.name);
    anketa.img = "data/" + anketa.name + "/" + filename;
    file.mv(path + "\\public/data/" + anketa.name + "\\" + filename, function(err) {
      if (err) {
        console.log(err);;
      } else {

      }
    });

  } else {
    anketa.img = 'data/default.png';
  }

  for (var i = 0; i < anketa.count; i++) {
    if (req.files['img' + i]) {
      var file = req.files['img' + i];
      var filename = file.name;
      filename = filename.replace(filename.split('.').slice(0, -1).join('.'), anketa.name + i);
      anketa.questions[i].img = "data/" + anketa.name + "/" + filename;
      file.mv(path + "\\public/data/" + anketa.name + "\\" + filename, function(err) {
        if (err) {
          throw err;
        } else {
          // Jimp.read('public/data/' + quiz.name + '/' + filename)
          //   .then(function(file) {
          //     file
          //       .cover(400, 400)
          //       .write('public/data/' + quiz.name + '/' + filename);
          //   })
          //   .catch(function(err) {
          //     console.log(err);
          //   });

        }

      });

    } else {
      anketa.questions[i].img = "data/default.png";
    }
  }
  //size files
  var fs = require('fs');
  fs.readdir('public/data/' + anketa.name, function(err, files) {
    if (err) {
      console.log(err);
    } else {
      files.forEach(function(file) {
        var path = 'public/data/' + anketa.name + '/' + file;
        console.log('path = ' + path);
        Jimp.read(path)
          .then(function(file) {
            file
              .cover(400, 400)
              .write(path);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    }

  });
  //adding object to db
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/quiz';
  MongoClient.connect(url, function(err, client) {
    if (err) {
      res.send(err);
    } else {
      console.log('Connection established to', url);
      var db = client.db("quiz");
      var collection = db.collection(req.body.cluster + '_ankety');
      console.log(req.body.cluster + '_ankety');
      collection.insert([anketa], function(err, result) {
        if (err) {
          console.log(err);
        } else {

          // Redirect to the updated student list
          res.status(200).send('Success');
          // var MongoClient = mongodb.MongoClient;
          // var url = 'mongodb://127.0.0.1:27017/quiz';
          // MongoClient.connect(url, function(err, client) {
          //   if (err) {
          //     console.log('Unable to connect to the Server', err);
          //   } else {
          //     var db = client.db("quiz");
          //     console.log('Connection established to', url);
          //     var quizzes;
          //     var ankety;
          //     db.collection(req.body.cluster + '_quizzes').find().toArray().
          //     then(function(data) {
          //       quizzes = data;
          //       db.collection(req.body.cluster + '_ankety').find().toArray().
          //       then(function(data2) {
          //         ankety = data2;
          //         res.render('settings', {
          //           "quizzes": quizzes,
          //           "ankety": ankety
          //         });
          //       });
          //     });
          //   }
          // });

        }

        // Close the database
        client.close();
      });
    }
  });
});

router.get('/data', function(req, res) {
  var fs = require('fs');
  var obj;
  fs.readFile('public/data.json', 'utf8', function(err, data) {
    if (err) throw err;
    res.send(data);
  });
});

router.get('/test', function(req, res) {
  res.render('test');
});
module.exports = router;
