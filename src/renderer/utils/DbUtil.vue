<script type="text/javascript">
const path = require('path')
const os = require('os')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const dbPath = path.join(os.homedir(), "db.json")
const adapter = new FileSync(dbPath)
const db = low(adapter)

db.defaults({ t_down_files: [] }).write()

/* 插入数据 */
function save(tableName, data) {
    db.get(tableName).push(data).write()
}

/* 查询数据 */
function query(tableName, queryVal) {
    return db.get(tableName).filter(queryVal).value()
}

export default {
    save,
    query
}
</script>