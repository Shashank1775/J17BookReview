import { Schema, model } from 'mongoose'
import mongoose from 'mongoose';


const newBookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    images: {
        type: [{type: String}],
    },
    sorting: {
        type: mongoose.Types.ObjectId,
        ref: 'Sorting',
    },
    properties: {
        type: Object,
    },
    genre: {
        type: String,
    }
    })

const NewBook = mongoose.models.NewBook || mongoose.model('NewBook', newBookSchema);

export default NewBook