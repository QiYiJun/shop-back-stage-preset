<template>
  <el-menu background-color="#333744"
           text-color="#fff"
           active-text-color="#409bff"
           unique-opened
           :collapse="isCollapse"
           :collapse-transition="false"
           router
           :default-active="activePath">
    <el-submenu v-for="item in menuList"
                :index="item.id + ''"
                :key="item.id">
      <template slot="title">
        <i :class="iconObj[item.id]"></i>
        <span>{{item.authName}}</span>
      </template>
      <el-menu-item v-for="sunItem in item.children"
                    :index="'/' + sunItem.path"
                    :key="sunItem.id"
                    @click="saveNavState('/' + sunItem.path)">
        <i class="el-icon-menu"></i>
        <span>{{sunItem.authName}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'SidebarMenu',
  props: {
    menuList: {
      type: Array,
      default() {
        return []
      }
    },
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      iconObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-cooperation',
        101: 'el-icon-s-shop',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing',
      },
      activePath: ''
    }
  },
  methods: {
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
}
</script>

<style scoped>
.el-menu {
  border-right: none;
}
</style>