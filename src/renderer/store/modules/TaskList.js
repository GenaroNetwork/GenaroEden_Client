/* This is the new version of tasklist (include history list and upload list) */
import {
    taskListList,
    taskListClear,
    taskListRemove,
    taskListUpdate,
    taskListAppend,
} from "../../utils/Dbutil";

let state = {
    tasks: []
}

let getters = {
    task: state => {
        return (commitTask) => {
            let taskId;
            if (typeof commitTask === "object") taskId = commitTask.taskId;
            else taskId = commitTask;
            return state.tasks.find(task => taskId === commitTask.taskId);
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
        let oldTask = state.tasks.find(task => task.taskId === commitTask.taskId);
        Object.keys(commitTask).forEach(key => {
            if (key === "taskId") return;
            oldTask[key] = commitTask;
        });
    },

    taskListRemove(state, taskId) {
        let index = state.tasks.findIndex(task => taskId === task.taskId);
        state.tasks.splice(index, 1);
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
        taskListAppend(commitTask);
        commit("taskListAppend", commitTask);
    },
    taskListUpdate({ commit }, commitTask) {
        taskListUpdate(commitTask);
        commit("taskListUpdate", commitTask);
    },
    taskListRemove({ commit }, taskId) {
        taskListRemove(taskId);
        commit("taskListRemove", taskId);
    },
    taskListClear({ commit }, commitTask) {
        taskListClear();
        commit("taskListClear");
    },
}

export default {
    state,
    mutations,
    actions,
    getters,
}