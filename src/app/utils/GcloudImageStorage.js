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
      req.files.forEach(async(image)=>{
        const gcsname = Date.now() + image.originalname;
          image.cloudStoragePublicUrl = getPublicUrl(gcsname);
          image_public_urls.push(image.cloudStoragePublicUrl);
        const file = bucket.file(gcsname);
        const stream = await file.createWriteStream({
            metadata: {
                contentType: image.mimetype
            },
            resumable: true
        });

        stream.on('error', (err) => {
            // next(err);
        });

         stream.on('finish', () => {
            image.cloudStorageObject = gcsname;
            file.makePublic().then(() => {
                // image.cloudStoragePublicUrl = getPublicUrl(gcsname);
                // image_public_urls.push(image.cloudStoragePublicUrl);
                // next();
            });
        });
        stream.end(image.buffer);
    });
    req.image_urls=image_public_urls;
    console.log("logged after")
    next();
}

const getPublicUrl =(filename)=> {
    let public_url=`https://storage.googleapis.com/${GCLOUD_BUCKET}/${filename}`;
    console.log("public url",public_url);
    return public_url;
}
const  multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb
    }
}).array("propertyimage",3);

module.exports = {
    sendUploadToGCS,
    multer
};


