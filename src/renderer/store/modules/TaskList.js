/* This is the new version of tasklist (include history list and upload list) */
import UUID from "uuid/v1";
import stroj from "../../utils/storjApiClient";
import fs from "fs";
import path from "path";
import events from "events";
import { setTimeout } from "timers";

import {
    taskListList,
    taskListClear,
    taskListRemove,
    taskListUpdate,
    taskListAppend,
} from "../../utils/dbutil";

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
    taskListInit(state, tasks) {
        state.tasks = tasks;
    },

    taskListAppend(state, commitTask) {
        state.tasks.push(Object.assign({}, commitTask));
    },

    taskListUpdate(state, commitTask) {
        let savedTask = state.tasks.find(savedTask => taskMatch(savedTask, commitTask));
        Object.keys(commitTask).forEach(key => {
            if (key === "taskId") return;
            savedTask[key] = commitTask;
        });
    },

    taskListRemove(state, commitTask) {
        let taskIndex = state.tasks.findIndex(savedTask => taskMatch(savedTask, commitTask));
        state.tasks.splice(taskIndex, 1);
    },

    taskListClear(state) {
        state.tasks = [];
    }
}

let actions = {
    taskListLoadFromDb({ commit }) {
        let tasks = taskListList() || [];
        commit("taskListInit", tasks);
    },
    taskListAppend({ commit }, commitTask) {
        commitTask.UUID = UUID();
        taskListAppend(commitTask);
        commit("taskListAppend", commitTask);
    },
    taskListUpdate({ commit }, commitTask) {
        taskListUpdate(commitTask);
        commit("taskListUpdate", commitTask);
    },
    taskListRemove({ commit }, commitTask) {
        taskListRemove(commitTask);
        commit("taskListRemove", commitTask);
    },
    taskListClear({ commit }, commitTask) {
        taskListClear();
        commit("taskListClear");
    },
    fileUpload({ commit, dispatch }, { filePath, bucketId, folderName }) {
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
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
}