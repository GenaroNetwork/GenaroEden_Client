<script type="text/javascript">
import iView from 'iview'

/* 显示错误Notice */
function showErrNotice(noticeArgs) {
    iView.Notice.error({
        title: '<b>' + noticeArgs.title + '</b>',
        desc: noticeArgs.desc + ' <br>Error: ' + noticeArgs.err,
        duration: noticeArgs.duration
    })
}

/* 显示成功Notice */
function showSuccessNotice(noticeArgs) {
    iView.Notice.success({
        title: '<b>' + noticeArgs.title + '</b>',
        desc: noticeArgs.desc,
        duration: noticeArgs.duration
    });
}

/* 显示警告alert */
function showWarnAlert(content) {
    iView.Modal.warning({
        title: 'WARN',
        content: content
    });
}

export default {
    showErrNotice,
    showSuccessNotice,
    showWarnAlert
}
</script>