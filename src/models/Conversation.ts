import mongoose, { Schema, models} from 'mongoose';

const conversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    }],
    carId : {
        type : Schema.Types.ObjectId,
        ref: "Car",
        required: true
    },
    lastMessageAt: {
        type : Date,
        default: Date.now
    }
},{ timestamps: true});

const Conversation = models.Conversation || mongoose.model('Conversation',conversationSchema);

export default Conversation;