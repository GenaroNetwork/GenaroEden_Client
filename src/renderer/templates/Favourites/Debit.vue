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

.main {
  .pager {
    margin: 40px 0 25px;
    text-align: center;
  }
}
</style>


<template>
    <div>
        <div class="header">
            <div class="info">
                <span>Used: {{ usage | formatSize }} / Free storage: 25 GB/year</span>
                <span class="bonus">New user bandwidth: {{ bonusAmount }} GNX</span>
            </div>
            <div class="progress-bar">
                <div class="usage" :style="{width: latestUsage.usage + '%'}"></div>
                <div class="usage-over" :style="{width: latestUsage.usageOver + '%'}"></div>
            </div>
            <div class="tips">
                Last update: {{ updateTime }}
            </div>
            <div class="tips">
                <li>Free 25GB storage is available during the first year, please see billing instructions here
                </li>
            </div>
        </div>
        <div class="main">
            <el-table :data="debits.data">
                <el-table-column type="expand" width="60px">
                    <template slot-scope="data">
                        <el-table :data="data">
                            <el-table-column type="expand" width="60px"></el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column label="" width="200px">
                    <template slot-scope="data">{{ data.row.created | formatTime}}</template>
                </el-table-column>
                <el-table-column label="扣款时间" width="200px">
                    <template slot-scope="data">{{ data.row.created | formatTime}}</template>
                </el-table-column>
                <el-table-column label="扣款钱包">
                    <template slot-scope="data">{{ data.row.payMethod }}</template>
                </el-table-column>
                <el-table-column label="存储总消耗">
                    <template slot-scope="data">{{ data.row.storage | formatSize}}</template>
                </el-table-column>
                <el-table-column label="流量总消耗">
                    <template slot-scope="data">{{ data.row.bandwidth | formatSize}}</template>
                </el-table-column>
                <el-table-column label="总费用" prop="amount"></el-table-column>
            </el-table>
            <el-pagination class="pager" layout="prev, pager, next" :total="40000" :page-size="6000"></el-pagination>
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
            debits: {
                total: 0,
                page: 1,
                data: [],
            },
            latestUsage: {
                usage: 0,
                usageOver: 0,
            }
        };
    },
    async created() {
        await this.getPage(1, 10);
    },
    methods: {
        async getPage(page = 1, limit = 10) {
            let payTransactions = await this.$http.get(`${BRIDGE_API_URL}/paytransactions/${this.$store.state.User.username}?page=${page}&limit=${limit}`,
                {
                    auth: {
                        username: this.$store.state.User.username,
                        password: storj.utils.sha256(this.$store.state.User.password),
                    }
                });
            if (page === 1) this.getUnpaid();
            payTransactions.data.forEach(data => {
                data.bandwidth = null;
                data.storage = null;

                this.getDebit(data);
            });
            this.debits.data = payTransactions.data;

        },
        async getUnpaid() {
            let payTransaction = {
                comment: "Still counting...",
                created: null,
                ethTransactionHash: null,
                lastUpdate: null,
                payMethod: "none",
                state: "counting",
                totalAmount: null,
                bandwidth: 0,
                storage: 0,
                tryCount: 0,
                user: this.$store.state.User.username,
            };
            let debits = await this.$http.get(`${BRIDGE_API_URL}/debits/${this.$store.state.User.username}`,
                {
                    auth: {
                        username: this.$store.state.User.username,
                        password: storj.utils.sha256(this.$store.state.User.password),
                    }
                });
            payTransaction.debits = [];
            debits.data.forEach(debit => {
                payTransaction.debits.push(debit);
                payTransaction.storage += debit.storage;
                payTransaction.bandwidth += debit.bandwidth;
            });
            this.debits.data.unshift(payTransaction);
        },
        async getDebit(payTransaction) {
            let debits = await this.$http.get(`${BRIDGE_API_URL}/debits/${this.$store.state.User.username}/paytransaction/${payTransaction._id}`,
                {
                    auth: {
                        username: this.$store.state.User.username,
                        password: storj.utils.sha256(this.$store.state.User.password),
                    }
                });
            payTransaction.debits = [];
            debits.data.forEach(debit => {
                payTransaction.debits.push(debit);
                payTransaction.storage += debit.storage;
                payTransaction.bandwidth += debit.bandwidth;
            });
        },
    }
}
</script>
