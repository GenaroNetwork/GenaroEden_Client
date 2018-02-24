/* This is the new version of tasklist (include history list and upload list) */
import UUID from "uuid/v1";
import { UploadTask, DownloadTask } from "../../utils/storjApiClient";
import { TASK_TYPE, TASK_STATE } from "../../../config";
import fs from "fs";
import path from "path";
import { setTimeout } from "timers";

import {
    taskListList,
    taskListClear,
    taskListRemove,
    taskListUpdate,
    taskListAppend,
} from "../../utils/dbUtil";

let taskMatch = (savedTask, commitTask) => {
    let result = true;
    Object.keys(commitTask).every(key => {
        if (savedTask[key] === commitTask[key]) return true;
        result = false;
        return false;
    });
    return result;
}

let state = {
    tasks: []
}

let getters = {
    task: state => {
        return (commitTask) => {
            return state.tasks.find(savedTask => taskMatch(savedTask, commitTask));
        }
    }
}

let mutations = {
    taskListLoad(state) {
        let tasks = taskListList() || [];
        state.tasks = [];
        tasks.forEach(task => {
            state.tasks.push(Object.assign({}, task));
        });
    },

    taskListAppend(state, commitTask) {
        taskListAppend(commitTask);
        state.tasks.push(Object.assign({}, commitTask));
    },

    taskListUpdate(state, commitTask) {
        taskListUpdate(commitTask);
        let savedTask = state.tasks.find(task => task.taskId === commitTask.taskId);
        Object.entries(commitTask).forEach(([key, value]) => {
            if (key === "taskId") return;
            if (typeof value === "object") return;
            if (key === "progress") {
                savedTask[key] = savedTask[key] > value ? savedTask[key] : value;
                return;
            }
            savedTask[key] = value;
        });
    },

    taskListRemove(state, commitTask) {
        taskListRemove(commitTask);
        let taskIndex = state.tasks.findIndex(task => taskMatch(task, commitTask));
        state.tasks.splice(taskIndex, 1);
    },

    taskListClear(state) {
        taskListClear();
        state.tasks = [];
    }
}

let actions = {
    taskListUpload({ commit, dispatch }, { filePath, bucketId, folderName }) {
        let fileName = path.basename(filePath);
        return new Promise((resolve, reject) => {
            let task = new UploadTask({ filePath, bucketId, fileName, folderName });
            commit("taskListAppend", task);
            task.on("progress", () => {
                commit("taskListUpdate", task);
            });
            task.on("load", () => {
                commit("taskListUpdate", task);
                dispatch("fileListLoadFile");
                resolve(task);
            });
            task.on("error", err => {
                commit("taskListUpdate", task);
                reject(err);
            });
        });
    },

    taskListDownload({ commit }, { bucketId, fileId, filePath, folderName }) {
        return new Promise((resolve, reject) => {
            let task = new DownloadTask({ bucketId, fileId, filePath, folderName });
            commit("taskListAppend", task);
            task.on("progress", err => {
                commit("taskListUpdate", task);
            });
            task.on("load", () => {
                commit("taskListUpdate", task);
                resolve(task);
            });
            task.on("error", err => {
                commit("taskListUpdate", task);
                reject(err);
            });
        });
    },

    taskListCancel({ commit, getters }, { taskId }) {
        let savedTask = getters.task({ taskId });
        switch (savedTask.taskType) {
            case TASK_TYPE.UPLOAD:
                UploadTask.cancel(savedTask.state);
                break;
            case TASK_TYPE.DOWNLOAD:
                DownloadTask.cancel(savedTask.state);
                break;
        }
        commit("taskListUpdate", {
            taskId,
            task: null,
            taskState: TASK_STATE.CANCEL,
        });
    }

}

export default {
    state,
    mutations,
    actions,
    getters,
}