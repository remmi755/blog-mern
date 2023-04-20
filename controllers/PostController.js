import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map((obj) => obj.tags)
            .flat()
            .slice(0, 5)
        res.json(tags)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить tags",
        })
    }
}

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

// export const sortByNovelty = async (reg, res) => {
//     try {
//         const posts = await PostModel.aggregate([{"$sort": { "createdAt": -1}}])
//         res.json(posts)
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             message: "Не удалось посортировать статьи",
//         })
//     }
// }

export const getOne = async (req, res) => {
    try {
        const postId = (req.params.id).trim();

     await PostModel.findOneAndUpdate({_id: postId},
            {$inc: {viewsCount: 1}},
            {returnDocument: "after"} ).populate(`user`)
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
            tags: req.body.tags.split(','),
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
            tags: req.body.tags.split(','),
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
