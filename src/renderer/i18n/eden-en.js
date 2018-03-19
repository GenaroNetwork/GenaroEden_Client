'use strict';

exports.__esModule = true;
exports.default = {
  common: {
    signin: 'Sign In',
    signup: 'Sign Up',
    reset: 'Reset Password',
    usernameholder: 'User Name',
    passwordholder: 'Password',
    inputname: 'Please Enter Username',
    emailerr: 'Incorrect Email Format',
    inputpwd: 'Please Enter Password',
    pwdlength: 'Password length must not be less than 6 characters',
    loginerr: 'Username or Password Error',
    logout: 'Log Out',
    register: 'Register Genaro Account',
    emailholder: 'Your email',
    confirmholder: 'Confirm Your Password',
    newpasswordholder: 'New Password',
    walletpwd: 'Wallet Password',
    newconfirmholder: 'Confirm Your New Password',
    inputpwdagain: 'Please enter your password again',
    newpwdagain: 'New Password Again',
    resetsuccess: 'Reset Success',
    pwdmismatch: 'The two input passwords do not match!',
    activateemail: 'A mail has been sent to <{user}>, please follow the instructions in the email to activate your account before login.',
    registersuccess: 'Register Success',
    registererr: 'Register Error',
    userexist: 'User already exists',
    currentversion: 'Current Version',
    checkupdate: 'Check updates',
    nonewversion: 'latest',
    havenewversion: 'it has new version',
    downloading: 'Downloading',
    downloaded: 'Download successfully',
    downloadfail: 'Download failed',
    lastestversion: 'Lastest Version',
    later: 'Later',
    now: 'Download Now',
    downloadingupdate: 'Downloading new Version update.',
    needrestart: 'Eden need restarting after update downloaded.',
    torestart: 'Restart Eden client to finish updating',
    exittasks: 'Installing update need exit current running tasks.',
    submit: 'Submit',
    next: 'Next',
    delete: 'Delete',
    continue: 'Continue',
    back: 'Back',
    done: 'Done',
    choose: 'Please choose',
    close: 'Close',
    error: 'Error',
    confirm: '确认',
    cancel: '取消',
  },
  dashboard: {
    myfiles: {
      myfiles: 'My Files',
      folder: 'Folders',
      create: 'Create Folder',
      foldername: 'Folder Name',
      folderdelsucc: 'Folder Delete Success',
      delconfirmtitle: 'Confirm Delete Folder: {name}',
      delconfirmmessage: 'All files in folder {name} will be deleted. This action cannot be undone.',
      fileid: 'File ID',
      download: 'Download',
      downloadfile: 'Download File',
      downloadfilesucc: 'File Download Success: {filename}',
      downloadfileerr: 'File Download Error: {errmsg}',
      delete: 'Delete',
      deletefile: 'Delete File',
      filedeled: 'File Deleted',
      filedelerr: 'File Delete Error: {error}',
      upload: 'Upload',
      emptyfilemsg: 'No file in this folder. <br>You can click' +
        '<el-button type="text" @click="upload" size="small">Upload' +
        '<i class="el-icon-upload el-icon--right"></i>' +
        '</el-button> button or drag and drop file here to upload.',
      droptouploadfiles: 'drop to upload your files to {bucketName}',
      defaultpaymsg: 'Please set default payment wallet first.',
      selectfile: 'Please select file first',
      confirmdelmsg1: 'Are you sure to delete selected files',
      confirmdelmsg2: 'Are you sure to delete file: {filename}',
      uploadmsg: 'Only file can be uploaded. {filename} is not a file.',
      fileexist: 'File {filename} is already exists.',
      fileuploading: 'File {fileName} Uploading. You can see this task in Recent panel on the left.',
      fileuploaded: 'File Uploaded: {filePath}',
      fileuploaderr: 'File Upload Failed: {errmsg}',
      viewDetail: 'view detail',
    },
    recent: {
      recent: 'Recent',
      runningtask: 'Running Task',
      history: 'History',
      filename: 'File Name',
      filepath: 'File Path',
      size: 'Size',
      created: 'Created',
      folder: 'Folder',
      tip1: 'No Upload/Download History Yet',
      filenotexist: 'File no more exist. Maybe deleted or moved.',
      foldernotexist: 'Folder {folderName} does not exist.'
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
      recipientaddress: "Recipient Address",
      ETH: 'ETH',
      GNX: 'GNX',
      paylimitGNX: 'Pay limit in GNX',
      maxGNX: 'Max GNX approve',
      setaspay: 'Set As Paying Wallet',
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
      createtransactionerr: 'Transaction Error: {error}',
      copyaddress: 'Copy the Address',
      notransactions: 'No Transactions Yet',
      addresscopied: 'Address Copied to Clipboard'
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
      placeholder1: 'Please Enter the Wallet Password',
      setDeafultCoast: 'Attention：This action will cost few ETH.',
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
  },
  encryption: {
    setkey: 'Set Encryption Key',
    nokey: "I'm a new user and I don't have an Encryption Key, generate now",
    havekey: 'I already have an Encryption Key, go to input',
    regenkey: 'ReGenarate Key',
    genkeystep1: "<h2>Step 1.\
                    <strong>Generate a new Encryption Key</strong>\
                  </h2>\
                  <p>The Encryption Key is used to encrypt/decrypt your files. Once it's lost, so are your files. Please keep it safe and secret!</p>",
    genkeystep2: "<h2>Step 2.\
                    <strong>Confirm Your Encryption Key</strong>\
                  </h2>\
                  <p>Please Retype your encryption key to confirm</p>",
    inputexistingkey: "<h2>\
                        <strong>input existing Encryption Key</strong>\
                      </h2>\
                      <p>Use existing Encryption Key to encrypt/decrypt files.</p>",
    keywrittendown: 'I have written down my Encryption Key, Continue',
    confirmmsg: 'Type your encryption key here to confirm',
    yourkey: 'Your encryption key',
    generrmsg: 'generate wallet error, {errmsg}',
    invalidkey: 'Not a valid Encryption Key',
    keymismatch: 'Your key does not match',
    savekey: 'Save Key'
  }
};