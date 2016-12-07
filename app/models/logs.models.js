import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

let Schema = mongoose.Schema;
let logsSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    operation_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Operation'
    },
    created_at: {
        type: Date, 
        default: Date.now 
    }
});


mongoose.model('Logs', logsSchema);
