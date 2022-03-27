<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="teaName">
        <el-input
          v-model="queryParams.teaName"
          placeholder="请输入姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="teaCall">
        <el-input
          v-model="queryParams.teaCall"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="教授学科" prop="teaSubject">
        <el-input
          v-model="queryParams.teaSubject"
          placeholder="请输入教授学科"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="教授班级" prop="teaCid">
        <el-input
          v-model="queryParams.teaCid"
          placeholder="请输入教授班级"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="教授专业" prop="teaClass">
        <el-input
          v-model="queryParams.teaClass"
          placeholder="请输入教授专业"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属学院" prop="teaXueyuan">
        <el-input
          v-model="queryParams.teaXueyuan"
          placeholder="请输入所属学院"
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
          v-hasPermi="['teacher:inf:add']"
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
          v-hasPermi="['teacher:inf:edit']"
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
          v-hasPermi="['teacher:inf:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['teacher:inf:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工号" align="center" prop="teaId" />
      <el-table-column label="姓名" align="center" prop="teaName" />
      <el-table-column label="联系方式" align="center" prop="teaCall" />
      <el-table-column label="学科编号" align="center" prop="teaCouid" />
      <el-table-column label="教授学科" align="center" prop="teaSubject" />
      <el-table-column label="教授班级" align="center" prop="teaCid" />
      <el-table-column label="教授专业" align="center" prop="teaClass" />
      <el-table-column label="所属学院" align="center" prop="teaXueyuan" />
      <el-table-column label="教师图片" align="center" prop="teaImage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.teaImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['teacher:inf:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['teacher:inf:remove']"
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

    <!-- 添加或修改老师信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="teaName">
          <el-input v-model="form.teaName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="联系方式" prop="teaCall">
          <el-input v-model="form.teaCall" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="教授学科" prop="teaSubject">
          <el-input v-model="form.teaSubject" placeholder="请输入教授学科" />
        </el-form-item>
        <el-form-item label="教授班级" prop="teaCid">
          <el-input v-model="form.teaCid" placeholder="请输入教授班级" />
        </el-form-item>
        <el-form-item label="教授专业" prop="teaClass">
          <el-input v-model="form.teaClass" placeholder="请输入教授专业" />
        </el-form-item>
        <el-form-item label="所属学院" prop="teaXueyuan">
          <el-input v-model="form.teaXueyuan" placeholder="请输入所属学院" />
        </el-form-item>
        <el-form-item label="教师图片">
          <image-upload v-model="form.teaImage"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInf, getInf, delInf, addInf, updateInf } from "@/api/teacher/inf";

export default {
  name: "Inf",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 老师信息表格数据
      infList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        teaName: null,
        teaCall: null,
        teaSubject: null,
        teaCid: null,
        teaClass: null,
        teaXueyuan: null,
        teaImage: null
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
    /** 查询老师信息列表 */
    getList() {
      this.loading = true;
      listInf(this.queryParams).then(response => {
        this.infList = response.rows;
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
        teaId: null,
        teaName: null,
        teaCall: null,
        teaCouid: null,
        teaSubject: null,
        teaCid: null,
        teaClass: null,
        teaXueyuan: null,
        teaImage: null
      };
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
      this.ids = selection.map(item => item.teaId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加老师信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const teaId = row.teaId || this.ids
      getInf(teaId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改老师信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.teaId != null) {
            updateInf(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInf(this.form).then(response => {
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
      const teaIds = row.teaId || this.ids;
      this.$modal.confirm('是否确认删除老师信息编号为"' + teaIds + '"的数据项？').then(function() {
        return delInf(teaIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('teacher/inf/export', {
        ...this.queryParams
      }, `inf_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
