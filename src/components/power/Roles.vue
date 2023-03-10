<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList"
                stripe
                style="width: 100%"
                border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item_1, index_1) in scope.row.children"
                    :key="item_1.id"
                    :class="['bdbottom', index_1 === 0 ? 'bdtop' : '', 'vcenter']">
              <el-col :span="5">
                <el-tag closable
                        @close="deleteRight(scope.row, item_1.id)">{{item_1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item_2, index_2) in item_1.children"
                        :key="item_2.id"
                        :class="[index_2 === 0 ? '' : 'bdtop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="deleteRight(scope.row, item_2.id)">{{item_2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item_3 in item_2.children"
                            :key="item_3.id"
                            type="warning"
                            closable
                            @close="deleteRight(scope.row, item_3.id)">{{item_3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column prop="roleName"
                         label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc"
                         label="角色描述"></el-table-column>
        <el-table-column prop=""
                         label="操作"
                         width="300">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="small">编辑
            </el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="small">删除
            </el-button>
            <el-button type="warning"
                       icon="el-icon-setting"
                       size="small"
                       @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限"
               :visible.sync="setRightDialogVisible"
               width="50%"
               @close="setRightDialogClosed">
      <el-tree :data="rightsList"
               :props="treeProps"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="defKeys"
               ref="treeRef"></el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      rolesList: [],
      setRightDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      roleId: '',
      defKeys: []
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const {data : res} = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    },
    async deleteRight(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除权限')
      const {data : res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success('成功删除权限')
      role.children = res.data
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      const {data : res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('权限列表获取失败')
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClosed() {
      this.defKeys = []
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {data : res} = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  },
}
</script>

<style scoped>
.el-tag {
  margin: 10px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>