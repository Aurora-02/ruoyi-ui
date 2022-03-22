<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="课程名" prop="cuName">
        <el-input
          v-model="queryParams.cuName"
          placeholder="请输入课程名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="授课教室" prop="cuRoom">
        <el-input
          v-model="queryParams.cuRoom"
          placeholder="请输入授课教室"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上课时间" prop="cuTime">
        <el-date-picker clearable
          v-model="queryParams.cuTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择上课时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="授课老师" prop="cuTeacher">
        <el-input
          v-model="queryParams.cuTeacher"
          placeholder="请输入授课老师"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="选修" prop="cuChoose">
        <el-input
          v-model="queryParams.cuChoose"
          placeholder="请输入选修"
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
          v-hasPermi="['courseselect:select:add']"
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
          v-hasPermi="['courseselect:select:edit']"
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
          v-hasPermi="['courseselect:select:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['courseselect:select:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="selectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="课程号" align="center" prop="cuId" />
      <el-table-column label="课程名" align="center" prop="cuName" />
      <el-table-column label="授课教室" align="center" prop="cuRoom" />
      <el-table-column label="上课时间" align="center" prop="cuTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.cuTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授课老师" align="center" prop="cuTeacher" />
      <el-table-column label="选修" align="center" prop="cuChoose" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['courseselect:select:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['courseselect:select:remove']"
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

    <!-- 添加或修改选修课程对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课程名" prop="cuName">
          <el-input v-model="form.cuName" placeholder="请输入课程名" />
        </el-form-item>
        <el-form-item label="授课教室" prop="cuRoom">
          <el-input v-model="form.cuRoom" placeholder="请输入授课教室" />
        </el-form-item>
        <el-form-item label="上课时间" prop="cuTime">
          <el-date-picker clearable
            v-model="form.cuTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择上课时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="授课老师" prop="cuTeacher">
          <el-input v-model="form.cuTeacher" placeholder="请输入授课老师" />
        </el-form-item>
        <el-form-item label="选修" prop="cuChoose">
          <el-input v-model="form.cuChoose" placeholder="请输入选修" />
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
import { listSelect, getSelect, delSelect, addSelect, updateSelect } from "@/api/courseselect/select";

export default {
  name: "Select",
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
      // 选修课程表格数据
      selectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cuName: null,
        cuRoom: null,
        cuTime: null,
        cuTeacher: null,
        cuChoose: null
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
    /** 查询选修课程列表 */
    getList() {
      this.loading = true;
      listSelect(this.queryParams).then(response => {
        this.selectList = response.rows;
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
        cuId: null,
        cuName: null,
        cuRoom: null,
        cuTime: null,
        cuTeacher: null,
        cuChoose: null
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
      this.ids = selection.map(item => item.cuId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加选修课程";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const cuId = row.cuId || this.ids
      getSelect(cuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改选修课程";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.cuId != null) {
            updateSelect(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSelect(this.form).then(response => {
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
      const cuIds = row.cuId || this.ids;
      this.$modal.confirm('是否确认删除选修课程编号为"' + cuIds + '"的数据项？').then(function() {
        return delSelect(cuIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('courseselect/select/export', {
        ...this.queryParams
      }, `select_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
