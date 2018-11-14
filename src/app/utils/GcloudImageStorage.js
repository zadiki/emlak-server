import {GCLOUD_BUCKET, GCLOUD_PROJECT} from "./Constants";
import {Storage} from "@google-cloud/storage";
import Multer from "multer";
import path from "path";
import sharp from "sharp";

const storage = new Storage({
    projectId: GCLOUD_PROJECT,
    keyFilename: 'keyfile.json'
});
const bucket = storage.bucket(GCLOUD_BUCKET);

async function sendSingleImageToGCS(req, res, next) {
    var image_public_url = ""
    let user_id = req.session.user._id;
    var image = req.file
    const image_name = user_id + "/" + Date.now() + "/" + image.originalname.replace(/ /g, '');
    const file = bucket.file(image_name);
    await sharp(image.buffer)
        .resize(225, 165)
        .toFormat(image.originalname.split(".").reverse()[0])
        .toBuffer()
        .then((data) => {
            image.buffer = data;
            return new Promise((resolve, reject) => {
                file
                    .createWriteStream({
                        metadata: {
                            contentType: image.mimetype
                        },
                        resumable: false
                    })
                    .on('error', (e) => {
                        console.log("gcp error", e);
                        reject(e);

                    })
                    .on("finish", () => {
                        file.makePublic().then(() => {
                            let image = getPublicUrl(image_name);
                            image_public_url=image;
                            resolve(image_public_url);
                        })
                    })
                    .end(image.buffer)
            });
        });
    return image_public_url;

}

async function sendMultipleImagesToGCS(req, res, next) {
    var image_public_urls = [];
    let user_id = req.session.user._id;
    var promises = req.files.map((image) => {

        const image_name = user_id + "/" + Date.now() + "/" + image.originalname.replace(/ /g, '');

        const file = bucket.file(image_name);
        return sharp(image.buffer)
            .resize(225, 165)
            .toFormat(image.originalname.split(".").reverse()[0])
            .toBuffer()
            .then((data) => {
                image.buffer = data;
                return new Promise((resolve, reject) => {
                    file
                        .createWriteStream({
                            metadata: {
                                contentType: image.mimetype
                            },
                            resumable: false
                        })
                        .on('error', (e) => {
                            console.log("gcp error", e);
                            reject(e);

                        })
                        .on("finish", () => {
                            file.makePublic().then(() => {
                                let image = getPublicUrl(image_name);
                                console.log("uploaded to", image);
                                image_public_urls.push(image)
                                resolve(image_public_urls)
                                console.log("success");
                            })
                        })
                        .end(image.buffer)
                });
            });
    });
    await Promise.all(promises)
        .then((images) => {
            // console.log("promises finished",images);
        });
    console.log("imageurl", image_public_urls);
    return image_public_urls;
}

const getPublicUrl = (filename) => {
    let public_url = `https://storage.googleapis.com/${GCLOUD_BUCKET}/${filename}`;
    return public_url;
}
const multipleUploadMulter = Multer({
    storage: Multer.MemoryStorage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.ico') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb
    }
}).array("propertyimage", 3);

const singleUploadMulter = Multer({
    storage: Multer.MemoryStorage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: 1 * 1024 * 1024 // no larger than 1mb
    }
}).single("profile_photo");


const deleteFilefromGcp = (image_file) => {

    return new Promise((resolve, reject) => {
        var imageurl = image_file.split("/");
        imageurl = imageurl.slice(4, imageurl.length + 1).join("/");
        storage
            .bucket(GCLOUD_BUCKET)
            .file(imageurl)
            .delete()
            .then((image) => {
                resolve(image)
            })
            .catch((e) => {
                reject(e)
            });

    });
    console.log(imageurl)
}

module.exports = {
    deleteFilefromGcp,
    sendMultipleImagesToGCS,
    sendSingleImageToGCS,
    singleUploadMulter,
    multipleUploadMulter
};
