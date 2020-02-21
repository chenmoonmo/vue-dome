<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="logo-container">
        <img src="../assets/logo.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <el-menu
          :collapse-transition="false"
          :collapse="isCollapse"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          router
          :default-active="activeIndex"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id.toString()" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subItem.id.toString()"
              :route="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="savePath(subItem.id.toString())"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-cooperation',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-claim',
        145: 'el-icon-s-marketing'
      },
      // 决定菜单是否折叠(collapse属性) 默认为不折叠
      isCollapse: false,
      // 被激活的path链接
      activeIndex: ''
    }
  },
  created() {
    this.getMenuList()
    this.activeIndex = window.sessionStorage.getItem('activeIndex')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 点击按钮实现菜单的折叠和展开
    toggleCollapse() {
      // 每次点击取反 达到切换效果
      this.isCollapse = !this.isCollapse
    },
    savePath(path) {
      window.sessionStorage.setItem('activeIndex', path)
      this.activeIndex = window.sessionStorage.getItem('activeIndex')
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  .logo-container {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      width: 40px;
      height: 40px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
.toggle-btn {
  background-color: #4a5064;
  color: #fff;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
