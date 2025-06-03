import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength : 6,
    },
    username:{
        type: String,
        unique: true,
        required: true
    },
    profileImage : {
        type : String,
        default : ""
    }
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
         next();
    }

   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next();
});

// şifreleri karşılaştırma

userSchema.methods.comparePassword = async function(userPassword) {
    return await bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;