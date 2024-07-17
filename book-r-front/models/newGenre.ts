import mongoose, { Schema, model, models } from 'mongoose';

const GenreSchema = new Schema({
    name: {type: String, required: true},
    parent: {type: String},
    books: [{type: Object}],
});


const Genre = models?.Genre || model('Genre', GenreSchema);

export default Genre