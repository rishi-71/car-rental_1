import mongoose , {Schema, models} from "mongoose";

const reviewSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    carId : {
        type : Schema.Types.ObjectId,
        ref : 'Car',
        required : true
    },
    rating : {
        type : Number,
        required: true,
        min : 1,
        max : 5
    },
    comment: {
        type :String,
        required : true,
        trim : true
    },
},{ timestamps: true });

const Review  = models.Review || mongoose.model('Review', reviewSchema);

export default Review;