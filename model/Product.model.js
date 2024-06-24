import { Decimal128 } from "mongodb";
import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema= mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        min:[0,"Minimum price should not be 0"],
        required:true,
    },
    discountPercentage:{
        type:Number,
        min:[0,"Minimum discount should be greater than or equal to 0"],
        required:true,
    },
    rating:{
        type:Number,
        min:[0,'Rating minimum equals to 0'],
        max:[5,'Rating maximum equals to 5'],
        required:true,
        default:0,
    },
    stock:{
        type:Number,
        min:[0,'Stock minimum equals to 0'],
        required:true,
        default:0
    },
    brand:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
        required:true,
    },
    images:[{
        type:String,
        required:true,
    }],
    colors:{ type : [Schema.Types.Mixed] },
    sizes:{ type : [Schema.Types.Mixed]},
    highlights:{ type : [String] },
    deleted:{
        type:Boolean,
        required:true,
    },
})

const virtualId  = productSchema.virtual('id');
virtualId.get(function(){
    return this._id;
})
productSchema.set('toJSON',{
    virtuals: true,
    versionKey: false,
    transform: function (doc,ret) { delete ret._id}
})


export const Product=mongoose.model('Product',productSchema)