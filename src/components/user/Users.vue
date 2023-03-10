<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片-用户管理与列表 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getUserList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary"
                     @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="usersList"
                stripe
                style="width: 100%"
                border>
        <!-- 序列 -->
        <el-table-column type="index"
                         label="#">
        </el-table-column>
        <!-- 用户名 -->
        <el-table-column prop="username"
                         label="用户名"
                         width="180">
        </el-table-column>
        <!-- 邮箱 -->
        <el-table-column prop="email"
                         label="邮箱"
                         width="180">
        </el-table-column>
        <!-- 电话 -->
        <el-table-column prop="mobile"
                         label="电话">
        </el-table-column>
        <!-- 角色 -->
        <el-table-column prop="role_name"
                         label="角色">
        </el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作"
                         width="300">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="small"
                       @click="editUser(scope.row.id)">
            </el-button>
            <!-- 删除 -->
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="small"
                       @click="deleteUser(scope.row.id)">
            </el-button>
            <!-- 分配角色和悬浮提示 -->
            <el-tooltip class="item"
                        effect="dark"
                        content="分配角色"
                        placement="top"
                        :enterable="false">
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="small"
                         @click="setRole(scope.row)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               width="50%"
               @close="addDialogClosed">
      <el-form ref="addUserForm"
               :model="addUserForm"
               :rules="addUserFormRules"
               label-width="70px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号"
                      prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户"
               :visible.sync="editDialogVisible"
               width="50%"
               @close="editUserClosed">
      <el-form ref="editUserForm"
               :model="editUserForm"
               :rules="editUserFormRules"
               label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号"
                      prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色"
               :visible.sync="setRoleDialogVisible"
               width="50%"
               @close="setRoleDialogClosed">
      <div>
        <p>当前的用户: {{userInfo.username}}</p>
        <p>当前的角色: {{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId"
                     placeholder="请选择"
                     lab>
            <el-option v-for="item in rolesList"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9])+@([a-zA-Z0-9])+(\.[a-zA-Z0-9]*)+$/
      if (regEmail.test(value)) {
          return callback()
        }
      callback(new Error('请输入正确的邮箱'))
    }
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
          return callback()
        }
      callback(new Error('请输入正确的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      usersList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ]
      },
      editUserForm: {},
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ]
      },
      userInfo: {},
      rolesList: [],
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const {data : res} = await this.$http.get('/users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取管理员列表失败')
      this.usersList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged(userInfo) {
      const {data : res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success(res.meta.msg)
    },
    addUser() {
      this.$refs.addUserForm.validate(async valid => {
        if (!valid) return
        const {data : res} = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) return this.$message.error('创建失败')
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    addDialogClosed() {
      this.$refs.addUserForm.resetFields()
    },
    async editUser(id) {
      const {data : res} = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    editUserClosed() {
      this.$refs.editUserForm.resetFields()
    },
    editUserInfo() {
      this.$refs.editUserForm.validate(async valid => {
        if (!valid) return
        const {data : res} = await this.$http.put(`users/${this.editUserForm.id}`, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败')
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success(res.meta.msg)
      })
    },
    async deleteUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const {data : res} = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    async setRole(userInfo) {
      this.userInfo = userInfo
      const {data : res} = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo() {
      if (!this.selectedRoleId) return this.$message.error('请选择要分配的角色')
      const {data : res} = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) return this.$message.error('更新角色失败')
      this.$message.success(res.meta.msg)
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style scoped>

</style>