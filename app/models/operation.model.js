import mongoose from 'mongoose';

let Schema = mongoose.Schema;
let operationSchema = new Schema({
    name: { // This is the name of the operation
        type: String,
        required: true,
        unique: true, 
        index: true
    },
    positionalNumOfParams: { // This is the number of the positional parameters
        type: Number,
        default: 0
    },
    namedParams: { // These are the keys of the dictionary
        type: [String],
        default: []
    },
    externalUrl: { // A url that will point to the external JSON-RPC API
        type: String
    },
    tokenKey: { // The key of either the header or the parameter
        type: String
    },
    tokenValue: { // The token itself
        type: String
    },
    tokenInHeader: { // Whether or not the token must be provided in the request headers
        type: Boolean
    },
    tokenInParams: { // Whether or not the token must be provided in the json-rpc parameters
        type: Boolean
    }    
});

mongoose.model('Operation', operationSchema);
