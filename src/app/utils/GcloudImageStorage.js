import {GCLOUD_BUCKET,DATA_BACKEND,GCLOUD_PROJECT}from "./Constants";
import {Storage} from "@google-cloud/storage";
import Multer from "multer";

const storage = new Storage({
    projectId: GCLOUD_PROJECT,
    keyFilename: 'keyfile.json'
});
const bucket = storage.bucket(GCLOUD_BUCKET);


async function sendUploadToGCS (req, res, next){
        var image_public_urls=[];
        var promises = req.files.map((image)=>{
            const image_name = Date.now()+ image.originalname;
            const file = bucket.file(image_name);
            console.log("awesome")
            return new Promise((resolve,reject)=>{file
                .createWriteStream({
                        metadata: {
                            contentType: image.mimetype
                        },
                        resumable: false
                    })
                    .on('error', (e) => {
                        reject(e);
                        console.log("error 1")
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
                    .end(image.buffer)});
            });
        Promise.all(promises).then((images)=>{console.log("promises finished",images)});
        console.log(image_public_urls);
        return image_public_urls;
}

const getPublicUrl =(filename)=> {
    let public_url=`https://storage.googleapis.com/${GCLOUD_BUCKET}/${filename}`;
    return public_url;
}
const  multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb
    }
}).array("propertyimage",3);

const deleteFilefromGcp=(image_file)=>{

    return new Promise((resolve,reject)=>{
        var imageurl= image_file.split("/");
        imageurl=imageurl.slice(4,imageurl.length+1)[0];
        storage
            .bucket(GCLOUD_BUCKET)
            .file(imageurl)
            .delete()
            .then((image)=>{resolve(image)})
            .catch((e)=>{reject(e)});

    });
    console.log(imageurl)
}

module.exports = {
    deleteFilefromGcp,
    sendUploadToGCS,
    multer
};


