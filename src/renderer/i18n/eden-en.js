'use strict';

exports.__esModule = true;
exports.default = {
  common: {
    login: {
      signin: 'Sign In',
      signup: 'Sign Up',
      reset: 'Reset Password',
      usernameholder: 'User Name',
      passwordholder: 'Password',
      inputname:'Please input username',
      emailerr:'Incorrect email format',
      inputpwd: 'Please input password',
      pwdlength: 'Password length must not be less than 6 bits',
      loginerr: 'Username Or Password Error',
      logout: 'logout'
    },
    dialog: {
      submit: 'Submit',
      cancel: 'Cancel',
      next: 'Next'
    }
  },
  dashboard: {
    myfiles: {
      myfiles: 'My Files',
      folder: 'Folders',
      create: 'Create Folder',
      foldername: 'Folder Name',
      deleteconfirm: {
        delete: 'Delete',
        cancel: 'Cancel',
        title: 'Confirm Delete Folder: {name}',
        message: 'All your files in folder {name} will be deleted. This action cannot be undone.'
      },
      fileid: 'File ID',
      download: 'Download',
      delete: 'Delete',
      upload: 'Upload',
      emptyfilemsg: 'No file in this folder. <br>You can click' + 
                    '<el-button type="text" @click="upload" size="small">Upload' +
                      '<i class="el-icon-upload el-icon--right"></i>' +
                    '</el-button> button or drag and drop file here to upload.'
    },
    recent: {
      recent: 'Recent',
      runningtask: 'Running Task',
      history: 'History',
      filename: 'File Name',
      size: 'Size',
      created: 'Created',
      folder: 'Folder',
      tip1: 'No upload/download history yet'
    },
    mywallet: {
      mywallet: 'My Wallet',
      account: 'Acount',
      deposit: 'Deposit',
      transfer: 'Transfer',
      hash: 'Hash',
      block: 'Block',
      created: 'Created',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      recipientaddress:"Recippient Address", // the word 'Recippient' is written wrong?
      ETH: 'ETH',
      GNX: 'GNX',
      gasprice: 'gas price (Gwei)',
      gaspriceholder: 'Gas',
      gaslimit: 'gas limit (Unit)',
      gaslimitholder: 'Gas Limit',
      sendaddress: 'Sent Address',
      walletpassword: 'Wallet Password',
      accounterrmsg: 'Incorrect account address.',
      amounterrmsg: 'Amount must less than balance.',
      paterrmsg: 'Incorrect pat type',
      gaspricemsg: 'Please input gasPrice',
      gaspriceerrmsg: 'gas price should greater than {price}',
      gaslimitmsg: 'Please input gasLimit',
      gaslimiterrmsg: 'gas limit should greater than {limit}',
      recipientmsg: 'Please input recipient',
      amountmsg: 'Please input amount',
      transactionsubmitted: 'transaction submitted',
      createtransactionerr: 'create transaction error',
      tip1: 'Copy The Address',
      tip2: 'No Transactions yet',
      tip3: 'Address Copied to ClipBoard.'
    },
    walletmanage: {
      walletmanage: 'Wallet Manage',
      importwallet: 'Import Wallet',
      import: 'Import{name}',
      uploadjson: 'Upload JSON File',
      deletewallet: 'Delete wallet',
      changepassword: 'Change password (of wallet)',
      exportwallet: 'Export wallet as json',
      setdefaultpayment: 'Set as default payment',
      placeholder1: 'please input the password of wallet file.'
    },
    debits: {
        debits: 'Debits',
        usage: 'Used',
        freestorage: 'Free storage: {free}/Year',
        bonusamount: 'New user bandwidth： {bonusAmount} GNX',
        updatetime: 'Last update',
        pricemsg: 'Free 25GB storage is available during the first year, please see billing instructions here',
        time: 'Time',
        stroagetraffic: 'Storage/Traffic Used',
        wallet: 'Wallet',
        storagefee: 'Storage Fee',
        trafficfee: 'Traffic Fee',
        totalfee: 'Total Fee'
    },
    sharestorage: {
      sharestorage: 'Share My Storage',
      tip1: 'Genaro Sharer is alive, join us and earn reward!',
      tip2: 'If you want to share your storage space please click\
        <a target="_blank" href="https://www.npmjs.com/package/genaroshare-daemon">this link</a>\
        for a detailed explanation how to install and run Genaro Sharer.'
    }
  },
  menu: {
    edit: {
      edit: 'Edit',
      undo: 'Undo',
      redo: 'Redo',
      cut: 'Cut',
      copy: 'Copy',
      paste: 'Paste',
      selectall: 'Select All'
    },
    view: {
      view: 'View',
      togglefullscreen: 'Toggle Full Screen',
      toggledevelopertools: 'Toggle Developer Tools'
    },
    window: {
      window: 'Window',
      minimize: 'Minimize',
      close: 'Close'
    },
    help: {
      help: 'Help',
      learnmore: 'Learn More'
    },
    language: {
      language: 'Language'
    }
  }
};