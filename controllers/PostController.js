import PostModel from "../models/Post.js";
import { ObjectId } from "mongodb";

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить статьи",
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = (req.params.id).trim();

        await PostModel.findOneAndUpdate({_id: postId},{$inc: {viewsCount: 1}}, {returnDocument: "after"} )
            .then((doc, err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Не удалось вернуть статью",
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: "Статья не найдена"
                    })
                }
                res.json(doc)
            })
            .catch((err) => {
                console.log(err)
                return res.status(500).json({
                    message: "Не удалось вернуть статью",
                })
            });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить статьи",
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = (req.params.id).trim();

        await PostModel.findOneAndDelete({_id: postId})
            .then((doc, err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Не удалось удалить статью",
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: "Статья не найдена"
                    })
                }
                res.json({
                    success: true
                })
            })
            .catch((err) => {
                console.log(err)
                return res.status(500).json({
                    message: "Не удалось вернуть статью",
                })
            });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить статьи",
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })

        const post = await doc.save();

        res.json(post);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось зарегистрироваться",
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = (req.params.id).trim();

        await PostModel.updateOne({_id: postId}, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })
        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось обновить статью",
        })
    }

}
