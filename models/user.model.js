const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name      : { type: String, required: true },
    email     : { type: String, required: true, unique: true },
    password  : { type: String, required: true },
    RFC       : { type: String, required: true, unique: true },
    cardNumber: { type: String, required: true, unique: true },

    /* NEW ➜ role */
    role      : {
      type   : String,
      enum   : ['admin', 'client'],
      default: 'client'
    }
  },
  { timestamps: true }
);

/* ---------- Hash automático ---------- */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* ---------- Método para comparar ---------- */
userSchema.methods.comparePassword = function (plainPwd) {
  return bcrypt.compare(plainPwd, this.password);
};

module.exports = mongoose.model('User', userSchema);
