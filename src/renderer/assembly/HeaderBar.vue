<style scoped lang="less">
@import "../cssConfig/color.less";
.layout-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.dropItem {
  margin-left: 20px;
}

.el-dropdown-link {
  cursor: pointer;
}
.logo {
  flex-grow: 1;
  padding: 0 0 0 12px;
  height: 44px;
}
.logo img {
  height: 100%;
}
.demo-avatar-badge {
  padding-right: 12px;
}
.logout {
  text-align: right;
}
.api {
  padding: 15px;
}
.popover {
  margin: -12px;
  & > div {
    & > div {
      line-height: 50px;
      padding: 0 12px;
      border-bottom: 1px solid #e8e8e8;
      &:last-of-type {
        border-bottom: none;
      }
      span {
        float: right;
      }
      &.new-version-check {
        cursor: pointer;
        .avalible {
          display: block;
          height: 6px;
          width: 6px;
          background: @error;
          border-radius: 50%;
          margin: 22px 0;
        }
      }
    }
  }
}
</style>

<template>
    <div class="layout-header">
        <!-- popover -->
        <el-popover ref="popover" placement="bottom" width="250" trigger="click" @show="pulldownStep=0" v-model="pulldownShown">
            <div class="popover">
                <div v-if="pulldownStep===0" @click="updateState ? pulldownStep = updateState : checkUpdate()">
                    <div>当前版本
                        <span style="float: right;">{{ version }}</span>
                    </div>
                    <div class="new-version-check">新版本检测
                        <span v-if="updateState===1">有新版本</span>
                        <span v-else-if="updateState===2">正在下载</span>
                        <span v-else-if="updateState===3">下载完成</span>
                        <span v-else-if="updateState===4">下载失败</span>
                    </div>
                    <div>
                        <el-button type="text" @click="logout">{{ $t('common.login.logout') }}</el-button>
                    </div>
                </div>
                <div v-else-if="pulldownStep===1">
                    <div>最新版本
                        <span>{{ latest.version }}</span>
                    </div>
                    <div style="white-space: pre-wrap;">{{ latest.notes }}</div>
                    <div>
                        <el-button type="text" @click="pulldownShown = false">稍后</el-button>
                        <el-button type="text" @click="downloadNow()">立即更新</el-button>
                    </div>
                </div>
                <div v-else-if="pulldownStep===2">
                    <div>正在下载</div>
                    <div>
                        <div v-loading="true">正在下载更新。</div>
                        <div>
                            下载完成后需重启 Eden 客户端安装.
                        </div>
                    </div>
                </div>
                <div v-else-if="pulldownStep===3">
                    <div>下载完成</div>
                    <div>
                        重启客户端完成更新
                    </div>
                    <div>
                        <el-button type="text" @click="pulldownShown = false">稍后</el-button>
                        <el-button type="text" @click="installNow()">立即重启</el-button>
                    </div>
                </div>
                <div v-else-if="pulldownStep===4" style="text-align:  center;">
                    <div>
                        <div>安装更新需要退出当前任务</div>
                    </div>
                    <div>
                        <el-button type="text" @click="pulldownShown = false">确定</el-button>
                    </div>
                </div>
            </div>
        </el-popover>

        <div class="logo">
            <img shape="circle" src="~@/assets/img/logo_words.png">
        </div>

        <div class="demo-avatar-badge">
            <span class="el-dropdown-link" v-popover:popover>
                {{username}}
                <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
        </div>
    </div>
</template>
<script>
import StorageUsage from '@/assembly/StorageUsage'
import { stepReady } from "../utils/guide"
import { deleteCredentials } from '../utils/dbUtil'
import walletManager from "../../wallet/walletManager";
import { ipcRenderer } from "electron";
import { remote } from "electron";
import { AUTO_UPLOAD_URL, TASK_STATE } from "../../config";
import { setInterval } from 'timers';
let feedURL = `${AUTO_UPLOAD_URL}?v=${remote.app.getVersion()}`;


export default {
    data() {
        return {
            // 0: didn't checked || no new version
            // 1: new version avalible
            // 2: downloading
            // 3: downloaded
            // 4: error 
            updateState: 0,
            pulldownShown: false,
            pulldownStep: 0,
            latest: {
                version: null,
                notes: null,
            }
        };
    },
    methods: {
        async logout() {
            await this.$confirm('确定退出客户端?', '提示', {
                confirmButtonText: '退出',
                cancelButtonText: '取消',
                type: 'warning'
            });
            await deleteCredentials();
            await walletManager.clearWallets();
            this.$router.push({ path: '/' });
        },
        async checkUpdate() {
            if (this.updateState === 2 || this.updateState === 3) return;
            let response = await this.$http.get(feedURL);
            let data = response.data;
            this.updateState = 0;
            if (!data || !data.version) return;
            let latestVersion = data.version;
            let lv = latestVersion.split(".");
            let currentVersion = remote.app.getVersion();
            let cv = currentVersion.split(".");
            let isLatest = true;
            cv.every((v, i) => {
                if (v > lv[i]) return false;
                if (v === lv[i]) return true;
                isLatest = false;
                return false;
            });
            if (isLatest) return;


            this.updateState = 1;
            this.latest.version = data.version;
            this.latest.notes = data.notes;
            ;
        },
        downloadNow() {
            this.updateState = 2;
            this.pulldownStep = 2;
            remote.autoUpdater.setFeedURL(feedURL);
            remote.autoUpdater.checkForUpdates();
            /*
            let loading = () => {
                if (this.percentageSaved >= 100) return;
                this.percentageSaved += (100 - this.percentageSaved) * 0.03;
                setTimeout(loading, 1000);
            };
            loading();
            */
            remote.autoUpdater.on("update-downloaded", () => this.downloaded());
        },
        downloaded() {
            this.updateState = 3
            if (this.pulldownShown && this.pulldownStep === 2) this.pulldownStep = 3;
            else this.$notify({
                title: '下载完成',
                dangerouslyUseHTMLString: true,
                showClose: false,
                message: `是否立即重启应用完成更新?
                <div style="margin-top: 10px;">
                <div data-action="ignore" style="width: 75px; float: left; height: 30px; line-height: 30px; cursor: pointer;">稍后</div>
                <div data-action="confirm" style="width: 75px; float: left; height: 30px; line-height: 30px; cursor: pointer;">立即重启</div>
                <div>
                `,
                onClick: () => {
                    let action = event.target.dataset.action;
                    if (!action) return;
                    if (action === "ignore") {
                        console.log(this.$notify);
                        debugger;
                        this.$notify.closeAll();
                    } else {
                        this.installNow();
                    }
                },
                duration: 0
            });
        },
        installNow() {
            let runningtasks = this.$store.state.TaskList.tasks.filter(task => task.taskState === TASK_STATE.INPROGRESS).length;
            if (runningtasks > 0) this.pulldownStep = 4;
            else remote.autoUpdater.quitAndInstall();
        },
    },
    components: {
        StorageUsage
    },
    computed: {
        username() {
            return this.$store.state.User.username;
        },
        version() {
            return remote.app.getVersion();
        },
    },
    async mounted() {
        stepReady('account-info');
        this.checkUpdate();
        setInterval(this.checkUpdate, 1000 * 3600);
    },
}
</script>
