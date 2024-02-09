
import { NextFunction, Response } from "express";
import { File } from "../../models/index";
import multer from "multer";

import fs from 'fs'

import { promisify } from 'util'
import mime from 'mime';

const unlinkAsync = promisify(fs.unlink)

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        let path = 'uploads/drive/';
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

const upload = multer({ storage: storage })

function afterUpload(req: any, res: any, next: any) {

    req.body = {
        ...req.body,
        fileName: req.files[0]?.originalname ?? req.body?.fileName
    }
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

    let path = 'uploads/drive/';

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

    const file_buffer = fs.readFileSync(path);
    //encode contents into base64
    const base64 = file_buffer.toString('base64');


    const mimeType = mime.getType(path)

    res.send({ data: `data:${mimeType};base64,${base64}`, mimeType })



}

const uploader = upload.array("files")

export { uploader, afterUpload, afterDrop, downloader };