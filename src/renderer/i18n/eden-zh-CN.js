'use strict';

exports.__esModule = true;
exports.default = {
  common: {
    signin: '登录',
    signup: '注册',
    reset: '重置密码',
    usernameholder: '用户名',
    passwordholder: '密码',
    inputname: '请输入用户名',
    emailerr: '邮箱格式错误',
    inputpwd: '请输入密码',
    pwdlength: '密码长度不能少于6位',
    loginerr: '用户名或密码错误',
    logout: '退出',
    register: '注册Genaro账号',
    emailholder: '邮件地址',
    confirmholder: '请确认密码',
    newpasswordholder: '新密码',
    walletpwd: '钱包密码',
    newconfirmholder: '确认新密码',
    inputpwdagain: '请再次输入您的密码',
    newpwdagain: '再次输入新密码',
    resetsuccess: '重置成功',
    pwdmismatch: '两次输入的密码不一致!',
    activateemail: '已向<{user}>发送了一封邮件,请根据邮件中的步骤激活您的账户，并重新登录.',
    agreeagreement1: '我同意',
    agreeagreement2: '《Genaro Eden 用户使用协议》',
    registersuccess: '注册成功',
    registererr: '注册失败',
    userexist: '用户名已被占用',
    currentversion: '当前版本',
    checkupdate: '新版本检测',
    nonewversion: '已是最新',
    havenewversion: '有新版本',
    downloading: '正在下载',
    downloaded: '下载完成',
    downloadfail: '下载失败',
    lastestversion: '最新版本',
    later: '稍后',
    now: '立即下载',
    downloadingupdate: '正在下载更新。',
    needrestart: '下载完成后需重启 Eden 客户端安装.',
    torestart: '重启客户端完成更新',
    exittasks: '安装更新需要退出当前任务',
    submit: '提交',
    next: '下一步',
    delete: '删除',
    continue: '继续',
    back: '返回',
    done: '完成',
    choose: '请选择',
    close: '关闭',
    error: '错误',
    confirm: '确认',
    cancel: '取消',
  },
  dashboard: {
    myfiles: {
      myfiles: '我的文件',
      folder: '文件夹',
      create: '新建文件夹',
      foldername: '文件夹名称',
      folderdelsucc: '文件夹成功删除',
      delconfirmtitle: '确定要删除文件夹: {name}',
      delconfirmmessage: '文件夹 {name} 中所有文件都会被删除. 文件删除后将无法恢复.',
      fileid: '文件ID',
      download: '下载',
      downloadfile: '下载文件',
      downloadfilesucc: '文件: {filename}下载完成',
      downloadfileerr: '文件下载出错: {errmsg}',
      delete: '删除',
      deletefile: '删除文件',
      filedeled: '文件已删除',
      filedelerr: '文件删除出错: {error}',
      upload: '上传',
      emptyfilemsg: '空文件夹. <br>点击' +
        '<el-button type="text" @click="upload" size="small">上传' +
        '<i class="el-icon-upload el-icon--right"></i>' +
        '</el-button> 按钮或拖拽文件到此处上传文件.',
      droptouploadfiles: '拖拽文件上传到{bucketName}',
      defaultpaymsg: '请先设置默认的支付钱包.',
      selectfile: '请先选择文件',
      confirmdelmsg1: '确定删除选定的文件吗',
      confirmdelmsg2: '确定删除文件: {filename}',
      uploadmsg: '仅支持上传文件. {filename}并不是一个文件.',
      fileexist: '文件{filename}已存在.',
      fileuploading: '文件{fileName}正在上传中. 你可以在左侧的最近任务面板中查看该任务的状态.',
      fileuploaded: '文件已上传至: {filePath}',
      fileuploaderr: '文件上传失败: {errmsg}',
      viewDetail: '查看详情',
    },
    recent: {
      recent: '操作记录',
      runningtask: '正在进行的任务',
      history: '历史记录',
      filename: '文件名',
      filepath: 'File Path',
      size: '文件大小',
      created: '创建日期',
      folder: '此文件所属文件夹',
      tip1: '无上传/下载记录',
      filenotexist: '文件不存在，可能已被删除或移动.',
      foldernotexist: '文件夹{folderName}不存在.'
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
      recipientaddress: "接收地址",
      ETH: 'ETH',
      GNX: 'GNX',
      paylimitGNX: 'GNX付款限额',
      maxGNX: '允许的最大GNX',
      setaspay: '设置为付款钱包',
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
      createtransactionerr: '交易失败: {error}',
      copyaddress: '复制地址',
      notransactions: '尚无交易记录',
      addresscopied: '地址已复制到剪贴板.',
      qrcode: '钱包二维码'
    },
    walletmanage: {
      walletmanage: '管理我的钱包',
      importwallet: '导入钱包',
      import: '导入{name}',
      uploadjson: '上传JSON文件',
      deletewallet: '删除钱包',
      changepassword: '修改（钱包）密码',
      exportwallet: '导出JSON格式的钱包',
      setdefaultpayment: '设置为默认付款钱包',
      placeholder1: '请输入该钱包的密码.',
      setDeafultCoast: '注意：设置默认钱包需要花费一些ETH',
    },
    debits: {
      debits: '账单',
      usage: '已使用',
      freestorage: '剩余免费存储空间: {free}/年',
      bonusamount: '新用户奖励： {bonusAmount} GNX',
      updatetime: '最新更新时间',
      pricemsg: '用户首次使用将免费获得25 GB空间一年使用权.',
      time: '时间',
      storagetraffic: '存储 / 带宽占用',
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
      redo: '重做',
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
      learnmore: '更多',
      tutorial: '使用说明',
      agreement: '用户协议',
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
  },
  encryption: {
    setkey: '设置密钥',
    nokey: "我是新用户，没有密钥.立即生成密钥.",
    havekey: '我已有Genaro Eden密钥，输入密钥',
    regenkey: '重新生成密钥',
    genkeystep1: "<h2>步骤1.\
                    <strong>生成新密钥</strong>\
                  </h2>\
                  <p>密钥是用来对你的文件进行加密和解密的.密钥一旦丢失，你的所有文件也将丢失.请务必保证密钥安全并注意保密!</p>",
    genkeystep2: "<h2>步骤2.\
                    <strong>确认你的密钥</strong>\
                  </h2>\
                  <p>请再次输入你的密钥以确认</p>",
    inputexistingkey: "<h2>\
                        <strong>输入已有的密钥</strong>\
                      </h2>\
                      <p>使用已有的密钥来对文件进行加密和解密.</p>",
    keywrittendown: '我已确认记下我的密钥, 继续下一步',
    confirmmsg: '在此输入你的密钥以确认',
    yourkey: '你的密钥',
    generrmsg: '产生密钥出错: {errmsg}',
    invalidkey: '不是一个有效的密钥',
    keymismatch: '你的密钥不匹配',
    savekey: '保存密钥'
  }
};