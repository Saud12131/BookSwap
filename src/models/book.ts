import mongoose, { Schema, model, models } from "mongoose";

const BookSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required:true
    },
    userID:{
    type: String,
    },
    Owner:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
},
    {
        timestamps: true
    }
);

const Books = models.Books || model("Books",BookSchema);
export default Books;
