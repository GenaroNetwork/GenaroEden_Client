const {dialog} = require('electron').remote

/* 显示文件保存对话框 */
function showSaveDialog(options, filepathCallback) {
    dialog.showSaveDialog(options,function(res){
        //回调函数内容，此处是将路径内容显示在input框内
        if(res != undefined && res.length > 0) {
            filepathCallback(res)
        }
    })
}

function selectDirectory(callback) {
    return dialog.showOpenDialog({
        properties: ['openDirectory']
    }, callback)
}

export default {
    showSaveDialog,
    selectDirectory
}