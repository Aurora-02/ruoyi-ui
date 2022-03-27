<template>
  <div class="app-container home">
        <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        <blockquote>
          <p style="font-size: 30px">教务信息管理系统</p>
          Teaching and researching information management system
        </blockquote>
      </el-col>
    </el-row>

    <el-divider />

    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px"> 
        <h2>设计理念</h2>
        <p>
          基于现代化的教务管理理念和信息化管理技术，我们将学生教师信息管理、课程管理、成绩管理、学生请假等功能紧密联系，实现教务信息管理的一体化，促进教务管理工作逐渐规范化、制度化、科学化、智能化，以减少教务管理的人工操作、促进学校教务管理水平和效率的提高。作为数字化校园极为重要的组成部分之一，希望此教务管理信息系统可以为学生、教师以及管理人员提供简便、快捷的网络化信息服务。
        </p>
        <p>
          <el-tag>基于若依框架开发</el-tag>
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot</li>
              <li>Spring Security</li>
              <li>JWT</li>
              <li>MyBatis</li>
              <li>Druid</li>
              <li>Fastjson</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Vuex</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>Sass</li>
              <li>Quill</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.8.1",
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 20px;
    letter-spacing: 0.07em;
  }
  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

