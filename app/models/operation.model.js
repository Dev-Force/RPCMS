import mongoose from 'mongoose';

let Schema = mongoose.Schema;
let operationSchema = new Schema({
    name: { // This is the name of the operation
        type: String,
        required: true,
        unique: true
    },
    positionalNumOfParams: { // This is the number of the positional parameters
        type: Number,
        default: 0
    },
    namedParams: {  // These are the keys of the dictionary
        type: [String],
        default: []
    }
});

mongoose.model('Operation', operationSchema);
