var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
var uuid = require('uuid');

//mongoose.connect('mongodb://localhost/test');

mongoose.connect('mongodb://localhost/test');
//mongoose.connect("mongodb://armand_at:#LORDarmand2019@atsocial-shard-00-00-exfpm.gcp.mongodb.net:27017,atsocial-shard-00-01-exfpm.gcp.mongodb.net:27017,atsocial-shard-00-02-exfpm.gcp.mongodb.net:27017/test?ssl=true&replicaSet=AtSocial-shard-0&authSource=admin&retryWrites=true/", { useNewUrlParser: true });


 var Schema = mongoose.Schema;


var UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    //required: true
  },
  token: String,
  expiry: Date,
  firstName: String,
  lastName: String,
  businessName:{
    type: String,
    required: true
  },
});

UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
      cb(null, isMatch);
  });
};

UserSchema.methods.generateResetToken = function(cb) {
  const id = uuid.v4();
  this.token = id;
  this.expiry = new Date((new Date().getTime()) + 60 * 60 * 1000);
  return this.save(cb);
};

UserSchema.methods.login = function(cb) {
  return this.model('User').find({ username: this.username }, cb);
}

var User = mongoose.model('User', UserSchema);

module.exports = User;
