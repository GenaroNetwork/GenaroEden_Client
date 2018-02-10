<style lang="less">
.header {
  padding: 20px 30px;
  & > div {
    height: 15px;
    line-height: 15px;
    margin: 0 0 5px;
  }
  .info {
    font-size: 13px;
    margin-bottom: 5px;
    width: 500px;
    .bonus {
      float: right;
    }
  }
  .progress-bar {
    width: 500px;
    background: #dee1e9;
    height: 15px;
    border-radius: 15px;
    position: relative;
    .usage {
      background: #88c657;
      height: 100%;
      border-radius: inherit;
    }
    .usage-over {
      background: #60a8f7;
      height: 100%;
      border-radius: 0 15px 15px 0;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .tips {
    color: #777;
    font-size: 12px;
  }
}
</style>


<template>
    <div>
        <div class="header">
            <div class="info">
                <span>usage: {{ usage | formatSize }} / free storage: 25 GB (Year)</span>
                <span class="bonus">Bonus amount： {{ bonusAmount }} GNX</span>
            </div>
            <div class="progress-bar">
                <div class="usage" :style="{width: latestUsage.usage + '%'}"></div>
                <div class="usage-over" :style="{width: latestUsage.usageOver + '%'}"></div>
            </div>
            <div class="tips">
                Update time: {{ updateTime }}
            </div>
            <div class="tips">
                <li>GNX first time users will be given 25 GB for a year.Click to view the Charges instructions.
                </li>
            </div>
        </div>
        <div class="main">
            <el-table :data="debits">
                <el-table-column type="expand" width="60px">
                    <template slot-scope="data">{{ data.row.created | formatTime}}</template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="data">{{ data.row.created | formatTime}}</template>
                </el-table-column>
                <el-table-column label="Time" width="200px">
                    <template slot-scope="data">{{ data.row.created | formatTime}}</template>
                </el-table-column>
                <el-table-column label="Stroage / Bandwidth">
                    <template slot-scope="data">{{ data.row.storage | formatSize}} / {{ data.row.bandwidth | formatSize}}</template>
                </el-table-column>
                <el-table-column label="Amount" prop="amount"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { BRIDGE_API_URL } from "../../../config";
import storj from 'storj-lib';

export default {
    data() {
        return {
            usage: 0,
            bonusAmount: 5.2,
            updateTime: 123,
            debits: [],
            latestUsage: {
                usage: 0,
                usageOver: 0,
            }
        };
    },
    async created() {
        let debits = await this.$http.get(`${BRIDGE_API_URL}/debits/${this.$store.state.User.username}`, {
            auth: {
                username: this.$store.state.User.username,
                password: storj.utils.sha256(this.$store.state.User.password),
            }
        });
        this.debits = debits.data;
    },
}
</script>
