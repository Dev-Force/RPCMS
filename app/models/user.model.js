import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

let Schema = mongoose.Schema;
let userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    operations: [{
        type: [Schema.Types.ObjectId],
        ref: 'Operation',
        default: []
    }]
});

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

mongoose.model('User', userSchema);
