// models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
});

const PostModel = mongoose.model('Post', postSchema);

export default PostModel;  // Use ES export default
