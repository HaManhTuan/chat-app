<template>
  <div v-loading="listLoading" class="cantractinfo-form">
    <el-form
      v-if="form.id && !listLoading"
      ref="inputContractForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
    >
      <div class="card-body cantractinfo-detail">
        <div class="card-header">
          <span>情報</span>
        </div>
        <div class="component-item">
          <el-row class="el-row">
            <el-col :span="7">
              <el-form-item
                label="生徒氏名"
                required
                label-width="82px"
                prop="snz_studentcode"
              >
                <el-input
                  v-if="form.student"
                  v-model="form.student.fullname"
                  :disabled="disabledField.snz_studentcode"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="クーリングオフ期限"
                label-width="140px"
                prop="snz_coolingoffdate"
              >
                <el-date-picker
                  v-model="form.snz_coolingoffdate"
                  prefix-icon="abc"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  placeholder=""
                  :disabled="
                    disableRole([
                      'viewonly',
                      'school',
                      'subject',
                      'organization',
                      'callcenter',
                    ])
                  "
                  :editable="false"
                  :append-to-body="false"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar" style="font-size: 17px" />
                </span>
              </el-form-item>
            </el-col>
            <el-col v-if="displayField.snz_experiencefee" :span="9">
              <el-form-item
                label="体験費用区分"
                label-width="140px"
                prop="snz_experiencefee"
              >
                <el-select
                  v-model="form.snz_experiencefee"
                  clearable
                  placeholder=""
                  :disabled="disabledField.snz_experiencefee"
                >
                  <el-option
                    v-for="item in experienceFeeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="
                displayField.snz_selectionappstate &&
                  form.snz_application_type === applicationValue.JOIN
              "
              :span="9"
            >
              <el-form-item
                label="入会選抜申込書提出"
                label-width="140px"
                prop="snz_selectionappstate"
              >
                <el-select
                  v-model="form.snz_selectionappstate"
                  :disabled="disabledField.snz_selectionappstate"
                  clearable
                  placeholder=""
                  @change="changeSelectionAppState"
                >
                  <el-option
                    v-for="item in selectAppStateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="7">
              <el-form-item
                label="校舎"
                required
                label-width="82px"
                prop="businessunit_id"
              >
                <search-select-box
                  v-model="form.businessunit_id"
                  :search-function="searchBusiness"
                  :disabled="disabledField.businessunit_id"
                  placeholder=""
                  popper-class="select-inside-table"
                  :popper-append-to-body="false"
                  :append-query="{ snz_brand: form.snz_brand }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="受講区分"
                label-width="140px"
                prop="snz_contract_type"
              >
                <el-select
                  v-model="form.snz_contract_type"
                  clearable
                  placeholder=""
                  :disabled="disabledField.snz_contract_type"
                >
                  <el-option
                    v-for="item in contractOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="displayField.snz_experiencecancel1" :span="9">
              <el-form-item
                label="体験事前キャンセル"
                label-width="140px"
                prop="snz_experiencecancel1"
              >
                <el-select
                  v-model="form.snz_experiencecancel1"
                  clearable
                  placeholder=""
                  :disabled="
                    disabledField.snz_experiencecancel1 ||
                      form.snz_experiencecancel2 === 1
                  "
                  @change="changeExperienceCancel1"
                >
                  <el-option :value="0" label="ー" />
                  <el-option :value="1" label="✓">
                    <span class="el-checkbox__inner" />
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="
                displayField.snz_selectionresult &&
                  form.snz_application_type === applicationValue.JOIN
              "
              :span="9"
            >
              <el-form-item
                label="入会選抜試験合否"
                label-width="140px"
                prop="snz_selectionresult"
              >
                <el-select
                  v-model="form.snz_selectionresult"
                  clearable
                  :disabled="
                    !(
                      form.snz_selectionappstate ===
                      selectionAppState.SNZ_SELECTIONAPPSTATE_SUBMITTED
                    ) || disabledField.snz_selectionresult
                  "
                  placeholder=""
                  @change="changeSelectionResult"
                >
                  <el-option
                    v-for="item in selectionResultOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="7">
              <el-form-item
                label="受講学年"
                label-width="82px"
                prop="snz_grade_id"
              >
                <el-select
                  v-model="form.snz_grade_id"
                  placeholder=""
                  :no-data-text="CommonTxt.selectboxEmptyTxt"
                  :disabled="
                    disabledField.snz_grade_id ||
                      disableRole(['viewonly', 'callcenter'])
                  "
                  clearable
                  filterable
                  popper-class="select-inside-table"
                  :popper-append-to-body="false"
                  @change="changeGrade"
                >
                  <el-option
                    v-for="item in optionGrades"
                    :key="item.id"
                    :label="item.snz_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="displayField.snz_cantractstartmonth_period_id"
              :span="8"
            >
              <el-form-item
                label="受講開始月"
                label-width="140px"
                prop="snz_cantractstartmonth_period_id"
              >
                <SearchSelectBox
                  ref="changePeriodStartCantract"
                  v-model="form.snz_cantractstartmonth_period_id"
                  :disabled="disabledField.snz_cantractstartmonth_period_id"
                  :search-function="searchNameTargetPeriod"
                  :default-data="targetPeriodOptions"
                  :default-value="form.cantract_start_month"
                  key-name="snz_name"
                  key-id="id"
                  placeholder=""
                  :popper-append-to-body="false"
                  :append-query="{ businessunit_id: form.businessunit_id }"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="displayField.snz_experiencecancel2" :span="9">
              <el-form-item
                label="体験途中キャンセル"
                label-width="140px"
                prop="snz_experiencecancel2"
              >
                <el-select
                  v-model="form.snz_experiencecancel2"
                  clearable
                  placeholder=""
                  :disabled="
                    disabledField.snz_experiencecancel2 ||
                      form.snz_experiencecancel1 === 1
                  "
                  @change="changeExperienceCancel2"
                >
                  <el-option :value="0" label="ー" />
                  <el-option :value="1" label="✓">
                    <span class="el-checkbox__inner" />
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="7">
              <el-form-item
                label="年度"
                required
                label-width="82px"
                prop="snz_schoolyear"
              >
                <el-select
                  v-model="form.snz_schoolyear"
                  value-key="value"
                  placeholder=""
                  :disabled="
                    disableRole(['viewonly']) || disabledField.snz_schoolyear
                  "
                  :editable="false"
                  :append-to-body="false"
                  loading-text="データなし"
                  :no-match-text="CommonTxt.selectboxEmptyTxt"
                  :no-data-text="CommonTxt.selectboxEmptyTxt"
                  @change="changeSchoolYear"
                >
                  <el-option
                    v-for="(item, index) in schoolYearRanges"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="displayField.snz_cantractendmonth_period_id"
              :span="8"
            >
              <el-form-item
                label="受講終了月"
                label-width="140px"
                prop="snz_cantractendmonth_period_id"
              >
                <SearchSelectBox
                  :ref="
                    displayField.snz_cantractendmonth_period_id
                      ? 'changePeriodCantract'
                      : ''
                  "
                  v-model="form.snz_cantractendmonth_period_id"
                  :search-function="searchNameTargetPeriod"
                  :default-data="targetPeriodOptions"
                  :default-value="form.cantract_end_month"
                  :disabled="disabledField.snz_cantractendmonth_period_id"
                  key-name="snz_name"
                  key-id="id"
                  placeholder=""
                  :popper-append-to-body="false"
                  :append-query="{ businessunit_id: form.businessunit_id }"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="
                displayField.snz_entermonth_period_id &&
                  form.snz_application_type === applicationValue.EXPERIENCE
              "
              :span="9"
            >
              <el-form-item
                label="入会月"
                label-width="140px"
                prop="snz_entermonth_period_id"
              >
                <SearchSelectBox
                  :ref="
                    displayField.snz_entermonth_period_id &&
                      form.snz_application_type === applicationValue.EXPERIENCE
                      ? 'changePeriod'
                      : ''
                  "
                  v-model="form.snz_entermonth_period_id"
                  :search-function="searchNameTargetPeriod"
                  :default-data="targetPeriodOptions"
                  :default-value="form.enter_month"
                  :disabled="disabledField.snz_entermonth_period_id"
                  key-name="snz_name"
                  key-id="id"
                  placeholder=""
                  :popper-append-to-body="false"
                  :append-query="{ businessunit_id: form.businessunit_id }"
                  @onChange="
                    (value, object) =>
                      changeEnterMonth(
                        'snz_entermonth_period_id',
                        value,
                        object
                      )
                  "
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="7">
              <el-form-item
                label="コース"
                required
                label-width="82px"
                prop="snz_course_id"
              >
                <SearchSelectBox
                  v-model="form.snz_course_id"
                  :search-function="searchNameCourse"
                  key-name="snz_name"
                  key-id="id"
                  placeholder=""
                  :disabled="disabledField.snz_course_id"
                  :popper-append-to-body="false"
                  :append-query="{
                    businessunit_id: form.businessunit_id,
                    grade_id: form.snz_grade_id,
                    schoolYear: form.snz_schoolyear,
                  }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="科目セット"
                label-width="140px"
                required
                prop="snz_subjectset_id"
              >
                <SearchSelectBox
                  ref="changeSubjectSet"
                  v-model="form.snz_subjectset_id"
                  :search-function="searchNameSubjectSet"
                  key-name="snz_display_name"
                  key-id="id"
                  placeholder=""
                  :clearable="false"
                  :disabled="disabledField.snz_subjectset_id"
                  :popper-append-to-body="false"
                  :append-query="{
                    business_id: form.businessunit_id,
                    grade_id: form.snz_grade_id,
                    school_year: form.snz_schoolyear,
                    course_id: form.snz_course_id,
                    pattern_id: form.business_unit
                      ? form.business_unit.snz_calendar_pattern_id
                      : null,
                  }"
                  @onChange="onChangeSubjectSet"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="
                displayField.snz_selectionappstate &&
                  form.snz_application_type === applicationValue.EXPERIENCE
              "
              :span="9"
            >
              <el-form-item
                label="入会選抜申込書提出"
                label-width="140px"
                prop="snz_selectionappstate"
              >
                <el-select
                  v-model="form.snz_selectionappstate"
                  :disabled="disabledField.snz_selectionappstate"
                  clearable
                  placeholder=""
                  @change="changeSelectionAppState"
                >
                  <el-option
                    v-for="item in selectAppStateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="7">
              <el-form-item
                label="申込区分"
                required
                label-width="82px"
                prop="snz_application_type"
              >
                <el-select
                  v-model="form.snz_application_type"
                  :disabled="disabledField.snz_application_type"
                  clearable
                  placeholder=""
                >
                  <el-option
                    v-for="item in applicationOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="displayField.snz_experiencestartmonth_period_id"
              :span="8"
            >
              <el-form-item
                label="体験開始月"
                label-width="140px"
                prop="snz_experiencestartmonth_period_id"
              >
                <SearchSelectBox
                  :ref="
                    displayField.snz_experiencestartmonth_period_id
                      ? 'changePeriod'
                      : ''
                  "
                  v-model="form.snz_experiencestartmonth_period_id"
                  :search-function="searchNameTargetPeriod"
                  :default-data="targetPeriodOptions"
                  :default-value="form.experience_start_month"
                  :disabled="disabledField.snz_experiencestartmonth_period_id"
                  key-name="snz_name"
                  key-id="id"
                  placeholder=""
                  :popper-append-to-body="false"
                  :append-query="{ businessunit_id: form.businessunit_id }"
                  @onChange="
                    (value, object) =>
                      changeExperience(value, object, 'experience_start_month')
                  "
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="
                displayField.snz_entermonth_period_id &&
                  form.snz_application_type === applicationValue.JOIN
              "
              :span="8"
            >
              <el-form-item
                label="入会月"
                label-width="140px"
                prop="snz_entermonth_period_id"
              >
                <SearchSelectBox
                  :ref="
                    displayField.snz_entermonth_period_id &&
                      form.snz_application_type === applicationValue.JOIN
                      ? 'changePeriod'
                      : ''
                  "
                  v-model="form.snz_entermonth_period_id"
                  :search-function="searchNameTargetPeriod"
                  :default-data="targetPeriodOptions"
                  :default-value="form.enter_month"
                  :disabled="disabledField.snz_entermonth_period_id"
                  key-name="snz_name"
                  key-id="id"
                  placeholder=""
                  :popper-append-to-body="false"
                  :append-query="{ businessunit_id: form.businessunit_id }"
                  @onChange="
                    (value, object) =>
                      changeEnterMonth(
                        'snz_entermonth_period_id',
                        value,
                        object
                      )
                  "
                />
              </el-form-item>
            </el-col>
            <el-col
              v-if="
                displayField.snz_selectionresult &&
                  form.snz_application_type === applicationValue.EXPERIENCE
              "
              :span="9"
            >
              <el-form-item
                label="入会選抜試験合否"
                label-width="140px"
                prop="snz_selectionresult"
              >
                <el-select
                  v-model="form.snz_selectionresult"
                  clearable
                  :disabled="
                    !(
                      form.snz_selectionappstate ===
                      selectionAppState.SNZ_SELECTIONAPPSTATE_SUBMITTED
                    ) || disabledField.snz_selectionresult
                  "
                  placeholder=""
                  @change="changeSelectionResult"
                >
                  <el-option
                    v-for="item in selectionResultOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="7">
              <el-form-item
                label="申込日"
                required
                label-width="82px"
                prop="snz_applicationdate"
              >
                <el-date-picker
                  v-model="form.snz_applicationdate"
                  prefix-icon="abc"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  placeholder=""
                  :disabled="
                    disableRole(['viewonly']) ||
                      disabledField.snz_applicationdate
                  "
                  :editable="false"
                  :append-to-body="false"
                  :picker-options="pickerBeginDateBefore"
                  @change="changeApplicationDate"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar" style="font-size: 17px" />
                </span>
              </el-form-item>
            </el-col>
            <el-col
              v-if="displayField.snz_experienceendmonth_period_id"
              :span="8"
            >
              <el-form-item
                label="体験終了月"
                label-width="140px"
                prop="snz_experienceendmonth_period_id"
              >
                <SearchSelectBox
                  :ref="
                    displayField.snz_experienceendmonth_period_id
                      ? 'changePeriod'
                      : ''
                  "
                  v-model="form.snz_experienceendmonth_period_id"
                  :search-function="searchNameTargetPeriod"
                  :default-data="targetPeriodOptions"
                  :default-value="form.experience_end_month"
                  :disabled="disabledField.snz_experienceendmonth_period_id"
                  key-name="snz_name"
                  key-id="id"
                  placeholder=""
                  :popper-append-to-body="false"
                  :append-query="{ businessunit_id: form.businessunit_id }"
                  @onChange="
                    (value, object) =>
                      changeExperience(value, object, 'experience_end_month')
                  "
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="card-body subject-table">
        <div class="card-header">
          <span>科目</span>
        </div>
        <div class="body">
          <div class="header-label">
            <el-row class="el-row">
              <el-col
                v-if="form.business_unit && form.business_unit.snz_brand === 7"
                width="225px"
              >
                <el-form-item label="科目コード" class="required" />
              </el-col>
              <el-col width="225px">
                <el-form-item label="科目" class="required" />
              </el-col>
              <el-col width="225px">
                <el-form-item label="開始月" class="required" />
              </el-col>
              <el-col width="225px">
                <el-form-item label="終了月" class="required" />
              </el-col>
              <el-col width="40px">
                <el-form-item label="削除" />
              </el-col>
            </el-row>
          </div>
          <div class="body-container">
            <el-row
              v-for="(row, index) in form.cantract_info_subjects"
              :key="index"
              class="el-row"
            >
              <el-col
                v-if="form.business_unit && form.business_unit.snz_brand === 7"
                width="225px"
              >
                <el-form-item
                  :prop="
                    `cantract_info_subjects.${index}.subject.snz_subjectcd`
                  "
                  :rules="rules.snz_subjectcd"
                >
                  <el-input
                    v-model="row.subject.snz_subjectcd"
                    :disabled="
                      disableRole(['viewonly', 'callcenter']) ||
                        disabledField.snz_subjects
                    "
                    placeholder=""
                    @blur="item => handleBlur(item, index)"
                  />
                </el-form-item>
              </el-col>
              <el-col width="225px">
                <el-form-item
                  :prop="`cantract_info_subjects.${index}.snz_subject_id`"
                  :rules="rules.snz_subject_id"
                >
                  <SearchSelectBox
                    ref="changeSubject"
                    v-model="row.snz_subject_id"
                    :search-function="searchNameSubjectMst"
                    :default-data="row.subjectOptions"
                    :default-value="row.subject"
                    key-name="snz_name"
                    key-id="id"
                    :disabled="
                      disableRole(['viewonly', 'callcenter']) ||
                        disabledField.snz_subjects
                    "
                    placeholder=""
                    :append-query="{
                      snz_subjectset_id: form.snz_subjectset_id,
                      snz_default_section: 1,
                      snz_brand: form.snz_brand,
                    }"
                    @onChange="value => changeSubject(index, value)"
                  />
                </el-form-item>
              </el-col>
              <el-col width="225px">
                <el-form-item
                  :prop="
                    `cantract_info_subjects.${index}.snz_startmonth_period_id`
                  "
                  :rules="rules.snz_startmonth_period_id"
                >
                  <SearchSelectBox
                    ref="changePeriod"
                    v-model="row.snz_startmonth_period_id"
                    :search-function="searchNameTargetPeriod"
                    :default-data="row.targetPeriodOptions"
                    :default-value="row.start_month_period"
                    :disabled="
                      disableRole(['viewonly', 'callcenter']) ||
                        disabledField.snz_subjects
                    "
                    key-name="snz_name"
                    key-id="id"
                    placeholder=""
                    :append-query="{
                      businessunit_id: form.businessunit_id,
                      order_desc_start: true,
                    }"
                    @onChange="
                      (value, object) => changeStartMonth(index, value, object)
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col width="225px">
                <el-form-item
                  :prop="
                    `cantract_info_subjects.${index}.snz_endmonth_period_id`
                  "
                  :rules="rules.snz_endmonth_period_id"
                >
                  <SearchSelectBox
                    ref="changePeriod"
                    v-model="row.snz_endmonth_period_id"
                    :search-function="searchNameTargetPeriod"
                    :default-data="row.targetPeriodOptions"
                    :default-value="row.end_month_period"
                    :disabled="
                      disableRole(['viewonly', 'callcenter']) ||
                        disabledField.snz_subjects
                    "
                    key-name="snz_name"
                    key-id="id"
                    placeholder=""
                    :append-query="{
                      businessunit_id: form.businessunit_id,
                      order_desc_start: true,
                    }"
                    @onChange="
                      (value, object) => changeEndMonth(index, value, object)
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col width="40px">
                <el-button
                  class="btn-delete"
                  :disabled="
                    disableRole(['viewonly', 'callcenter']) ||
                      disabledField.snz_subjects ||
                      (form.cantract_info_subjects.length === 1 &&
                      !(
                        form.subject_set &&
                        form.subject_set.snz_update_subject_flag
                      ))
                  "
                  @click.prevent="deleteSubject(index, row)"
                >
                  <svg-icon icon-class="_trash" />
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-button
          class="btn-create btn-subject"
          :class="[
            (form.business_unit && form.business_unit.snz_brand) === 7
              ? 'button-subject-code-column'
              : 'button-no-subject-code-column',
          ]"
          icon="el-icon-circle-plus"
          :disabled="
            disableRole(['viewonly', 'callcenter']) ||
              disabledField.snz_subjects
          "
          @click="addSubjectRow"
        >
          <span>科目を追加</span>
        </el-button>
      </div>
      <div class="card-body discounts">
        <div class="card-header">
          <span>割引・キャンペーン</span>
        </div>
        <div v-if="!listDiscountLoading" class="component-item" width="411px">
          <el-row
            v-for="(row, index) in form.discounts"
            :key="index"
            class="el-row"
          >
            <el-col :span="10" class="d-flex">
              <el-form-item
                :label="'割引' + (index + 1)"
                label-width="54px"
                :prop="`discounts.${index}.id`"
              >
                <SearchSelectBox
                  ref="refDiscount"
                  v-model="row.id"
                  :default-data="discountOptions"
                  :default-value="row"
                  :search-function="getDiscount"
                  :disabled="
                    disabledField.snz_discount ||
                      disableRole(['viewonly', 'callcenter'])
                  "
                  key-name="snz_name"
                  key-id="id"
                  placeholder=""
                  :append-query="{
                    student_code: form.snz_studentcode,
                    grade_id: form.snz_grade_id,
                    school_year: form.snz_schoolyear,
                    businessunit_id: form.businessunit_id,
                  }"
                  @onChange="
                    (value, object) =>
                      changeDiscount(
                        value,
                        object,
                        index,
                        `discounts.${index}.id`
                      )
                  "
                />
              </el-form-item>
              <span>
                <el-button
                  class="btn-delete ml-24"
                  :disabled="
                    disableRole(['viewonly', 'callcenter']) ||
                      disabledField.snz_discount
                  "
                  @click.prevent="deleteDiscount(index, row)"
                >
                  <svg-icon icon-class="_trash" />
                </el-button>
              </span>
            </el-col>
          </el-row>
        </div>
        <el-button
          class="btn-create btn-discount"
          icon="el-icon-circle-plus"
          :disabled="
            disableRole(['viewonly', 'callcenter']) ||
              form.discounts.length >= 10 ||
              disabledField.snz_discount
          "
          @click="addSDiscountRow"
        >
          <span>割引を追加</span>
        </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import permission from '@/directive/permission/index.js';
import role from '@/directive/role/index.js';
import GradeRequest from '@/api/gradeRequest';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import CourseRequest from '@/api/CourseRequest';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';
import SubjectSetRequest from '@/api/SubjectSetRequest';
import SubjectMstSubjectSetRequest from '@/api/SubjectMstSubjectSetRequest';
import SubjectMstRequest from '@/api/contractSubjectMst';
import { InputCantractInfoMixin } from '@/views/cantractinfo/mixins/InputCantractInfo';
import { CantractInfoDetail } from '@/views/cantractinfo/assets/validate';
import { DatePickerMixin } from '@/helpers/mixins/DatePickerMixin';

import {
  applicationName,
  applicationValue,
  applicationOptions,
  experienceFeeName,
  experienceFeeOptions,
  experienceCancelName,
  experienceCancelOptions,
  stateSendDataName,
  stateSendDataOptions,
  stateSendDataUpdateName,
  stateSendDataUpdateOptions,
  selectAppStateName,
  selectAppStateOptions,
  selectionResultName,
  selectionResultOptions,
  contractTypeName,
  contractOptions,
  selectionAppState,
  selectionResult,
} from '@/const/CantractInfo';
import DiscountRequest from '@/api/DiscountRequest';
import BusinessUnitRequest from '@/api/BusinessUnitRequest';
import DateMethod from '@/mixins/date';

const courseRequest = new CourseRequest();
const gradeRequest = new GradeRequest();
const targetPeriodRequest = new TargetPeriodRequest();
const subjectSetRequest = new SubjectSetRequest();
const subjectMstSubjectSetRequest = new SubjectMstSubjectSetRequest();
const subjectMstRequest = new SubjectMstRequest();
const discountRequest = new DiscountRequest();
const businessResource = new BusinessUnitRequest();
export default {
  name: 'InputCantracinfo',
  metaInfo: {
    title: '受講情報詳細',
  },
  directives: { permission, role },
  components: { SearchSelectBox },
  filters: {},
  mixins: [
    InputCantractInfoMixin,
    CantractInfoDetail,
    DateMethod,
    DatePickerMixin,
  ],
  props: {
    form: {
      type: Object,
      required: true,
    },
    disabledField: {
      type: Object,
      required: true,
    },
    displayField: {
      type: Object,
      required: true,
    },
    targetPeriodOptions: {
      type: Array,
      require: true,
      default: () => {
        return [];
      },
    },
    defaultSubjectOptions: {
      type: Array,
      require: true,
      default: () => {
        return [];
      },
    },
    defaultDiscountOptions: {
      type: Array,
      require: true,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      schoolYearRanges: this.getSchoolYear(),
      selectionAppState: selectionAppState,
      applicationValue: applicationValue,
      selectionResult: selectionResult,
      applicationName: applicationName,
      applicationOptions: applicationOptions,
      experienceFeeName: experienceFeeName,
      experienceFeeOptions: experienceFeeOptions,
      experienceCancelName: experienceCancelName,
      experienceCancelOptions: experienceCancelOptions,
      stateSendDataName: stateSendDataName,
      stateSendDataOptions: stateSendDataOptions,
      stateSendDataUpdateName: stateSendDataUpdateName,
      stateSendDataUpdateOptions: stateSendDataUpdateOptions,
      selectAppStateName: selectAppStateName,
      selectAppStateOptions: selectAppStateOptions,
      selectionResultName: selectionResultName,
      selectionResultOptions: selectionResultOptions,
      contractTypeName: contractTypeName,
      contractOptions: contractOptions,
      disabledSelect: null,
      originForm: null,
      gradeOptions: [],
      taiousyaUsers: [],
      loadingSearchTaiousya: false,
      queryTaiousyaUsers: null,
      pageTaiousyaUsers: 1,
      interviewerUsers: [],
      queryInterviewer: null,
      pageInterviewer: 1,
      loadingInterviewerUsers: false,
      disableApproachend: false,
      checkDuplicateLoading: false,
      defaultUsers: [],
      defaultTargetPeriod: [],
      listLoading: false,
      listSubjectLoading: false,
      listDiscountLoading: false,
      rows: [1],
      discounts: [],
      subjectOptions: [],
      discountOptions: [],
      subjectCodeOption: [],
      optionGrades: [],
      pickerAllDate: {},
    };
  },
  computed: {},
  async created() {
    this.getOptionGrade();
    this.init();
    // await this.setTargetOfSubject();
  },
  methods: {
    async init() {
      this.listLoading = true;
      this.listDiscountLoading = true;
      this.subjectOptions = JSON.parse(
        JSON.stringify(this.defaultSubjectOptions)
      );
      this.discountOptions = JSON.parse(
        JSON.stringify(this.defaultDiscountOptions)
      );
      if (_.isEmpty(this.form.discounts)) {
        this.form.discounts = [];
        await this.addSDiscountRow();
      }
      this.subjectCodeOption = Object.assign(
        await this.searchSubjectCodeQuery()
      );
      this.originForm = JSON.parse(JSON.stringify(this.form));
      this.listLoading = false;
      this.listDiscountLoading = false;
    },
    initSubject() {
      this.$nextTick(() => {
        if (this.$refs.changeSubject) {
          if (Array.isArray(this.$refs.changeSubject)) {
            this.$refs.changeSubject.forEach(value => value.init());
          } else {
            this.$refs.changeSubject.init();
          }
        }
      });
    },
    initTarget() {
      this.$nextTick(() => {
        if (this.$refs.changePeriod) {
          if (Array.isArray(this.$refs.changePeriod)) {
            this.$refs.changePeriod.forEach(value => value.init());
          } else {
            this.$refs.changePeriod.init();
          }
        }
      });
    },
    initSubjectSet() {
      this.$nextTick(() => {
        if (this.$refs.changeSubjectSet) {
          this.$refs.changeSubjectSet.init();
        }
      });
    },
    initDiscount() {
      this.$nextTick(() => {
        if (this.$refs.refDiscount) {
          if (Array.isArray(this.$refs.refDiscount)) {
            this.$refs.refDiscount.forEach(value => value.init());
          } else {
            this.$refs.refDiscount.init();
          }
        }
      });
    },
    initChangePeriodEndCantract() {
      this.$nextTick(() => {
        if (this.$refs.changePeriodCantract) {
          this.$refs.changePeriodCantract.init();
        }
      });
    },
    initChangePeriodStartCantract() {
      this.$nextTick(() => {
        if (this.$refs.changePeriodStartCantract) {
          this.$refs.changePeriodStartCantract.init();
        }
      });
    },
    addSubjectRow() {
      let row = {
        disabledRow: false,
        snz_startmonth_period_id: null,
        snz_endmonth_period_id: null,
        end_month_period: null,
        start_month_period: null,
        snz_subject_id: null,
        snz_subjectset_id: null,
        subject: {
          snz_subjectcd: null,
        },
      };
      row = this.initOneSubject(
        row,
        this.subjectOptions,
        this.targetPeriodOptions
      );
      this.form.cantract_info_subjects.push(row);
    },
    insertSubjectDefaultRow() {
      const row = {
        defaultRow: true,
        disabledRow: true,
        snz_startmonth_period_id: null,
        snz_endmonth_period_id: null,
        end_month_period: null,
        start_month_period: null,
        snz_subject_id: null,
        snz_subjectset_id: null,
        subject: {
          snz_subjectcd: null,
        },
      };
      this.form.cantract_info_subjects.push(row);
    },
    async deleteSubject(index, row) {
      this.form.cantract_info_subjects.splice(index, 1);
      await this.fetchContractMonth();
    },
    deleteDiscount(index, row) {
      this.form.discounts.splice(index, 1);
    },
    tableHeaderColor() {
      return 'background-color: #ffffff;color: #000000 !important;padding-left:10px';
    },
    tableHeaderDisplay() {
      return 'display: none;';
    },
    tableRowStyle() {
      return {
        'padding-left': '10px',
        height: '36px',
        'padding-bottom': '20px',
      };
    },
    addSDiscountRow() {
      const row = {
        id: null,
        snz_name: null,
      };
      this.form.discounts.push(row);
    },
    async searchNameGrade(query) {
      return gradeRequest.gradeSearchName(query);
    },
    async searchNameCourse(query) {
      return courseRequest.searchName(query);
    },
    async searchNameTargetPeriod(query) {
      return targetPeriodRequest.searchName(query);
    },
    async searchNameSubjectSet(query) {
      return subjectSetRequest.searchName(query);
    },
    async searchNameSubjectMst(query) {
      return subjectMstRequest.searchName(query);
    },
    async getDiscount(query) {
      return discountRequest.searchNameDiscount(query);
    },
    async onChangeSubjectSet(value, object) {
      this.listSubjectLoading = true;
      this.form.subject_set = object;
      if (value) {
        const options = await subjectMstRequest.searchName({
          snz_subjectset_id: value,
          snz_default_section: 1,
          snz_brand: this.form.snz_brand,
        });
        this.subjectOptions = options.data;
      } else {
        this.subjectOptions = [];
      }
      const res = await subjectMstSubjectSetRequest.getListSubjectDefault({
        snz_subjectset_id: value,
      });
      this.form.cantract_info_subjects = await this.initListSubject(
        res,
        this.subjectOptions,
        this.targetPeriodOptions,
        true
      );
      this.form.cantract_info_subject_default = res;
      const cantracStartMonth = await this.getCantractStartMonth(
        this.form.cantract_info_subjects
      );
      this.form.cantract_start_month = cantracStartMonth;
      this.form.snz_cantractstartmonth_period_id = cantracStartMonth
        ? cantracStartMonth.id
        : null;
      const cantracEndtMonth = await this.getCantractEndMonth(
        this.form.cantract_info_subjects
      );
      this.form.cantract_end_month = cantracEndtMonth;
      this.form.snz_cantractendmonth_period_id = cantracEndtMonth
        ? cantracEndtMonth.id
        : null;
      // this.subjectCodeOption = Object.assign(await this.searchSubjectCodeQuery());
      await this.setTargetOfSubject();
      await this.initTarget();
      await this.initSubject();
      this.listSubjectLoading = false;
    },
    async calSubject(index, value, subjectCode = null) {
      const resultData = JSON.parse(
        JSON.stringify(this.form.cantract_info_subjects)
      );
      if (value) {
        if (this.form.subject_set.snz_brand !== 7) {
          if (this.form.snz_subjectset_id) {
            await subjectMstSubjectSetRequest
              .getOneSubject({
                snz_subjectset_id: this.form.snz_subjectset_id,
                snz_subject_id: value,
              })
              .then(res => {
                let data = res;
                data = this.initOneSubject(
                  data,
                  this.subjectOptions,
                  this.targetPeriodOptions
                );
                resultData[index] = data || resultData[index];
              })
              .catch()
              .finally();
          }
        } else {
          await subjectMstRequest
            .getOneSubject({ id: value })
            .then(res => {
              const data = res;
              let dataRow = {
                snz_startmonth_period_id: null,
                snz_endmonth_period_id: null,
                end_month_period: null,
                start_month_period: null,
                snz_subject_id: data.id || null,
                snz_subjectset_id: resultData[index].snz_subjectset_id,
                subject: data,
              };
              dataRow = this.initOneSubject(
                dataRow,
                this.subjectOptions,
                this.targetPeriodOptions
              );
              resultData[index] = dataRow;
            })
            .catch()
            .finally();
        }
      } else {
        let clearRow = {
          snz_startmonth_period_id: null,
          snz_endmonth_period_id: null,
          end_month_period: null,
          start_month_period: null,
          snz_subject_id: null,
          snz_subjectset_id: null,
          subject: {
            id: null,
            snz_subjectcd: subjectCode,
          },
        };
        clearRow = this.initOneSubject(
          clearRow,
          this.subjectOptions,
          this.targetPeriodOptions
        );
        resultData[index] = clearRow;
      }
      if (this.form.snz_brand === 7) {
        const enterMonth = this.form.enter_month || null;
        const applicationType = this.form.snz_application_type;
        const experience_end_month = this.form.experience_end_month || null;
        const experience_start_month = this.form.experience_start_month || null;
        const onlineDate = this.form.system_date.snz_onlinedate;
        const calendarPatternId = this.form.business_unit
          ? this.form.business_unit.snz_calendar_pattern_id
          : null;
        const subjects = JSON.parse(JSON.stringify(resultData));
        const targetSubjectOptions = await this.getStartAndEndTargetOfSubject(
          [subjects[index]],
          calendarPatternId
        );
        resultData[index] = await this.getTargetPeriodPeriodBrand7(
          subjects[index],
          enterMonth,
          applicationType,
          onlineDate,
          experience_end_month,
          experience_start_month,
          calendarPatternId,
          targetSubjectOptions
        );
      }
      await this.changeStartMonth(
        index,
        resultData[index].snz_startmonth_period_id,
        resultData[index].start_month_period
      );
      await this.changeEndMonth(
        index,
        resultData[index].snz_endmonth_period_id,
        resultData[index].end_month_period
      );
      this.form.cantract_info_subjects = await JSON.parse(
        JSON.stringify(resultData)
      );
    },
    async changeSubject(index, value, subjectCode = null) {
      this.listSubjectLoading = true;
      await this.calSubject(index, value, (subjectCode = null));
      this.listSubjectLoading = false;
      await this.initSubject();
      await this.initTarget();
    },
    getSchoolYear() {
      const schoolyear = this.form.snz_schoolyear;
      const year = this.getCurrentSchoolYear();
      const option = {
        label: `${schoolyear} 年度`,
        value: schoolyear,
      };
      let options = [
        {
          label: `${year - 1} 年度`,
          value: String(year - 1),
        },
        {
          label: `${year} 年度`,
          value: String(year),
        },
        {
          label: `${year + 1} 年度`,
          value: String(year + 1),
        },
      ];
      options = _.unionBy(options, [option], 'value');
      return options;
    },
    async changeGrade() {
      // clear schoolyear
      // clear course
      // clear subject set
      this.listSubjectLoading = true;
      this.listDiscountLoading = true;
      // await this.clearCourse();
      await this.clearSchoolYear();
      await this.clearSubjectSet();
      await this.clearDiscounts();
      this.initTarget();
      this.listSubjectLoading = false;
      this.listDiscountLoading = false;
    },
    async changeSchoolYear() {
      // clear schoolyear
      // clear course
      // clear subject set
      this.listSubjectLoading = true;
      this.listDiscountLoading = true;
      // await this.clearCourse();
      await this.clearSubjectSet();
      await this.clearDiscounts();
      this.initTarget();
      this.listSubjectLoading = false;
      this.listDiscountLoading = false;
    },
    clearSchoolYear() {
      this.form.snz_schoolyear = null;
    },
    clearCourse() {
      this.form.snz_course_id = null;
    },
    async clearSubjectSet() {
      this.form.snz_subjectset_id = null;
      this.clearCantractInfoSubjects();
      await this.initSubjectSet();
    },
    clearCantractInfoSubjects() {
      this.form.cantract_info_subjects = [];
    },
    async clearDiscounts() {
      this.form.discounts = [];
      await this.addSDiscountRow();
      this.initDiscount();
    },
    changeExperienceCancel2() {
      if (this.form.snz_experiencecancel2) {
        this.form.snz_experiencecancel1 = 0;
      }
    },
    changeExperienceCancel1() {
      if (this.form.snz_experiencecancel1) {
        this.form.snz_experiencecancel2 = 0;
      }
    },
    changeSelectionAppState() {
      if (
        this.form.snz_selectionappstate !==
        selectionAppState.SNZ_SELECTIONAPPSTATE_SUBMITTED
      ) {
        this.form.snz_selectionresult =
          selectionResult.SNZ_SELECTIONRESULT_NOT_TEST;
        this.changeSelectionResult();
      }
    },
    async changeExperience(value, object, prop) {
      if (
        this.form.snz_experiencestartmonth_period_id &&
        this.form.snz_experienceendmonth_period_id
      ) {
        this.disabledField.snz_experiencecancel1 = false;
        this.disabledField.snz_experiencecancel2 = false;
        this.disabledField.snz_selectionappstate = false;
        this.disabledField.snz_selectionresult = false;
      } else {
        this.disabledField.snz_experiencecancel1 = true;
        this.disabledField.snz_experiencecancel2 = true;
        this.disabledField.snz_selectionappstate = true;
        this.disabledField.snz_selectionresult = true;
      }
      this.form[prop] = value ? object : null;
      await this.setTargetOfSubject();
    },
    changeSelectionResult() {
      if (
        this.form.snz_selectionresult !==
        selectionResult.SNZ_SELECTIONRESULT_PASS
      ) {
        this.form.snz_entermonth_period_id = this.originForm.snz_entermonth_period_id;
        this.disabledField.snz_entermonth_period_id = true;
      } else {
        this.disabledField.snz_entermonth_period_id = false;
      }
    },
    changeApplicationDate() {
      if (this.form.snz_applicationdate) {
        const coolingoffdate = moment(this.form.snz_applicationdate)
          .add(7, 'days')
          .format('YYYY-MM-DD');
        this.form.snz_coolingoffdate = coolingoffdate;
      }
    },
    async searchSubjectCodeQuery(query) {
      const res = await subjectMstRequest.searchSubjectCode({
        snz_subjectcd: query,
      });
      return res.original;
    },
    async handleBlur(item, index) {
      this.listSubjectLoading = true;
      let value = this.form.cantract_info_subjects[index].subject.snz_subjectcd;
      const options = this.subjectCodeOption;
      if (value) {
        value = value.trim();
      }
      const inputItem = options.find(element => element.value === value);
      if (inputItem !== undefined && inputItem !== null) {
        await this.calSubject(index, inputItem.id);
      } else {
        await this.calSubject(index, null, value);
      }
      this.initTarget();
      this.initSubject();
      this.listSubjectLoading = false;
    },
    async setTargetOfSubject() {
      this.listSubjectLoading = true;
      const res = await this.fetchStartMonthForSubject(this.form);
      this.$set(this.form, 'cantract_info_subjects', res);
      await this.fetchContractMonth();
      this.initTarget();
      this.listSubjectLoading = false;
    },
    async fetchContractMonth() {
      var setForm = JSON.parse(JSON.stringify(this.form));
      setForm = await this.setCantractMonth(setForm);
      this.form.snz_cantractendmonth_period_id =
        setForm.snz_cantractendmonth_period_id;
      this.form.snz_cantractstartmonth_period_id =
        setForm.snz_cantractstartmonth_period_id;
      this.form.cantract_end_month = setForm.cantract_end_month;
      this.form.cantract_start_month = setForm.cantract_start_month;
      this.initChangePeriodStartCantract();
      this.initChangePeriodEndCantract();
    },
    async changeStartMonth(index, value, object) {
      this.listSubjectLoading = true;
      const resultData = JSON.parse(
        JSON.stringify(this.form.cantract_info_subjects)
      );
      resultData[index].start_month_period = value ? object : null;
      if (this.form.snz_brand !== 7) {
        if (value) {
          if (
            !this.form.cantract_info_subjects[index].snz_endmonth_period_id &&
            resultData[index].snz_subject_id
          ) {
            await subjectMstSubjectSetRequest
              .getOneSubject({
                snz_subjectset_id: this.form.snz_subjectset_id,
                snz_subject_id: resultData[index].snz_subject_id,
              })
              .then(res => {
                resultData[index].end_month_period = res.end_month_period;
                resultData[index].snz_endmonth_period_id =
                  res.snz_endmonth_period_id;
              })
              .catch()
              .finally(() => {
                this.listSubjectLoading = false;
              });
          }
        }
      }
      this.form.cantract_info_subjects = JSON.parse(JSON.stringify(resultData));
      if (this.form.cantract_info_subjects) {
        const cantracStartMonth = await this.getCantractStartMonth(resultData);
        this.form.cantract_start_month = cantracStartMonth;
        this.form.snz_cantractstartmonth_period_id = cantracStartMonth
          ? cantracStartMonth.id
          : null;
      }
      this.initTarget();
      this.initChangePeriodStartCantract();
      this.listSubjectLoading = false;
    },
    async changeEndMonth(index, value, object) {
      this.listSubjectLoading = true;
      var cantractSubject = JSON.parse(
        JSON.stringify(this.form.cantract_info_subjects)
      );
      cantractSubject[index].end_month_period = value ? object : null;
      if (this.form.cantract_info_subjects) {
        const cantracEndtMonth = await this.getCantractEndMonth(
          cantractSubject
        );
        this.form.cantract_end_month = cantracEndtMonth;
        this.form.snz_cantractendmonth_period_id = cantracEndtMonth
          ? cantracEndtMonth.id
          : null;
      }
      this.initTarget();
      this.initChangePeriodEndCantract();
      this.form.cantract_info_subjects = JSON.parse(
        JSON.stringify(cantractSubject)
      );
      this.listSubjectLoading = false;
    },
    async searchBusiness(query) {
      return await businessResource.searchName(query);
    },
    async changeEnterMonth(prop, value, object) {
      this.form.enter_month = value ? object : null;
      await this.setTargetOfSubject();
      this.$emit('clearError', prop);
    },
    changeDiscount(value, object, index) {
      const prop = `discounts.${index}.id`;
      const copyForm = JSON.parse(JSON.stringify(this.form));
      copyForm.discounts[index] = object;
      this.form = JSON.parse(JSON.stringify(copyForm));
      this.$emit('clearError', prop);
      this.$emit('changeDiscount', this.form);
    },
    async getOptionGrade() {
      this.optionGrades = await gradeRequest.gradeOptions({
        select_add_id: [this.form.snz_grade_id],
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import './resources/js/views/cantractinfo/styles/detail.scss';
</style>
