'use strict';

exports.__esModule = true;
exports.default = {
  common: {
    login: {
      signin: '登录',
      signup: '注册',
      reset: '重置密码',
      inputname:'请输入用户名',
      emailerr:'邮箱格式错误',
      inputpwd: '请输入密码',
      pwdlength: '密码长度不能少于6个字节',
      loginerr: '用户名或密码错误',
      logout: '退出'
    },
    dialog: {
      submit: '提交',
      cancel: '取消'
    }
  },
  dashboard: {
    myfiles: {
      myfiles: '我的文件',
      folder: '文件夹',
      create: '新建文件夹',
      foldername: '文件夹名',
      deleteconfirm: {
        delete: '删除',
        cancel: '取消',
        title: '确定要删除文件夹: {name}', // 翻译时，{name}是调用参数，请保留原样，不要翻译
        message: '文件夹 {name} 中所有文件都会被删除. 删除后无法恢复.' // 翻译时，{name}是调用参数，请保留原样，不要翻译
      }
    },
    recent: {
      recent: '足迹',
      runningtask: '正在运行的任务',
      history: '历史',
      filename: '文件名',
      size: '文件大小',
      created: '创建日期',
      folder: '文件夹',
      tip1: '无上传/下载历史记录'
    },
    mywallet: {
      mywallet: '我的钱包',
      account: '账户',
      deposit: '资产',
      transfer: '交易',
      hash: 'Hash',
      block: '块',
      created: '创建人',
      from: '来源',
      to: '目的',
      amount: '数量',
      tip1: '复制地址',
      tip2: '尚无交易',
      tip3: '地址已复制到剪切板.'
    },
    walletmanage: {
      walletmanage: '管理我的钱包',
      importwallet: '导入钱包',
      import: '导入{name}', // 翻译时，{name}是调用参数，请保留原样，不要翻译
      uploadjson: '上传JSON文件',
      deletewallet: '删除钱包',
      changepassword: '修改（钱包）密码',
      exportwallet: '导出json格式的钱包',
      setdefaultpayment: '设置为默认付款钱包',
      placeholder1: '请输入该钱包文件的密码.'
    },
    debits: {
        debits: '账单',
        usage: '已使用: {used}{formatSize} / 免费存储: {total} (年)'
    },
    sharestorage: {
      sharestorage: '分享我的硬盘',
      tip1: '欢迎使用Genaro分享你的存储空间, 加入我们并赚取佣金!',
      tip2: '如果你想要分享你的存储空间，请点击\
        <a target="_blank" href="https://www.npmjs.com/package/genaroshare-daemon">此处</a>\
        查看安装和运行Genaro Sharer的详细说明.'
    }
  },
  menu: {
    edit: {
      edit: '编辑',
      undo: '撤消',
      redo: 'Redo',
      cut: '剪切',
      copy: '复制',
      paste: '粘贴',
      selectall: '全选'
    },
    view: {
      view: '视图',
      togglefullscreen: '全屏',
      toggledevelopertools: '开发者工具'
    },
    window: {
      window: '窗口',
      minimize: '最小化',
      close: '关闭'
    },
    help: {
      help: '帮助',
      learnmore: '更多'
    },
    language: {
      language: '多语言'
    }
  }
};