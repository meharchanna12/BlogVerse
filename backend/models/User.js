import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
});

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
