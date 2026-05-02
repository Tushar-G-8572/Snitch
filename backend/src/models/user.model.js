import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^\S+@\S+\.\S+$/,"Please use a valid email"]
    },
    password:{
        type:String,
        minlength:6,
        select:false
    },
    role:{
        type:String,
        enum:["Buyer","Seller"],
        default:"Buyer"
    },
    refreshToken:{
        type:String,
    }
},{
    timestamps:true
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return ;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
})

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}


const userModel = mongoose.model('user', userSchema);

export default userModel;