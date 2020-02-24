// 第13节
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col :span="6">
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="tree-table"
      >
        <!-- 是否有效的模板 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success success" v-if="!scope.row.cat_deleted"></i>
          <i class="el-icon-error error" v-else></i>
        </template>
        <!-- 排序的模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="info" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作的模板 -->
        <template slot="operate" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editCate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类弹框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="30%">
      <el-form ref="form" :rules="addCateRules" :model="addCateForm" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedValue"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList()
  },
  data() {
    return {
      // 商品分类的数据列表
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前列使用的模板名称
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
          template: 'operate'
        }
      ],
      // 控制添加分类的dialog的显示与隐藏
      addCateDialogVisible: false,
      addCateForm: {
        // 要添加的分类名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 分类等级 默认为一级
        cat_level: 0
      },
      // 添加分类的验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', triggle: 'blur' }
        ]
      },
      // 获取到的父级列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器选中的值
      selectedValue: []
    }
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$axios('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      // console.log(res.data)
      // 为商品分类列表赋值
      this.cateList = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 展示编辑商品的dialog
    editCate(cateInfo) {
      console.log(1)
    },
    // 监听分页器pagesize变化的函数
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.getCateList()
    },
    // 监听分页器pagenum变化的函数
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getCateList()
    },
    // 显示添加分类的dialog
    showAddCateDialog() {
      // 先获取父级分类列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取前两列的分类
    async getParentCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级列表失败')
      }
      this.parentCateList = res.data
    },
    // 监听级联选择器选择项变化的函数
    handleChange() {
      if (this.selectedValue.length > 0) {
        this.addCateForm.cat_pid = this.selectedValue[
          this.selectedValue.length - 1
        ]
        this.addCateForm.cat_level = this.selectedValue.length
        return false
      }
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击按钮添加新的分类
    addCate() {
      console.log(this.addCateForm)
    }
  }
}
</script>

<style lang="less" scoped>
.success {
  color: green;
}
.error {
  color: red;
}

.tree-table {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
