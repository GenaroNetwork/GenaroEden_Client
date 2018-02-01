import stroj from "./storjApiClient";
import fs from "fs";
import path from "path";
import events from "events";
import { setTimeout } from "timers";

let fileUpload = async (filePath, bucketId, folderName) => {
    let fileName = path.basename(filePath);
    let stats = fs.statSync(filePath);
    let fileSize = stats.size;
    let event = new events;

    let task;
    task = stroj.uploadFile(filePath, fileName, bucketId,
        (...params) => {
            event.emit("error", task, ...params);
        },
        (...params) => {
            event.emit("success", task, ...params);
        },
        (...params) => {
            event.emit("progress", task, ...params);
        },
    );

    setTimeout(() => {
        event.emit("init", task);
    }, 0);

    return event;
}

export {
    fileUpload,
}