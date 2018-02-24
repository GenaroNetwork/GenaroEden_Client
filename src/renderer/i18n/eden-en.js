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
      inputname:'Please Enter Username',
      emailerr:'Incorrect Email Format',
      inputpwd: 'Please Enter Password',
      pwdlength: 'Password length must not be less than 6 characters',
      loginerr: 'Username or Password Error',
      logout: 'Log Out'
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
        message: 'All files in folder {name} will be deleted. This action cannot be undone.'
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
      tip1: 'No Upload/Download History Yet'
    },
    mywallet: {
      mywallet: 'My Wallet',
      account: 'Account',
      deposit: 'Deposit',
      transfer: 'Transfer',
      hash: 'Hash',
      block: 'Block',
      created: 'Created',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      recipientaddress:"Recipient Address", 
      ETH: 'ETH',
      GNX: 'GNX',
      gasprice: 'Gas Price (Gwei)',
      gaspriceholder: 'Gas',
      gaslimit: 'Gas Limit (Unit)',
      gaslimitholder: 'Gas Limit',
      sendaddress: 'Sent Address',
      walletpassword: 'Wallet Password',
      accounterrmsg: 'Incorrect Account Address',
      amounterrmsg: 'Amount must be less than or equal to balance',
      paterrmsg: 'Incorrect pat Type',
      gaspricemsg: 'Please Enter Gas Price',
      gaspriceerrmsg: 'Gas price should be greater than or equal to {price}',
      gaslimitmsg: 'Please Enter Gas Limit',
      gaslimiterrmsg: 'Gas limit should be greater than or equal to {limit}',
      recipientmsg: 'Please Input Recipient',
      amountmsg: 'Please Input Amount',
      transactionsubmitted: 'Transaction Submitted',
      createtransactionerr: 'Transaction Error',
      tip1: 'Copy the Address',
      tip2: 'No Transactions Yet',
      tip3: 'Address Copied to Clipboard'
    },
    walletmanage: {
      walletmanage: 'Manage Wallet',
      importwallet: 'Import Wallet',
      import: 'Import{name}',
      uploadjson: 'Upload JSON File',
      deletewallet: 'Delete Wallet',
      changepassword: 'Change password (of wallet)',
      exportwallet: 'Export wallet as JSON',
      setdefaultpayment: 'Set as Default Payment',
      placeholder1: 'Please Enter the Wallet Password'
    },
    debits: {
        debits: 'Debits',
        usage: 'Used',
        freestorage: 'Free storage: {free}/Year',
        bonusamount: 'New user bandwidth： {bonusAmount} GNX',
        updatetime: 'Last update',
        pricemsg: '25GB free storage is available during the first year. Please see billing instructions here.',
        time: 'Time',
        storagetraffic: 'Storage/Traffic Used',
        wallet: 'Wallet',
        storagefee: 'Storage Fee',
        trafficfee: 'Traffic Fee',
        totalfee: 'Total Fee'
    },
    sharestorage: {
      sharestorage: 'Share My Storage',
      tip1: 'Genaro Sharer is live! Join us and earn rewards!',
      tip2: 'If you want to share your storage space please click\
        <a target="_blank" href="https://www.npmjs.com/package/genaroshare-daemon">this link</a>\
        for a detailed explanation on how to install and run Genaro Sharer.'
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
    },
    darwin: {
      about: 'About',
      services: 'Services',
      hide: 'Hide',
      hideothers: 'Hide Others',
      showall: 'Show All',
      quit: 'Quit',
      front: 'Bring All to Front'
    }
  }
};