import mongoose, { Schema } from "mongoose";

const paymentMethods = {
  values: ['card', 'cash'],
  message: 'enum validator failed for payment Methods'
}

const orderSchema = new Schema({
    items: { type: [Schema.Types.Mixed], required: true },
    totalAmount: { type: Number },
    totalItems: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    //TODO:  we can add enum types
    paymentMethod: { type: String, required: true, enum: paymentMethods },
    status: { type: String, default: 'pending' },
    selectedAddress: { type: Schema.Types.Mixed, required: true },
    paymentStatus: {type:String, default:'pending'},
  },{timestamps:true});
  
  const virtual = orderSchema.virtual('id');
  virtual.get(function () {
    return this._id;
  });
  orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
  
  export const Order = mongoose.model('Order', orderSchema);