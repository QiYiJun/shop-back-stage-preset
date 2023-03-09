<template>
  <el-container>
    <el-header>
      <div class="header-left">
        <img src="~assets/logo.png"
             alt="">
        <span>电商后台管理系统 by QiYiJun</span>
      </div>
      <el-button type="info"
                 @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="flod"
             @click="toggleCollapse">
          <i v-if="isCollapse"
             class="el-icon-s-unfold"></i>
          <i v-else
             class="el-icon-s-fold"></i>
        </div>
        <sidebar-menu :menuList="menuList"
                      :isCollapse="isCollapse"></sidebar-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SidebarMenu from '../home/childComps/SidebarMenu'

export default {
  name: 'Home',
  components: {
    SidebarMenu
  },
  data() {
    return {
      menuList: [],
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取侧边栏菜单数据
    async getMenuList() {
      const {data : res} = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  },
}
</script>

<style scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #2b4b6b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 7px;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left img {
  width: 50px;
}

.header-left span {
  color: white;
  padding-left: 10px;
}

.flod {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flod i {
  color: #909399;
}

.flod:hover {
  transition: all 500ms;
  background-color: #292c36;
}
</style>