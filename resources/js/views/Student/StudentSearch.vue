<template>
  <div class="app-container">
    <div v-loading="listLoading" class="page-body">
      <template v-if="total || listLoading">
        <el-scrollbar class="scroll-content" :vertical="false">
          <el-row id="student_list">
            <el-col v-for="item in list" :key="item.id" :span="6" :class="{'is-disabled': !checkViewPermission(item)}">
              <div class="box-info" @click="handleRedirect(item)">
                <div>
                  <div type="flex" class="">
                    <el-row class="row__first">
                      <el-col :span="24">
                        <h3 class="studen__name m-0 p-0">{{ item.fullname }}</h3>
                      </el-col>
                    </el-row>
                    <el-row class="row__second">
                      <el-col :span="24">
                        <h4 class="studen__school m-0 p-0">
                          {{ item.school_name }}
                        </h4>
                        <!-- <h5 class="studen__status">{{ item.student_status }}</h5> -->
                        <h5
                          v-if="item.student_status == StudentStatus.INQUIRY"
                          class="studen__status m-0 p-0"
                        >
                          問合せ
                        </h5>
                        <h5
                          v-else-if="
                            item.student_status == StudentStatus.EXPERIENCE_STUDENT
                          "
                          class="studen__status m-0 p-0"
                        >
                          体験生
                        </h5>
                        <h5
                          v-else-if="
                            item.student_status == StudentStatus.INTERNAL_RAW
                          "
                          class="studen__status m-0 p-0"
                        >
                          内部生
                        </h5>
                        <h5
                          v-else-if="item.student_status == StudentStatus.MATE_RAW"
                          class="studen__status m-0 p-0"
                        >
                          メイト生
                        </h5>
                        <h5
                          v-else-if="
                            item.student_status == StudentStatus.COMPLETION
                          "
                          class="studen__status m-0 p-0"
                        >
                          完了
                        </h5>
                        <h5
                          v-else-if="
                            item.student_status ==
                              StudentStatus.SCHEDULED_ENROLLMENT_STUDENT
                          "
                          class="studen__status m-0 p-0"
                        >
                          入会予定生
                        </h5>
                        <h5
                          v-else-if="
                            item.student_status ==
                              StudentStatus.KYU_JUNIOR_COLLEGE_STUDENT
                          "
                          class="studen__status m-0 p-0"
                        >
                          休塾生
                        </h5>
                        <h5
                          v-else-if="
                            item.student_status == StudentStatus.RETIRED_STUDENTS
                          "
                          class="studen__status m-0 p-0"
                        >
                          退塾生
                        </h5>
                        <h5
                          v-else-if="item.student_status == StudentStatus.ALUMNI"
                          class="studen__status m-0 p-0"
                        >
                          卒業生
                        </h5>
                      </el-col>
                    </el-row>
                    <el-row class="row__third">
                      <el-col :span="12">
                        <h4 class="studen__code m-0 p-0">
                          {{ item.student_code }}
                        </h4>
                      </el-col>
                      <el-col :span="12">
                        <h5 class="studen__grade m-0 p-0 ellipsiss">
                          {{ item.student_grade }}
                        </h5>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="btn__student__detail">
                    <button v-if="checkViewPermission(item)" @click="handleRedirect(item)">
                      <i class="el-icon-arrow-right " />
                    </button>
                    <button v-else @click="handleRedirect(item)">
                      <i class="el-icon-arrow-right icon-gray" />
                    </button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-scrollbar>
        <el-row type="flex">
          <el-col :span="24">
            <div class="site__paginate">
              <span v-if="total > 0" class="paginate__number">
                {{ from }}-{{ to }}/{{ total }} 件
              </span>
              <!-- TODO: Handle Pagination -->
              <CustomPagination
                v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                layout="prev, pager, next"
                class="text-center"
                prev-text="<"
                next-text=">"
                current-change="currentChange"
                @pagination="getList"
              />
            </div>
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <p class="no-result-txt">データはありません。</p>
      </template>
    </div>
  </div>
</template>

<script>
import CustomPagination from '@/components/Common/Pagination/CustomPagination';
import StudentStatus from '@/const/StudentStatus';
import StudentRequest from '@/api/StudentRequest';
const studentRequest = new StudentRequest();
export default {
  name: 'StudentSearch',
  metaInfo: {
    title: '生徒検索結果',
  },
  components: {
    CustomPagination,
  },
  data() {
    return {
      listLoading: true,
      listQuery: {
        phrase: '',
        page: 0,
        limit: 20,
      },
      from: 0,
      to: 0,
      list: [],
      total: 0,
      multipleSelection: [],
      StudentStatus,
    };
  },
  created() {
    this.listQuery.phrase = this.$route.query.phrase;
    this.getList();
  },
  methods: {
    checkViewPermission(item) {
      const currentBusinessIds = _.map(this.$store.getters.currentBusiness, 'id');
      return currentBusinessIds.includes(item.business_id);
    },
    handleRedirect(item) {
      if (this.checkViewPermission(item)) {
        this.$router.push({ name: 'StudentDetail', params: { id: item.student_code }});
      } else {
        return false;
      }
    },
    async getList() {
      this.listLoading = true;
      const rs = await studentRequest.search(this.listQuery);
      this.list = rs.data;
      this.total = rs.total | 0;
      this.from = rs.from | 0;
      this.to = rs.to | 0;
      this.listQuery.page = rs.current_page;
      this.listQuery.limit = rs.per_page;
      this.listLoading = false;
    },
    redirectStudentDetail(internalCode) {
      this.$router.push({ name: 'StudentDetail', params: { id: internalCode.student_code }});
    },
    currentChange() {
      console.log('Current Change');
    },
  },
};
</script>

<style lang="scss" scoped>
.el-icon-arrow-right {
  color: #0059ff;
}
.icon-gray {
  color: #757d87 !important;
}
.m-0 {
  margin: 0px;
}
.p-0 {
  padding: 0px;
}
.ellipsiss {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  width: 160px;
}
.app-container {
  overflow-y: hidden;
  .page-body {
      height: calc(100%);
      width: calc(100% + 24px);
      .no-result-txt {
        text-align: center;
        padding-top: calc(50vh - 80px);
      }
    /deep/ .scroll-content{
      height: calc(100% - 46px);
      width: 100%;
      overflow-x: hidden;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }
  #student_list {

    .el-col-6 {
      &.is-disabled {
        .box-info{
          background: #F5F7FA;
          &:hover{
            box-shadow: none;
          }
        }
      }
      min-width: 273px;;
      min-height: 104px;
      padding-bottom: 25px;
      // margin-right: 24px;
      // padding: 0px !important;
      padding-right: 25px;
      .box-info {
        &:hover{
          box-shadow: grey 0px 0px 2px;
        }
        height: 114px;
        cursor: pointer;
        padding: 17px;
        background-color: #ffffff;
        border-radius: 5px;
        position: relative;
        .row__first {
          margin-bottom: 9px !important;
          .studen__name {
            font-size: 18px;
            height: 22px;
            font-weight: bold;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 100%;
            white-space: nowrap;
          }
        }
        .row__second {
          margin-bottom: 13px !important;
          .studen__school {
            margin-right: 16px;
            display: inline-block;
            font-size: 16px;
            height: 20px;
            line-height: 20px;
            font-weight: normal;
            max-width: calc(100% - 100px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            float: left;
          }
          .studen__status {
            display: inline-block;
            font-size: 14px;
            font-weight: normal;
            min-width: 42px;
            margin-top: 4px;
          }
        }
        .row__third {
          height: 14px;
          .studen__code {
            margin-right: 15px;
            font-size: 14px;
          }
          .studen__grade {
            font-size: 14px;
            color: #919191;
          }
        }
        .btn__student__detail {
          position: absolute;
          right: 20.86px;
          bottom: 15px;
          .el-icon-arrow-right {
            color: #2E67AD;
            font-weight: bold;
            font-size: 14px;
          }
          button {
            border: none;
            background: none;
            cursor: pointer;
          }
        }
      }
    }
  }
  .site__paginate {
    padding-top: 20px;
    .paginate__number {
      position: absolute;
      left: 300px;
      top: 27px
    }
  }
}

.el-row {
  padding: 0px !important;
  margin: 0px !important;
}
</style>
