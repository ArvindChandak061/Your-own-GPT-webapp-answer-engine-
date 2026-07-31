import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import threadRouter from "./routes/chat.routes.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser"

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 8080;

app.use(express.json());
// Put all allowed URLs in an array
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL // Will read from hosting settings
].filter(Boolean) // Cleans up empty values

app.use(cors({
  origin: function (origin, callback) {
    // Allow Postman/mobile tools or matching origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("CORS error: Not allowed"))
    }
  },
  credentials: true
}))

app.use("/api", threadRouter);
app.use("/api/auth",authRouter);

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch(err) {
        console.log("Failed to connect with Db", err);
    }
}


app.listen(port, () => {
    console.log(`server running on ${port}`);
    connectDB();
});

// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type: application/json",
//             "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "llama-3.3-70b-versatile",
//             messages: [{
//                 role: "user",
//                 content: req.body.message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
//         const data = await response.json();
//         //console.log(data.choices[0].message.content); //reply
//         res.send(data.choices[0].message.content);
//     } catch(err) {
//         console.log(err);
//     }
// });
