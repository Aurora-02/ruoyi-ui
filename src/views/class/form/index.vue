<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="班级名" prop="claName">
        <el-input
          v-model="queryParams.claName"
          placeholder="请输入班级名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属专业" prop="claZhuanye">
        <el-input
          v-model="queryParams.claZhuanye"
          placeholder="请输入所属专业"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['class:form:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['class:form:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['class:form:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['class:form:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="formList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="班级号" align="center" prop="claId" />
      <el-table-column label="班级名" align="center" prop="claName" />
      <el-table-column label="所属专业" align="center" prop="claZhuanye" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['class:form:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['class:form:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改班级信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级名" prop="claName">
          <el-input v-model="form.claName" placeholder="请输入班级名" />
        </el-form-item>
        <el-form-item label="所属专业" prop="claZhuanye">
          <el-input v-model="form.claZhuanye" placeholder="请输入所属专业" />
        </el-form-item>
        <el-divider content-position="center">学生信息信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddStuInf">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteStuInf">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="stuInfList" :row-class-name="rowStuInfIndex" @selection-change="handleStuInfSelectionChange" ref="stuInf">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="姓名" prop="stName" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stName" placeholder="请输入姓名" />
            </template>
          </el-table-column>
          <el-table-column label="性别" prop="stSex" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.stSex" placeholder="请选择性别">
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="联系方式" prop="stCall" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stCall" placeholder="请输入联系方式" />
            </template>
          </el-table-column>
          <el-table-column label="专业" prop="stZy" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stZy" placeholder="请输入专业" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listForm, getForm, delForm, addForm, updateForm } from "@/api/class/form";

export default {
  name: "Form",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedStuInf: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 班级信息表格数据
      formList: [],
      // 学生信息表格数据
      stuInfList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        claName: null,
        claZhuanye: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询班级信息列表 */
    getList() {
      this.loading = true;
      listForm(this.queryParams).then(response => {
        this.formList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        claId: null,
        claName: null,
        claZhuanye: null
      };
      this.stuInfList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.claId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加班级信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const claId = row.claId || this.ids
      getForm(claId).then(response => {
        this.form = response.data;
        this.stuInfList = response.data.stuInfList;
        this.open = true;
        this.title = "修改班级信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.stuInfList = this.stuInfList;
          if (this.form.claId != null) {
            updateForm(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addForm(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const claIds = row.claId || this.ids;
      this.$modal.confirm('是否确认删除班级信息编号为"' + claIds + '"的数据项？').then(function() {
        return delForm(claIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 学生信息序号 */
    rowStuInfIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 学生信息添加按钮操作 */
    handleAddStuInf() {
      let obj = {};
      obj.stName = "";
      obj.stSex = "";
      obj.stCall = "";
      obj.stZy = "";
      this.stuInfList.push(obj);
    },
    /** 学生信息删除按钮操作 */
    handleDeleteStuInf() {
      if (this.checkedStuInf.length == 0) {
        this.$modal.msgError("请先选择要删除的学生信息数据");
      } else {
        const stuInfList = this.stuInfList;
        const checkedStuInf = this.checkedStuInf;
        this.stuInfList = stuInfList.filter(function(item) {
          return checkedStuInf.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleStuInfSelectionChange(selection) {
      this.checkedStuInf = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('class/form/export', {
        ...this.queryParams
      }, `form_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
