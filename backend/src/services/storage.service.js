import ImageKit from "imagekit";
import config from "../config/config.js";

// Validate ImageKit configuration
if (!config.IMAGEKIT_PUBLIC_KEY || !config.IMAGEKIT_PRIVATE_KEY || !config.IMAGEKIT_URL_ENDPOINT) {
    console.error('ImageKit configuration is missing. Check your .env file.');
    throw new Error('ImageKit configuration is missing');
}

const imagekit = new ImageKit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT
});

export async function uploadFile(file, filename) {
    if (!file || !file.buffer) {
        throw new Error('Invalid file provided to uploadFile');
    }

    return new Promise((resolve, reject) => {
        console.log('Attempting to upload file:', filename);
        imagekit.upload(
            {
                file: file.buffer,
                fileName: filename,
                folder: "n22-social-application"
            },
            function(error, result) {
                if (error) {
                    console.error('ImageKit upload failed:', error);
                    reject(error);
                } else {
                    console.log('File uploaded successfully:', filename);
                    resolve(result);
                }
            }
        );
    });
}