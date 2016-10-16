var fs = require('fs');
var ursa = require('ursa');
var PromiseA = require('bluebird').Promise;
var path = require('path');
var mkdirpAsync = PromiseA.promisify(require('mkdirp'));
const User = require('../models/User');
const Key = require('../models/Key');


exports.generateKey = (req, res) => {

  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  User.findById(req.user.id, (err, user) => {
    if (err) {
      req.flash("error", err);
      return res.redirect('/login');
    }
    var pathname = "./keys/" + user.id;
    var key = ursa.generatePrivateKey(1024, 65537);
    var privpem = key.toPrivatePem();
    var pubpem = key.toPublicPem();
    var privkey = path.join(pathname, 'privkey.pem');

    return mkdirpAsync(pathname).then(function () {
      PromiseA.all([
          fs.writeFile(privkey, privpem, 'ascii')
      ]);
    }).then(function () {
       res.download(privkey, function(err) {
         if (err) {
           req.flash("error", err);
           return res.redirect('/');
         } else {
           PromiseA.all([
             fs.unlinkSync(privkey)
           ]).then(function() {
             const key = new Key({
               key: pubpem,
               user: user.id
             });
             key.save((err) => {
               if (err) {
                 req.flash("error", err);
                 return res.redirect('/login');
               }
             });
           });
         }
       })
     });
  });
};

exports.uploadFile = (req, res) => {




};

exports.downloadFile = (req, res) => {




};
