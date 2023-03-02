const mongoose = require("mongoose");
 const bcrypt = require("bcryptjs")
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    pic: {
      type: String,
      default: "",
    },
  },
  {
    timestamp: true,
  }
);
// function for matching the password (enteredpass with savepass)

userSchema.method.matchpassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword,this.password);
}


// before saving the user it encrypt the data 
userSchema.pre("save",async function (next) {
  if(!this.ismodified){
    next()
  }

  const salt = await bcrypt.gensalt(10);
  this.password = await bcrypt.hash(this.password ,salt)
})

const User = mongoose.model("user,userSchema");

module.export=User;
