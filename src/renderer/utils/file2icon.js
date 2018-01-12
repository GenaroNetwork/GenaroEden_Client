const cachedIcon = {}
function fileName2Icon(name) {
    const suffix = name.split('.').pop().toLowerCase()
    const cached = cachedIcon[suffix]
    if(cached) {
        return cached
    }
    // TODO: check if we can use multikey map to simplify
    const FILEICON = [ {
            suffix: 'pdf',
            icon: 'file-pdf',
            color: '#ff5855'
        }, {
            suffix: 'txt',
            icon: 'file-alt',
            color: '#409EFF'
        }, {
            suffix: 'png,jpg,jpeg,gif,bmp,psd',
            icon: 'file-image',
            color: '#fd7839'
        }, {
            suffix: 'doc,docx',
            icon: 'file-word',
            color: '#409EFF'
        }, {
            suffix: 'ppt,pptx',
            icon: 'file-powerpoint',
            color: '#ff9744'
        }, {
            suffix: 'xls,xlsx',
            icon: 'file-excel',
            color: '#64c422'
        }, {
            suffix: 'zip,7z,rar',
            icon: 'file-archive',
            color: '#5ec8fc'
        }, {
            suffix: 'mp4,avi,mpeg,flv',
            icon: 'file-video',
            color: '#ff5959'
        }, {
            suffix: 'mp3,aac,ape,flac',
            icon: 'file-audio',
            color: '#ff5959'
        }, {
            suffix: 'java,cpp,c,js,py,rb,html,css,json',
            icon: 'file-code',
            color: '#47cdac'
    } ]
    let itemReturn
    FILEICON.forEach(item => {
        if(item.suffix.includes(suffix)) {
            itemReturn = item
            return
        }
    })
    if(!itemReturn) {
        itemReturn = {icon: 'file', color: '#cbd4dc'}
    }
    cachedIcon[suffix] = itemReturn
    return itemReturn
}

export {
    fileName2Icon
}