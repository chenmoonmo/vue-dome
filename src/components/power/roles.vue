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
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['vcneter','border-bottom', i1=== 0? 'border-top': '']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <!-- 三角图标 -->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2!== 0? 'border-top': '','vcneter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col v-if="item2" :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="warning"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
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
            <el-button
              @click="showsSetRightDialog(scope.row)"
              size="mini"
              type="warning"
              icon="el-icon-setting"
            >分配权限</el-button>
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
    <!-- 分配权限的弹框 -->
    <el-dialog
      title="分配权限"
      @close="setRightDialogClosed"
      :visible.sync="setRightDialogVisible"
      width="30%"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
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
      },
      // 编辑权限弹框的显示与隐藏
      setRightDialogVisible: false,
      // 树形权限列表
      rightsList: [],
      // 自定义树形控件
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的树节点的id
      defKeys: [],
      // 要修改权限的角色的id
      roleId: ''
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
      console.log(this.rolesList)
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
      // console.log(res)
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
    },
    // 通过点击tag删除权限
    async removeRightById(role, rightId) {
      // console.log(role.id, rightId)
      const confirmRes = await this.$confirm('是否删除这条权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      role.children = res.data
    },
    // 显示分配权限的弹框
    async showsSetRightDialog(role) {
      // 把要修改的id保存到data中
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$axios.get('rights/tree')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
      // 调用递归函数获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 发起分配权限请求
    async setRights() {
      // 获取所有被选中和半选中的节点 ... 展开运算符
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // keys.push(this.$refs.treeRef.getCheckedKeys())
      // keys.push(this.$refs.treeRef.getHalfCheckedKeys())
      // 将数组转换为以,为间隔的字符串
      const idstr = keys.join(',')
      const {
        data: res
      } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: idstr })
      console.log(res)
      console.log(this.roleId)
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色权限失败')
      }
      this.$message.success('分配成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    // 通过递归获取角色所有三级节点的id
    getLeafKeys(node, arr) {
      // 如果当前节点不包含children属性 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 不是三级节点则递归
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 关闭权限管理弹框时清空数组
    setRightDialogClosed() {
      this.defKeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.border-top {
  border-top: 1px solid #eee;
}

.border-bottom {
  border-bottom: 1px solid #eee;
}

.vcneter {
  display: flex;
  align-items: center;
}
</style>
