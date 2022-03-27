<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学生姓名" prop="stuName">
        <el-input
          v-model="queryParams.stuName"
          placeholder="请输入学生姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请假事由" prop="stuWhy">
        <el-input
          v-model="queryParams.stuWhy"
          placeholder="请输入请假事由"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请假时间" prop="stuTime">
        <el-date-picker clearable
          v-model="queryParams.stuTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择请假时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="返回时间" prop="stuDate">
        <el-date-picker clearable
          v-model="queryParams.stuDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择返回时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="辅导员" prop="stuHelp">
        <el-input
          v-model="queryParams.stuHelp"
          placeholder="请输入辅导员"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否批准" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择是否批准" clearable>
          <el-option
            v-for="dict in dict.type.sys_yes_no"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="批复" prop="teaPass">
        <el-input
          v-model="queryParams.teaPass"
          placeholder="请输入批复"
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
          v-hasPermi="['system:leave:add']"
        >请假</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:leave:edit']"
        >处理</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:leave:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:leave:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leaveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学号" align="center" prop="stuId" />
      <el-table-column label="学生姓名" align="center" prop="stuName" />
      <el-table-column label="请假事由" align="center" prop="stuWhy" />
      <el-table-column label="请假时间" align="center" prop="stuTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.stuTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返回时间" align="center" prop="stuDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.stuDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="健康码" align="center" prop="stuImage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.stuImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="辅导员" align="center" prop="stuHelp" />
      <el-table-column label="是否批准" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="批复" align="center" prop="teaPass" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:leave:edit']"
          >处理</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:leave:remove']"
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

    <!-- 添加或修改请假对话框 -->
    <el-dialog :title="title" :visible.sync="onopen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生姓名" prop="stuName">
          <el-input v-model="form.stuName" placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="请假事由" prop="stuWhy">
          <el-input v-model="form.stuWhy" placeholder="请输入请假事由" />
        </el-form-item>
        <el-form-item label="请假时间" prop="stuTime">
          <el-date-picker clearable
                          v-model="form.stuTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择请假时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="返回时间" prop="stuDate">
          <el-date-picker clearable
                          v-model="form.stuDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择返回时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="健康码">
          <image-upload v-model="form.stuImage"/>
        </el-form-item>
        <el-form-item label="辅导员" prop="stuHelp">
          <el-input v-model="form.stuHelp" placeholder="请输入辅导员" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="change">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生姓名" prop="stuName">
          <el-input v-model="form.stuName" placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="请假事由" prop="stuWhy">
          <el-input v-model="form.stuWhy" placeholder="请输入请假事由" />
        </el-form-item>
        <el-form-item label="请假时间" prop="stuTime">
          <el-date-picker clearable
            v-model="form.stuTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择请假时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="返回时间" prop="stuDate">
          <el-date-picker clearable
            v-model="form.stuDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择返回时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="健康码">
          <image-upload v-model="form.stuImage"/>
        </el-form-item>
        <el-form-item label="辅导员" prop="stuHelp">
          <el-input v-model="form.stuHelp" placeholder="请输入辅导员" />
        </el-form-item>
        <el-form-item label="是否批准">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_yes_no"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="批复" prop="teaPass">
          <el-input v-model="form.teaPass" placeholder="请输入批复" />
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
import { listLeave, getLeave, delLeave, addLeave, updateLeave } from "@/api/system/leave";

export default {
  name: "Leave",
  dicts: ['sys_yes_no'],
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
      // 请假表格数据
      leaveList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      onpen:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stuName: null,
        stuWhy: null,
        stuTime: null,
        stuDate: null,
        stuImage: null,
        stuHelp: null,
        status: null,
        teaPass: null
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
    /** 查询请假列表 */
    getList() {
      this.loading = true;
      listLeave(this.queryParams).then(response => {
        this.leaveList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    close() {
      this.onopen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        stuId: null,
        stuName: null,
        stuWhy: null,
        stuTime: null,
        stuDate: null,
        stuImage: null,
        stuHelp: null,
        status: "0",
        teaPass: null
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
      this.ids = selection.map(item => item.stuId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.onopen = true;
      this.title = "添加请假";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const stuId = row.stuId || this.ids
      getLeave(stuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改请假";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.stuId != null) {
            updateLeave(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLeave(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },

    change() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.stuId != null) {
            updateLeave(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLeave(this.form).then(response => {
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
      const stuIds = row.stuId || this.ids;
      this.$modal.confirm('是否确认删除请假编号为"' + stuIds + '"的数据项？').then(function() {
        return delLeave(stuIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/leave/export', {
        ...this.queryParams
      }, `leave_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
