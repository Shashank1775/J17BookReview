import { Schema, model } from 'mongoose'
import mongoose from 'mongoose';


const newNoteSchema = new Schema({
    creatorId : {
        type: String,
        required: true
    }, 
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required:true
    },
    date: {
        type: Date,
        required: true
    },

    })

const NewNote = mongoose.models.NewNote || mongoose.model('NewNote', newNoteSchema);

export default NewNote