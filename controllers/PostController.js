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

        const filter = {_id: postId};
        const update = {$inc: {viewsCount: 1}};
        const options = {returnDocument: "after"};
        const callBack = (err, doc) => {
            if (err) {
                console.log(err)
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
        }

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
                console.log("Result :", doc);
                res.json(doc)
            })
            .catch((err) => {
                console.log(err)
                return res.status(500).json({
                    message: "Не удалось вернуть статью",
                })
            });
        
        // await  PostModel.findOneAndUpdate(filter, update, options,  (err, doc) => {
        //     if(err) {
        //         console.log(err)
        //         return  res.status(500).json({
        //             message: "Не удалось вернуть статью",
        //         })
        //     }
        //
        //     if(!doc) {
        //         return res.status(404).json({
        //             message: "Статья не найдена"
        //         })
        //     }
        //     res.json(doc)
        // })
        //   await res.json(doc)
        // PostModel.findOneAndUpdate()
        //     .then(function () {
        //
        //     })
        //     .catch(function (err) {
        //         console.log(err);
        //     });


        //
        // PostModel.findOneAndUpdate({
        //     _id: postId,
        // }, {
        //     $inc: {viewsCount: 1}
        // }, {
        //     returnDocument: "after",
        // },
        //     // try {} catch() {}
        //  async (err, doc) => {
        //     if(err) {
        //         console.log(err)
        //        return  res.status(500).json({
        //             message: "Не удалось вернуть статью",
        //         })
        //     }
        //
        //     if(!doc) {
        //         return res.status(404).json({
        //             message: "Статья не найдена"
        //         })
        //     }
        //    await res.json(doc)
        //     }
        //     )
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
