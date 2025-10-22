
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    name: String,
    // Buffer para armazenar os dados binários
    imgData: Buffer, 
    contentType: String
});

const Image = mongoose.model('Image', imageSchema);
export default Image
