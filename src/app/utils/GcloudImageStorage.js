

export const getPublicUrl =(filename)=> {
    return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}