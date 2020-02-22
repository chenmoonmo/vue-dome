<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope>
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="设置角色"
              placement="top"
            >
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="querryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取用户列表的数据对象
      querryInfo: {
        querry: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios.get('users', {
        params: this.querryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('用户数据获取失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize大小改变的事件
    handleSizeChange(newsize) {
      console.log(newsize)
      this.querryInfo.pagesize = newsize
      this.getUserList()
    },
    // 监听页码值变化的事件
    handleCurrentChange(newpage) {
      console.log(newpage)
      this.querryInfo.pagenum = newpage
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
