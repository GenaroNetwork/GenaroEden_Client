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
.loading-color {
  color: #009eff;
}
.success-color {
  color: #88c557;
}
.error-color {
  color: #c55788;
}
</style>


<template>
    <div>
        <div class="header">
            <div class="info">
                <span>Used: {{ latest.storage | formatSize }} / Free storage: 25 GB/year</span>
                <span class="bonus">New user bandwidth: {{ bonusAmount }} GNX</span>
            </div>
            <div class="progress-bar">
                <div class="usage" :style="{width: latest.usage + '%'}"></div>
                <div class="usage-over" :style="{width: latest.overUsage + '%'}"></div>
            </div>
            <div class="tips">
                Last update: {{ latest.created | formatTime}}
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
                        <span v-if="data.row.state === 'fail' && !data.row.debits.length">
                            Billing is incomplete，please see the transaction details: {{ data.row.ethTransactionHash ? data.row.ethTransactionHash : data.row.comment }} , billing will be automatically adjusted and deducted from the next transaction
                        </span>
                        <el-table :data="data.row.debits" :show-header="false" v-else>
                            <el-table-column>
                                <template slot-scope="data">{{data.row.created | formatTime}}</template>
                            </el-table-column>
                            <el-table-column>
                                <template slot-scope="data">Storage/Traffic Used: {{data.row.storage | formatHourSize}}/{{data.row.bandwidth | formatSize}}</template>
                            </el-table-column>
                            <el-table-column>
                                <template slot-scope="data">Storage Fee: {{data.row.storageAmount}} GNX</template>
                            </el-table-column>
                            <el-table-column>
                                <template slot-scope="data">Traffic Fee: {{data.row.bandwidthAmount}} GNX</template>
                            </el-table-column>
                            <el-table-column>
                                <template slot-scope="data">Total Fee: {{data.row.amount}} GNX</template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="data">
                        <span v-if="data.row.state==='counting'" class="loading-color">Preparing transaction</span>
                        <span v-else-if="data.row.state==='init'" class="loading-color">Preparing transaction</span>
                        <span v-else-if="data.row.state==='pending'" class="loading-color">Preparing transaction</span>
                        <span v-else-if="data.row.state==='success'" class="success-color">Transaction completed</span>
                        <span v-else-if="data.row.state==='fail'" class="error-color">Transaction failed</span>
                    </template>
                </el-table-column>
                <el-table-column label="Time" width="200px">
                    <template slot-scope="data">{{ data.row.created | formatTime}}</template>
                </el-table-column>
                <el-table-column label="Wallet">
                    <template slot-scope="data">{{ data.row.payMethod }}</template>
                </el-table-column>
                <el-table-column label="Storage/Traffic Used">
                    <template slot-scope="data">{{ data.row.storage | formatHourSize}} / {{ data.row.bandwidth | formatSize}}</template>
                </el-table-column>
                <el-table-column label="Storage Fee">
                    <template slot-scope="data">{{data.row.storageAmount === null ? "--" : data.row.storageAmount + " GNX"}}</template>
                </el-table-column>
                <el-table-column label="Traffic Fee">
                    <template slot-scope="data">{{data.row.bandwidthAmount === null ? "--" :data.row.bandwidthAmount + " GNX"}}</template>
                </el-table-column>
                <el-table-column label="Total Fee">
                    <template slot-scope="data">{{ data.row.totalAmount }} GNX</template>
                </el-table-column>
            </el-table>
            <el-pagination class="pager" layout="prev, pager, next" :total="debits.total" :page-size="debits.pageSize" :current-page="debits.page" @current-change="getPage"></el-pagination>
        </div>
    </div>
</template>

<script>
import { BRIDGE_API_URL, GNX_PER_GB_BANDWIDTH, GNX_PER_GB_HOUR_STORAGE } from "../../../config";
import storj from 'storj-lib';

export default {
    data() {
        return {
            usage: 0,
            bonusAmount: 0,
            latest: {
                created: null,
                storage: null,
                usage: 0,
                overUsage: 0,
            },
            debits: {
                total: 0,
                page: 1,
                pageSize: 10,
                data: [],
            },
        };
    },
    async created() {
        let payTransactions = await this.getPage(1, this.debits.pageSize);
        let payTransaction = payTransactions[0];
        await this.getDebits(payTransaction);
        this.latest.storage = payTransaction.storage;
        this.latest.created = payTransaction.created;
        if (payTransaction.storage / Math.pow(1000, 3) <= 25) {
            this.latest.usage = payTransaction.storage / (25 * Math.pow(1000, 3));
            this.latest.overUsage = 0;
        } else {
            this.latest.usage = 100;
            this.latest.overUsage = 100 - (25 * Math.pow(1000, 3)) / payTransaction.storage;
        }
    },
    methods: {
        mergeDebit(transaction, debits) {
            this.$set(transaction, "bandwidth", null);
            this.$set(transaction, "storage", null);
            this.$set(transaction, "bandwidthAmount", null);
            this.$set(transaction, "storageAmount", null);
            this.$set(transaction, "debits", []);
            debits.forEach(debit => {
                transaction.bandwidth = transaction.bandwidth || 0;
                transaction.storage = transaction.storage || 0
                transaction.bandwidthAmount = transaction.bandwidthAmount || 0;
                transaction.storageAmount = transaction.storageAmount || 0;

                this.$set(debit, "bandwidthAmount", debit.bandwidth * GNX_PER_GB_BANDWIDTH / Math.pow(1000, 3));
                this.$set(debit, "storageAmount", debit.storage * GNX_PER_GB_HOUR_STORAGE);

                debit.storage *= 1000 * 1000 * 1000;

                transaction.bandwidth += debit.bandwidth;
                transaction.storage += debit.storage;
                transaction.bandwidthAmount += debit.bandwidthAmount;
                transaction.storageAmount += debit.storageAmount;

                transaction.debits.push(debit);
            });
            if (!transaction.totalAmount) transaction.totalAmount = transaction.storageAmount + transaction.bandwidthAmount;
        },
        async getPage(page = 1, limit = this.debits.pageSize) {
            let payTransactions = await this.$http.get(`${BRIDGE_API_URL}/paytransactions/${this.$store.state.User.username}?page=${page}&limit=${limit}`,
                {
                    auth: {
                        username: this.$store.state.User.username,
                        password: storj.utils.sha256(this.$store.state.User.password),
                    }
                });
            payTransactions = payTransactions.data;
            this.debits.total = payTransactions.TotalCount;
            payTransactions = payTransactions.Data;
            if (page === 1) this.getUnpaid();
            payTransactions.forEach(async payTransaction => {
                this.getDebits(payTransaction);
            });
            this.debits.data = payTransactions;
            return payTransactions;
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

            this.mergeDebit(payTransaction, debits.data);
            this.debits.data.unshift(payTransaction);
        },
        async getDebits(payTransaction) {
            let debits = await this.$http.get(`${BRIDGE_API_URL}/debits/${this.$store.state.User.username}/paytransaction/${payTransaction._id}`,
                {
                    auth: {
                        username: this.$store.state.User.username,
                        password: storj.utils.sha256(this.$store.state.User.password),
                    }
                });
            this.mergeDebit(payTransaction, debits.data);
        },
    }
}
</script>
