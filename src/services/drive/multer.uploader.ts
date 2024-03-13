
import { NextFunction, Response } from "express";
import { File } from "../../models/index";
import multer from "multer";

import fs, { statSync } from 'fs'

import { promisify } from 'util'
import mime from 'mime';

import path from 'path';
import { readdir, stat } from 'fs/promises';
import { DISK_PATH } from "../../config";
import { forIn } from "lodash";

const dirSize = async (directory: string) => {
    let allFIles = [];
    const files = await readdir(directory);

    files.map(allFIles.push);

    const stats = files.map(file => stat(path.join(directory, file)));

    const getFilesContent = async (files: string) => {

        forIn
        for (let file of files) {
            if (!statSync(`${file}`).isDirectory()) {
                const files = await readdir(file);
                getFilesContent(file)
                files.map(allFIles.push);
            }
        }

    }
    return (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + size, 0);


}

const unlinkAsync = promisify(fs.unlink)

const storage = multer.diskStorage({

    destination: async (req, file, cb) => {
        let path: string = DISK_PATH ?? '';
        const { dirId }: any = req?.query;
        if (dirId) {

            let fixedFile: any = await File.scope('full').findByPk(dirId);
            if (fixedFile) {

                let p: string[] = [];

                do {
                    p.push(fixedFile?.fileName ?? '');
                    fixedFile = fixedFile.dir;
                } while (fixedFile)

                path += p.reverse().join('/');
            }
        }
        path += '/'
        fs.mkdirSync(path, { recursive: true })

        cb(null, path)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const limits = {
    fields: 10,
    fieldNameSize: 50, // TODO: Check if this size is enough
    fieldSize: 20000, //TODO: Check if this size is enough
    fileSize: 10_000_000,
}

const upload = multer({
    storage, limits
})

function afterUpload(req: any, res: any, next: any) {

    req.body = {
        ...req.body,
        fileName: req.files[0]?.originalname ?? req.body?.fileName
    }

    let body: any = {};
    for (let [k, v] of Object.entries(req.body)) {
        try {
            body[k] = JSON.parse(String(v));
        } catch (e) {
            body[k] = v;
        }
    }


    req.body = body;
    //res.json({ message: "Successfully uploaded files" });
    next();
    //return;
}

const afterDrop = async (req: any, res: any, next: any) => {

    await unlinkAsync(req.file.path)
    next();
    //return;
}

const downloader = async (req: any, res: any, next: any) => {

    const { id } = req.params;
    const { query: opts } = req;

    let path: string = DISK_PATH ?? '';

    const file = await File.scope('full').findByPk(id);


    let fixedFile: any = file;
    if (fixedFile) {

        let p: string[] = [];

        do {
            p.push(fixedFile?.fileName ?? '');
            fixedFile = fixedFile.dir;
        } while (fixedFile)

        path += p.reverse().join('/');
    }


    //const path = file?.path;

    try {

        const file_buffer = fs.readFileSync(path);
        //encode contents into base64
        const base64 = file_buffer.toString('base64');


        const mimeType = mime.getType(path)

        function getFileTypeFromMimeType(mimeType: string = '') {
            // Verifica o tipo de mídia com base no MIME type
            if (mimeType.startsWith('image/')) {
                return 'image';
            } else if (mimeType.startsWith('video/')) {
                return 'video';
            } else if (mimeType.startsWith('audio/')) {
                return 'audio';
            } else if (mimeType === 'application/pdf') {
                return 'pdf';
            } else {
                return 'other';
            }
        }

        const stat = fs.statSync(path);

        res.send({ file, stat, data: `data:${mimeType};base64,${base64}`, mimeType, type: getFileTypeFromMimeType(mimeType ?? '') })



    } catch (err: any) {
        //res.status(404)
        throw { code: 500, message: 'File not found' }
        //res.send({ data: ``, mimeType: '', type: '', err })
    }
}

const uploader = upload.array("files")

export { uploader, afterUpload, afterDrop, downloader, dirSize };