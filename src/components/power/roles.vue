<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table :data="rolesList" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand"></el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
            >删除</el-button>
            <!-- 设置角色 -->
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色色弹框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <el-form label-width="90px" :model="addRoleForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="50%">
      <el-form label-width="90px" :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList()
  },
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 添加角色列表显示与隐藏
      addRoleDialogVisible: false,
      // 添加角色信息
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色校验规则
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 编辑角色弹框的显示与隐藏
      editRoleDialogVisible: false,
      // 查询到的编辑角色信息
      editForm: {},
      // 编辑角色规则
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 发起请求获取角色列表
    async getRolesList() {
      const { data: res } = await this.$axios.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.rolesList = res.data
      //   console.log(this.rolesList)
    },
    // 添加角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$axios.post('roles', this.addRoleForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加用户成功')
        this.addRoleDialogVisible = false
        this.getRolesList()
      })
    },
    // 关闭清空表单
    addRoleDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 展示编辑用户信息的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get('roles/' + id)
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.editForm = res.data
      //   console.log(this.editForm)
      this.editRoleDialogVisible = true
    },
    // 发起编辑角色请求
    async editRole(id) {
      const { data: res } = await this.$axios.put(
        'roles/' + this.editForm.roleId,
        this.editForm
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑角色失败')
      }
      this.$message.success('编辑成功')
      this.editRoleDialogVisible = false
      this.getRolesList()
    },
    // 删除角色
    async removeRoleById(id) {
      // 弹出确认框
      const confirmRes = await this.$confirm('是否删除这条角色信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message.info('取消删除')
      }
      // 发起删除请求
      const { data: res } = await this.$axios.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
