import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

let Schema = mongoose.Schema;
let ipBlacklistSchema = new Schema({
    address: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

mongoose.model('IPBlacklist', ipBlacklistSchema);
