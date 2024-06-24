import connectDB from "./db/index.js";
import { app } from "./app.js";
import express from "express";
import cors from 'cors';
import {productRouter} from "./routes/Product.route.js"
import {categoriesRouter} from "./routes/Category.route.js"
import {brandsRouter} from "./routes/Brand.route.js"
import { authRouter } from "./routes/Auth.route.js";
import { userRouter } from "./routes/User.route.js";
import { cartRouter } from "./routes/Cart.route.js";
import { orderRouter } from "./routes/Order.route.js";
import passport from "passport";
import session from "express-session";
import {Strategy as LocalStrategy} from "passport-local"
import jwt from 'jsonwebtoken'
import { Strategy as JwtStrategy } from 'passport-jwt';
import { User } from "./model/User.model.js";
import { isAuth,sanitizeUser,cookieExtractor } from "./services/common.js";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import path from "path"
import Stripe from "stripe";
import {fileURLToPath} from 'url';
import 'dotenv/config'
import { Order } from "./model/Order.model.js";
import { env } from "process";
const endpointSecret = process.env.ENDPOINT_SECRET;

//app.use(express.raw({type: 'application/json'}));
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;

        const order = await Order.findById(
          paymentIntentSucceeded.metadata.orderId
        );
        order.paymentStatus = 'received';
        await order.save();

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);



// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;  // TODO: should not be in code;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.resolve(__dirname,'build')))
//app.use(express.static('build'))
app.use(cookieParser());


//
// Passport Strategies
app.use(
  session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
app.use(passport.authenticate('session'));
app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
);

app.use(express.json());
 // to parse req.body
app.use('/products',isAuth(), productRouter);
// we can also use JWT token for client-only auth
app.use('/categories',isAuth(), categoriesRouter);
app.use('/brands',isAuth(), brandsRouter);
app.use('/users',isAuth(), userRouter);
app.use('/auth', authRouter);
app.use('/cart',isAuth(), cartRouter);
app.use('/orders',isAuth(), orderRouter);
app.get('*', (req, res) => res.sendFile(path.resolve('build', 'index.html')));

passport.use(
  'local',
  new LocalStrategy(
    {usernameField:'email'},
    async function (email, password, done) {
    // by default passport uses username
    try {
      const user = await User.findOne({ email: email });
      console.log(email, password, user);
      if (!user) {
        return done(null, false, { message: 'invalid credentials' }); // for safety
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256',
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: 'invalid credentials' });
          }
          const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
          done(null, {id:user.id, role:user.role, token});
            // this lines sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  'jwt',
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });
    try {
       const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
    console.log('serialize', user);
    process.nextTick(function () {
      return cb(null, { id: user.id, role: user.role });
    });
  });
  
  // this changes session variable req.user when called from authorized request
  
  passport.deserializeUser(function (user, cb) {
    console.log('de-serialize', user);
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  // Payments


// This is your test secret API key.
const stripe = Stripe(process.env.STRIPE_SERVER_KEY);



app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount,orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*90,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata:{
      orderId
    }
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


// Webhook

// TODO: we will capture actual order after deploying out server live on public URL

  



connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log(`Database connection failed`,err);
})



