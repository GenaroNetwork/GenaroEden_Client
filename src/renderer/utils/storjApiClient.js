import {
    TASK_TYPE,
    TASK_STATE,
    BRIDGE_API_URL
} from '../../config';
import log from "./log";
import events from "events";


const UUID = require('uuid/v1');
import {
    Environment,
    mnemonicGenerate,
    mnemonicCheck,
    listFiles
} from 'libgenaro';


let storj;
class Storj {
    constructor({
        bridgeUrl = BRIDGE_API_URL,
        bridgeUser = localStorage.bridgeUser,
        bridgePass = localStorage.bridgePass,
        encryptionKey = localStorage.bridgeKey,
        logLevel = 0,
    } = {}) {
        if (process.env.NODE_ENV === 'development') {
            localStorage.bridgeUser = bridgeUser;
            localStorage.bridgePass = bridgePass;
            localStorage.bridgeKey = encryptionKey;
        }
        return new Environment({
            bridgeUrl,
            bridgeUser,
            bridgePass,
            encryptionKey,
            logLevel,
        });
    };
    static init(...params) {
        storj = new Storj(...params);
    };
    static getInfo() {
        return new Promise((resolve, reject) => {
            storj.getInfo(function (err, result) {
                if (err) reject(err);
                else resolve(result);
            })
        });
    }
}
if (process.env.NODE_ENV === 'development') Storj.init();

class Bucket {
    constructor(bucketId) {
        this.bucketId = bucketId;
    }

    // create folder, not avaliable now.
    create() {
        return;
    };

    // get file list of this bucket
    list() {
        return new Promise((resolve, reject) => {
            storj.listFiles(this.bucketId, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    };

    // delete file
    delete({
        fileId
    }) {
        return new Promise((resolve, reject) => {
            storj.deleteFile(this.bucketId, fileId, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    };

    // get bucket list
    static list() {
        return new Promise((resolve, reject) => {
            storj.getBuckets((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    };

    //create bucket
    static create({
        bucketName
    }) {
        return new Promise((resolve, reject) => {
            storj.createBucket(bucketName, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    };

    // delete bucket
    static delete({
        bucketId
    }) {
        return new Promise((resolve, reject) => {
            storj.deleteBucket(bucketId, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    };
}

class Task {
    constructor() {
        this.taskId = UUID();
        this.taskType = TASK_TYPE.NOTSET;
        this.taskState = TASK_STATE.INIT;
        this.progress = 0;
        this.created = Date.now();
        this.updated = Date.now();
        this.state = null;
        this.totalBytes = 0;
        this.errorMessage = null;

        let taskEvent = new events;
        this.on = taskEvent.on;
        this.once = taskEvent.once;
        this.emit = taskEvent.emit;
        this.off = (eventName, listener = null) => {
            if (listener === null) taskEvent.removeAllListeners(eventName);
            else taskEvent.removeListener(eventName, listener);
        };

        Object.defineProperty(this, "on", {
            enumerable: false
        });
        Object.defineProperty(this, "once", {
            enumerable: false
        });
        Object.defineProperty(this, "emit", {
            enumerable: false
        });
        Object.defineProperty(this, "off", {
            enumerable: false
        });
    };
    onProgress() {};
    onFinish() {};
    static cancel(state) {};
}

class UploadTask extends Task {
    constructor({
        filePath,
        bucketId,
        fileName,
        folderName
    }) {
        super();

        // init varibles
        this.taskType = TASK_TYPE.UPLOAD;
        this.uploadedBytes = 0;
        this.filePath = filePath;
        this.bucketId = bucketId;
        this.fileName = fileName;
        this.folderName = folderName;

        // start upload
        this.state = storj.storeFile(this.bucketId, this.filePath, {
            filename: this.fileName,
            progressCallback: (...params) => this.onProgress(...params),
            finishedCallback: (...params) => this.onFinish(...params),
        });
    };

    onProgress(progress, uploadedBytes, totalBytes) {
        this.progress = progress;
        this.updated = Date.now();
        this.uploadedBytes = uploadedBytes;
        this.totalBytes = totalBytes;
        this.taskState = TASK_STATE.INPROGRESS;
        this.emit("progress", progress, uploadedBytes, totalBytes);
    };
    onFinish(error) {
        if (error) {
            if (error.message === "File transfer canceled") return;
            this.taskState = TASK_STATE.ERROR;
            this.errorMessage = error.message;
            this.emit("error", error);
            log.error("Upload file error.", this);
        } else {
            this.progress = 1;
            this.taskState = TASK_STATE.SUCCESS;
            this.emit("load");
            log.log("Upload file completed.", this);
        }
    };
    static cancel(state) {
        if (state) storj.storeFileCancel(state);
    };
}

class DownloadTask extends Task {
    constructor({
        bucketId,
        fileId,
        filePath,
        folderName
    }) {
        super();

        // init varibles
        this.taskType = TASK_TYPE.DOWNLOAD;
        this.downloadedBytes = 0;
        this.bucketId = bucketId;
        this.fileId = fileId;
        this.filePath = filePath;
        this.folderName = folderName;

        // start download
        this.state = storj.resolveFile(bucketId, fileId, filePath, {
            overwrite: true,
            progressCallback: (...params) => this.onProgress(...params),
            finishedCallback: (...params) => this.onFinish(...params),
        });
    };

    onProgress(progress, downloadedBytes, totalBytes) {
        this.progress = progress;
        this.updated = Date.now();
        this.downloadedBytes = downloadedBytes;
        this.totalBytes = totalBytes;
        this.taskState = TASK_STATE.INPROGRESS;
        this.emit("progress", progress, downloadedBytes, totalBytes);
    };
    onFinish(error) {
        if (error) {
            if (error.message === "File transfer canceled") return;
            this.taskState = TASK_STATE.ERROR;
            this.errorMessage = error.message;
            this.emit("error", error);
            log.error("Upload file error.", this);
        } else {
            this.progress = 1;
            this.taskState = TASK_STATE.SUCCESS;
            this.emit("load");
        }
    };
    static cancel(state) {
        if (state) storj.resolveFileCancel(state);
    };
}
export {
    Storj,
    Bucket,
    UploadTask,
    DownloadTask,
    mnemonicGenerate,
    mnemonicCheck
}