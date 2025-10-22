import mongoose from "mongoose";


const grazittiUserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    reporting_manager: {
        type: String,
    }
})

const GrazittiUser = mongoose.model("GrazittiUser", grazittiUserSchema)

export default GrazittiUser