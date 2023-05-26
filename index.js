import express from 'express';
import fs from 'fs'
import mongoose from "mongoose";
import multer from 'multer'
import cors from 'cors'

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";

import { handleValidationErrors, checkAuth }  from './utils/index.js'

import { UserController, PostController } from "./controllers/index.js";

mongoose.connect('mongodb+srv://remmi:wwwwww@cluster0.j5xu8.mongodb.net/blog?retryWrites=true&w=majority')
// mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("DB  OK")
    })
    .catch((error) => console.log('DB error', error))

const app = express();

const storage = multer.diskStorage({
    destination:(_,__, cb) => {
        if(!fs.existsSync('https://mern-blog-new.onrender.com/uploads')) {
            fs.mkdirSync('https://mern-blog-new.onrender.com/uploads')
        }
        cb(null, 'https://mern-blog-new.onrender.com/uploads')
    },
    filename:(_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage})

app.use(express.json());
app.use(cors())
app.use('https://mern-blog-new.onrender.com/uploads', express.static('uploads'))
app.use('https://mern-blog-new.onrender.com/uploads/avatar', express.static('uploads'))

app.post('/auth/login',loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors,  UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe );

app.post('/upload',checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/tags', PostController.getLastTags );
app.get('/comments', PostController.getLastComments );
app.get('/posts', PostController.getAll );
app.get('/tags/:name', PostController.sortByTag );
app.patch('/posts', PostController.sortByNewest );
app.get('/posts/tags', PostController.getLastTags );
app.get('/posts/:id', PostController.getOne );
app.post('/comments/:id', checkAuth, PostController.createComment);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create );
app.patch('/posts/:id', checkAuth,postCreateValidation, handleValidationErrors,PostController.update );
app.delete('/posts/:id', checkAuth, PostController.remove );

const PORT = 'https://mern-blog-new.onrender.com'
// const PORT = process.env.PORT || 4444
app.listen( process.env.PORT || 4444, (err) => {
    console.log(`Server is listening on port ${process.env.PORT}`);
    if (err) {
        return console.log(err)
    }
    console.log("Server Ok")
})