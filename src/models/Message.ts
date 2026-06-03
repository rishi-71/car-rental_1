import mongoose,{ Schema, models} from "mongoose";

const messageSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true

    },
    senderId:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    text : {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
},{ timestamps: true});

const Message = models.Message || mongoose.model('Message', messageSchema );

export default Message;