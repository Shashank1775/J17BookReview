import { Schema, model } from 'mongoose'
import mongoose from 'mongoose';


const newListSchema = new Schema({
    creatorId : {
        type: String,
        required: true
    }, 
    name: {
        type: String,
        required: true
    },
    studyInterval: {
        type: String,
    },
    tags: {
        type: [{type: String}],
    },
    books: {
        type: [{type: Object}],
    },
    priority: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
    },
    color:{
        type: String,
    },
    description:{
        type: String,
    }
    })

const NewList = mongoose.models.NewList || mongoose.model('NewList', newListSchema);

export default NewList