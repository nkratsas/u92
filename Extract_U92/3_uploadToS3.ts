import 'dotenv/config';
import { fileTypeFromBuffer } from 'file-type';

import fs from 'fs';

import path from 'path';
import mime from 'mime-types';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { TMP_DIR, IMAGES_MAP_FILE_PATH } from './src/constants.js';

const s3Client = new S3Client({});

const uploadToS3AndGetFinalFileName = async (
    assetFileName: string | undefined,
    buffer: Buffer,
) => {
    if (!assetFileName) {
        throw new Error('Asset file name is empty.');
    }

    const fileType = (await fileTypeFromBuffer(buffer)) || null;
    const mimeType = fileType?.mime || 'application/octet-stream';
    const ext = fileType?.ext || '';

    const baseName =
        assetFileName.substring(0, assetFileName.lastIndexOf('.')) ||
        assetFileName;
    const correctedFileName = `${baseName}.${ext}`;

    if (process.env.DRY_RUN) {
        return correctedFileName;
    }

    const key = `${process.env.S3_OUTPUT_PATH}/${correctedFileName}`;

    const parallelUploads3 = new Upload({
        client: s3Client,
        params: {
            Bucket: process.env.S3_OUTPUT_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        },
        leavePartsOnError: false,
    });

    parallelUploads3.on('httpUploadProgress', (progress) => {
        console.log(progress);
    });

    await parallelUploads3.done();
    return assetFileName;
};

const processS3Uploads = async () => {
    if (!fs.existsSync(IMAGES_MAP_FILE_PATH)) {
        throw new Error(
            `Stage 1 map file not found at ${IMAGES_MAP_FILE_PATH}`,
        );
    }

    const rawMap = fs.readFileSync(IMAGES_MAP_FILE_PATH, 'utf-8');
    const stage1Data = JSON.parse(rawMap);
    const images = stage1Data.images || [];

    const s3Manifest = [];

    for (const item of images) {
        const localFilePath = item.newFilename;
        const fileNameOnly = path.basename(localFilePath);

        if (!fs.existsSync(localFilePath)) {
            console.log(
                `[WARNING] ${localFilePath} does not exist. Skipping...`,
            );
            continue;
        }

        const buffer = fs.readFileSync(localFilePath);

        try {
            console.log(`Uploading ${fileNameOnly}`);
            const finalFileName = await uploadToS3AndGetFinalFileName(
                fileNameOnly,
                buffer,
            );

            const s3Key = `${process.env.S3_OUTPUT_PATH}/${finalFileName}`;
            const s3Url = `https://${process.env.S3_CC_DAM_NAME}/${s3Key}`;

            s3Manifest.push({
                ...item,
                s3Url,
            });
        } catch (err: any) {
            console.log(
                `[ERROR] Failed uploading ${fileNameOnly}: ${err.message}`,
            );
        }
    }

    const s3MapPath = path.join(TMP_DIR, 's3_map.json');
    fs.writeFileSync(
        s3MapPath,
        JSON.stringify({ images: s3Manifest }, null, 2),
    );
    console.log(`Stage 2 Complete! Output saved to ${s3MapPath}`);
};

processS3Uploads();
