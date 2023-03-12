<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="cateList"
                  :columns="columns"
                  show-index
                  index-text="#"
                  :expand-type="false"
                  :selection-type="false"
                  border
                  :show-row-hover="false">
        <!-- 商品列表 -->
        <template slot="isok"
                  slot-scope="scpoe">
          <div>
            <i v-if="scpoe.row.cat_deleted === false"
               class="el-icon-success"
               style="color: lightgreen"></i>
            <i v-else
               class="el-icon-error"
               style="color: red"></i>
          </div>
        </template>
        <!-- 排序 -->
        <template slot="order"
                  slot-scope="scpoe">
          <div>
            <el-tag v-if="scpoe.row.cat_level === 0"
                    size="mini">一级</el-tag>
            <el-tag v-else-if="scpoe.row.cat_level === 1"
                    size="mini"
                    type="success">二级</el-tag>
            <el-tag v-else
                    size="mini"
                    type="warning">三级</el-tag>
          </div>
        </template>
        <!-- 操作 -->
        <template slot="opt"
                  slot-scope="scope">
          <div>
            <el-button size="mini"
                       type="primary"
                       icon="el-icon-edit"
                       @click="showEditCateDialog(scope.row)">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       icon="el-icon-delete"
                       @click="deleteCate(scope.row.cat_id)">删除</el-button>
          </div>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[3, 5, 10, 15]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCateDialogVisible"
               width="50%"
               @close="addCateDialogClosed">
      <el-form :model="addCateForm"
               :rules="addCateFormRules"
               ref="addCateFormRef"
               label-width="100px">
        <el-form-item label="分类名称:"
                      prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <div class="block">
            <el-cascader v-model="selectedKeys"
                         :options="parentCateList"
                         @change="parentCateChanged"
                         :props="cascaderProps"
                         clearable
                         props.checkStrictly></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="editCateDialogVisible"
               width="50%"
               @close="editCateDialogClosed">
      <el-form :model="editCateForm"
               :rules="editCateFormRules"
               ref="editCateFormRef"
               label-width="100px">
        <el-form-item label="分类名称:"
                      prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      editCateDialogVisible: false,
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editCateForm: {
        cat_id: 0,
        cat_name: ''
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const {data : res} = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList() {
      const {data : res} = await this.$http.get('categories', { params: { type: 2 }})
      if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败')
      this.parentCateList = res.data
    },
    parentCateChanged() {
      if (this.selectedKeys.length > 0){
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const {data : res} = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    showEditCateDialog(cat) {
      this.editCateForm.cat_id = cat.cat_id
      this.editCateForm.cat_name = cat.cat_name
      this.editCateDialogVisible = true
    },
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const {data : res} = await this.$http.put(`categories/${this.editCateForm.cat_id}`, { cat_name: this.editCateForm.cat_name })
        if (res.meta.status !== 200) return this.$message.error('编辑分类名称失败')
        this.$message.success('编辑分类名称成功')
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
      this.editCateForm.cat_id = 0
      this.editCateForm.cat_name = ''
    },
    async deleteCate(cat_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const {data : res} = await this.$http.delete(`categories/${cat_id}`)
      if (res.meta.status !== 200) return this.$message.error('删除分类失败')
      this.$message.success(res.meta.msg)
      this.getCateList()
    }
  },
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>