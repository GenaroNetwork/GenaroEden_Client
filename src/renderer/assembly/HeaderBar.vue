<style scoped>
    .layout-header {
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
        padding-top: 16px;
        padding-right: 15px;
        padding-left: 25px;
    } 
</style>

<template>
    <div class="layout-header">
        <Row>
            <Col span="22">
                <Input style="width: 300px" placeholder="Find Everything">
                    <span slot="prepend"><Icon type="search" /></span>
                </Input>
            </Col>
            <Col span="2">
                <div class="demo-avatar-badge">
                    <Badge count="1">
                        <img shape="circle" src="~@/assets/genaro_logo.png" size="large" >
                    </Badge>
                    <Dropdown trigger="click" @on-click="bucketAction" transfer placement="left-start" style="margin-left: 20px">
                        <a href="javascript:void(0)">
                            <Icon type="arrow-down-b"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="logout">logout</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import router from '../router'
    export default {
        methods: {
            bucketAction(name) {
                if (name === 'logout') {
                    router.push({path: '/'})
                }
            }
        }
    }
</script>
