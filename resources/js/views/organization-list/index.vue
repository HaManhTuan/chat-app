<template>
  <div id="app-container" class="app-container">
    <div id="page-body" ref="pageBody" class="container page-body">
      <el-collapse v-model="activeNames">
        <div v-for="headdivision in headdivisions" :key="headdivision.snz_headdivision_code">
          <el-collapse-item :title="headdivision.snz_headdivision" :name="headdivision.snz_headdivision_code" :disabled="checkDevision(headdivision)" class="tab-headdivision">
            <div v-if="checkNullDevision(headdivision).length > 0" class="box-content">
              <el-row>
                <el-col :span="22">
                  <div class="box-content__item">
                    <div v-for="division in checkNullDevision(headdivision)" :key="division.snz_division_code" class="tab-division">
                      <el-collapse-item :title="division.snz_division" :name="division.snz_division_code" :disabled="checkArea(division)">
                        <div v-if="checkNullArea(division).length > 0" class="box-content">
                          <el-row>
                            <el-col :span="21">
                              <div class="box-item">
                                <div v-for="area in areas.filter((x) =>x.snz_area_code !== null && x.snz_division_code === division.snz_division_code)" :key="area.snz_area_code" class="tab-area">
                                  <el-row>
                                    <el-col :span="20">
                                      <el-collapse-item :title="area.snz_area" :name="area.snz_area_code" :disabled="checkUnit(area)">
                                        <div class="box-item__list">
                                          <el-row>
                                            <el-col :span="20">
                                              <div v-for="unit in units.filter((x) => x.snz_unit !== null && x.snz_area_code === area.snz_area_code)" :key="unit.snz_unit_code" class="box-item__row">
                                                <div class="text">{{ unit.snz_unit }}</div>
                                                <span v-if="unit.status === 2" style="padding: 5px 15px; border-radius: 5px;" class="btn-view">停止</span>
                                              </div>
                                            </el-col>
                                          </el-row>
                                        </div>
                                        <el-col :span="4" />
                                      </el-collapse-item>
                                    </el-col>
                                    <el-col :span="4" />
                                  </el-row>
                                </div>
                              </div>
                            </el-col>
                            <el-col :span="3" />
                          </el-row>
                        </div>
                      </el-collapse-item>
                    </div>
                  </div>
                </el-col>
                <el-col :span="2" />
              </el-row>
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
  </div>
</template>

<script>

import OrganizationResource from '../../api/organizationList';

const OrganizationListResource = new OrganizationResource();

export default {
  name: 'OrganizationList',
  metaInfo: {
    title: '組織一覧',
  },
  data() {
    return {
      headdivisions: [],
      divisions: [],
      areas: [],
      units: [],
      status: null,
      listLoading: true,
      activeNames: ['1'],
      data: {
        snz_headdivision: '',
        snz_division: '',
        snz_area: '',
      },
    };
  },
  async created() {
    await this.getList();
  },
  methods: {
    async getList() {
      const headdivisions = await OrganizationListResource.listHeaddivision();
      this.headdivisions = headdivisions.original;
      const divisions = await OrganizationListResource.listDivision();
      this.divisions = divisions.original;
      const areas = await OrganizationListResource.listArea();
      this.areas = areas.original;
      const units = await OrganizationListResource.listUnit();
      this.units = units.original;
    },
    checkNullDevision(a){
      return this.divisions.filter((x) => x.snz_division_code !== null && x.snz_headdivision_code === a.snz_headdivision_code);
    },
    checkDevision(a){
      const y = this.divisions.filter((x) => x.snz_division_code !== null && x.snz_headdivision_code === a.snz_headdivision_code);
      if (y.length <= 0){
        return true;
      }
      return false;
    },
    checkNullArea(a){
      return this.divisions.filter((x) => x.snz_area_code !== null && x.snz_division_code === a.snz_division_code);
    },
    checkArea(a){
      const y = this.areas.filter((x) => x.snz_area_code !== null && x.snz_division_code === a.snz_division_code);
      if (y.length <= 0){
        return true;
      }
      return false;
    },
    checkUnit(a){
      const y = this.units.filter((x) => x.snz_unit_code !== null && x.snz_area_code === a.snz_area_code);
      if (y.length <= 0){
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  overflow: auto;
}
/deep/ .tab-area.is-disabled .el-collapse-item__header{
  color: #1467B3 !important;
}
/deep/ .el-collapse-item.is-disabled .el-collapse-item__header{
  color: #fff;
  cursor: pointer !important;
  border-bottom: 0 !important;
}
/deep/ .is-disabled{
  .el-collapse-item__arrow{
    display: none;
  }
}
.tab-headdivision, .tab-division {
  margin-bottom: 20px;
}
/deep/ .tab-headdivision {
  position: relative;
}
/deep/ .tab-headdivision .el-collapse-item__arrow{
  position: absolute;
  left: 15px;
}
/deep/ .tab-division {
  position: relative;
}
/deep/ .tab-division .el-collapse-item__arrow{
  position: absolute;
  left: 15px;
}
/deep/ .tab-area {
  position: relative;
}
/deep/ .tab-area .el-collapse-item__arrow{
  position: absolute;
  left: 35px;
}
.btn-view{
  color: #1467b3;
  background-color: #f5f5f5;
  font-weight: 500;
  border: 0;
}
.box-item__row {
  position: relative;
  .btn-view{
    position: absolute;
    right: 0;
    top: 8px;
  }
}
/deep/ .el-collapse-item__content{
  padding-bottom: 0;
}
/deep/ .box-content .box-content__item{
  margin: 20px !important;
  .el-collapse-item__wrap{
    background-color: #F4F8FD !important;
  }
  .box-item{
    margin: 20px !important;
    background-color: #fff;
    .el-collapse-item{
      margin: 0 20px;
    }
    .el-collapse-item__header{
      background-color: #fff;
      color: #1467B3;
      border-bottom: 2px solid #3761b5;
    }
    &__list{
      padding: 0 20px;
      background-color: #fff;
      .text{
        padding: 10px 20px;
        font-weight: 500;
        font-size: 16px;
        border-bottom: 1px solid #D6D6D6;
        margin: -1px 0;
      }
    }
  }
  .el-collapse-item__header{
    background-color: #5B8FBF;
  }
  .el-collapse-item__header .el-collapse-item__arrow {
    font-weight: 800;
  }
}
/deep/ .el-collapse-item__header{
  background-color: #535353;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  padding-left: 45px;
  .el-collapse-item__arrow{
    font-weight: 800;
  }
}
</style>
