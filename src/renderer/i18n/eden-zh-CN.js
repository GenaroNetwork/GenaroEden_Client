'use strict';

exports.__esModule = true;
exports.default = {
  common: {
    login: {
      signin: '登录',
      signup: '注册',
      reset: '重置密码',
      usernameholder: '用户名',
      passwordholder: '密码',
      inputname:'请输入用户名',
      emailerr:'邮箱格式错误',
      inputpwd: '请输入密码',
      pwdlength: '密码长度不能少于6位',
      loginerr: '用户名或密码错误',
      logout: '退出'
    },
    dialog: {
      submit: '提交',
      cancel: '取消',
      next: '下一步'
    }
  },
  dashboard: {
    myfiles: {
      myfiles: '我的文件',
      folder: '文件夹',
      create: '新建文件夹',
      foldername: '文件夹名称',
      deleteconfirm: {
        delete: '删除',
        cancel: '取消',
        title: '确定要删除文件夹: {name}', // 翻译时，{name}是调用参数，请保留原样，不要翻译
        message: '文件夹 {name} 中所有文件都会被删除. 文件删除后将无法恢复.' // 翻译时，{name}是调用参数，请保留原样，不要翻译
      },
      fileid: '文件ID',
      download: '下载',
      delete: '删除',
      upload: '上传',
      emptyfilemsg: '空文件夹. <br>点击' + 
                    '<el-button type="text" @click="upload" size="small">上传' +
                      '<i class="el-icon-upload el-icon--right"></i>' +
                    '</el-button> 按钮或拖拽文件到此处上传文件.'
    },
    recent: {
      recent: '操作记录',
      runningtask: '正在进行的任务',
      history: '历史记录',
      filename: '文件名',
      size: '文件大小',
      created: '创建日期',
      folder: '此文件所属文件夹',
      tip1: '无上传/下载记录'
    },
    mywallet: {
      mywallet: '我的钱包',
      account: '账户',
      deposit: '资产',
      transfer: '交易',
      hash: '哈希值',
      block: '区块高度',
      created: '创建时间',
      from: '发出地址',
      to: '接收地址',
      amount: '数量',
      recipientaddress:"接收地址", // the word 'Recippient' is written wrong?
      ETH: 'ETH',
      GNX: 'GNX',
      gasprice: ' 燃料价格 (Gwei)',
      gaspriceholder: '输入Gas',
      gaslimit: '燃料供给上限 (Unit)',
      gaslimitholder: '燃料供给上限',
      sendaddress: '发出地址',
      walletpassword: '钱包密码',
      accounterrmsg: '账户地址错误.',
      amounterrmsg: '发送数量应≤钱包余额.',
      paterrmsg: 'pat 类型错误',
      gaspricemsg: '请输入燃料价格',
      gaspriceerrmsg: '燃料价格最小为 {price}',
      gaslimitmsg: '请输入燃料供给上限',
      gaslimiterrmsg: '燃料供给上限最小为 {limit}',
      recipientmsg: '请输入接收地址',
      amountmsg: '请输入数量',
      transactionsubmitted: '交易已提交',
      createtransactionerr: '交易失败',
      tip1: '复制地址',
      tip2: '尚无交易记录',
      tip3: '地址已复制到剪贴板.'
    },
    walletmanage: {
      walletmanage: '管理我的钱包',
      importwallet: '导入钱包',
      import: '导入{name}', // 翻译时，{name}是调用参数，请保留原样，不要翻译
      uploadjson: '上传JSON文件',
      deletewallet: '删除钱包',
      changepassword: '修改（钱包）密码',
      exportwallet: '导出JSON格式的钱包',
      setdefaultpayment: '设置为默认付款钱包',
      placeholder1: '请输入该钱包的密码.'
    },
    debits: {
        debits: '账单',
        usage: '已使用',
        freestorage: '剩余免费存储空间: {free}/年',
        bonusamount: '新用户奖励： {bonusAmount} GNX',
        updatetime: '最新更新时间',
        pricemsg: '用户首次使用将免费获得25 GB空间一年使用权.详情请阅读资费说明.',
        time: '时间',
        stroagetraffic: '存储 / 带宽占用',
        wallet: '钱包',
        storagefee: '存储费用',
        trafficfee: '带宽费用',
        totalfee: '费用总计'
    },
    sharestorage: {
      sharestorage: '分享我的存储空间',
      tip1: '欢迎使用Genaro sharer分享你的硬盘空间, 分享即可赚取奖励!',
      tip2: '如果你想要分享你的存储空间，请点击\
        <a target="_blank" href="https://www.npmjs.com/package/genaroshare-daemon">此处</a>\
        获取安装文件和Genaro Sharer使用说明.'
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
      language: '语言'
    },
    darwin: {
      about: '关于',
      services: '服务',
      hide: '隐藏',
      hideothers: '隐藏其他',
      showall: '显示所有',
      quit: '退出',
      front: '前端显示'
    }
  }
};