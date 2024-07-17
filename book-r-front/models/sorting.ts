import mongoose, { Schema, model, models } from 'mongoose';

const SortingSchema = new Schema({
    name: {type: String, required: true},
    parent: {type: mongoose.Types.ObjectId, ref: 'Sorting'},
    properties: [{type: Object}]
});


export const Sorting = models?.Sorting || model('Sorting', SortingSchema);