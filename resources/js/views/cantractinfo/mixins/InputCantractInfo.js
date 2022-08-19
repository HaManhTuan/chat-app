import { applicationValue, selectionResult } from '@/const/CantractInfo';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';
import SubjectMstSubjectSetRequest from '@/api/SubjectMstSubjectSetRequest';
const targetPeriodRequest = new TargetPeriodRequest();
const subjectMstSubjectSetRequest = new SubjectMstSubjectSetRequest();
export const InputCantractInfoMixin = {
  methods: {
    initListSubject(subjects, subjectOptions, targetPeriodOptions) {
      const resultObject = subjects;
      Object.keys(resultObject).forEach(key => {
        resultObject[key] = this.initOneSubject(
          resultObject[key],
          subjectOptions,
          targetPeriodOptions
        );
      });
      return resultObject;
    },
    initOneSubject(row, subjectOptions, targetPeriodOptions) {
      const result = row;
      result.subjectOption = _.clone(subjectOptions);
      result.targetPeriodOptions = _.clone(targetPeriodOptions);
      return result;
    },
    setDisplayField(data = null) {
      var result = this.setDataDefaultTrue();
      if (data.snz_application_type === applicationValue.EXPERIENCE) {
        result.snz_entermonth_period_id = true;
        result.snz_experiencestartmonth_period_id = true;
        result.snz_experienceendmonth_period_id = true;
        result.snz_experiencefee = true;
        result.snz_cantractstartmonth_period_id = true;
        result.snz_cantractendmonth_period_id = true;
        result.snz_selectionappstate = true;
        result.snz_selectionresult = true;
        result.snz_experiencecancel1 = true;
        result.snz_experiencecancel2 = true;
      }
      if (data.snz_application_type === applicationValue.JOIN) {
        result.snz_entermonth_period_id = true;
        result.snz_experiencestartmonth_period_id = false;
        result.snz_experienceendmonth_period_id = false;
        result.snz_experiencefee = false;
        result.snz_cantractstartmonth_period_id = true;
        result.snz_cantractendmonth_period_id = true;
        result.snz_selectionappstate = true;
        result.snz_selectionresult = true;
        result.snz_experiencecancel1 = false;
        result.snz_experiencecancel2 = false;
      }
      if (data.snz_application_type === applicationValue.CONTINUATION) {
        result.snz_entermonth_period_id = false;
        result.snz_experiencestartmonth_period_id = false;
        result.snz_experienceendmonth_period_id = false;
        result.snz_experiencefee = false;
        result.snz_cantractstartmonth_period_id = true;
        result.snz_cantractendmonth_period_id = true;
        result.snz_selectionappstate = false;
        result.snz_selectionresult = false;
        result.snz_experiencecancel1 = false;
        result.snz_experiencecancel2 = false;
      }
      return result;
    },
    setDisabledField(data = null, role) {
      let result = this.setDataDefaultTrue();
      if (this.ableRole(['system', 'parttime', 'employee'])) {
        result = {
          snz_studentcode: true,
          snz_coolingoffdate: true,
          snz_experiencefee: true,
          businessunit_id: true,
          snz_grade_id: false,
          snz_schoolyear: false,
          snz_cantractstartmonth_period_id: false,
          snz_cantractendmonth_period_id: false,
          snz_experiencecancel1: true,
          snz_experiencecancel2: true,
          snz_entermonth_period_id: true,
          snz_course_id: true,
          snz_selectionappstate: true,
          snz_selectionresult: true,
          snz_applicationdate: false,
          snz_application_type: true,
          snz_subjectset_id: false,
          snz_experiencestartmonth_period_id: true,
          snz_experienceendmonth_period_id: true,
          snz_contract_type: false,
          snz_subjects: false,
          snz_discount: false,
        };
        if (data.snz_brand === 7) {
          result.businessunit_id = false;
        }
        if (data.snz_application_type === applicationValue.EXPERIENCE) {
          result.snz_experiencestartmonth_period_id = false;
          result.snz_experienceendmonth_period_id = false;
          result.snz_experiencefee = false;
          result.snz_cantractstartmonth_period_id = true;
          result.snz_cantractendmonth_period_id = true;
          if (
            data.snz_selectionresult ===
            selectionResult.SNZ_SELECTIONRESULT_PASS
          ) {
            result.snz_entermonth_period_id = false;
          }
        }
        if (
          data.snz_application_type === applicationValue.EXPERIENCE &&
          data.snz_experiencestartmonth_period_id &&
          data.snz_experienceendmonth_period_id
        ) {
          result.snz_experiencecancel1 = false;
          result.snz_experiencecancel2 = false;
          result.snz_selectionappstate = false;
          result.snz_selectionresult = false;
        }

        if (data.snz_application_type === applicationValue.JOIN) {
          result.snz_entermonth_period_id = false;
          result.snz_cantractstartmonth_period_id = true;
          result.snz_cantractendmonth_period_id = true;
          result.snz_selectionappstate = true;
          result.snz_selectionresult = true;
          result.snz_experiencestartmonth_period_id = true;
          result.snz_experienceendmonth_period_id = true;
          result.snz_experiencefee = true;
          result.snz_experiencecancel1 = true;
          result.snz_experiencecancel2 = true;
        }

        if (data.snz_application_type === applicationValue.CONTINUATION) {
          result.snz_cantractstartmonth_period_id = true;
          result.snz_cantractendmonth_period_id = true;
          result.snz_selectionappstate = true;
          result.snz_selectionresult = true;
          result.snz_experiencestartmonth_period_id = true;
          result.snz_experienceendmonth_period_id = true;
          result.snz_experiencefee = true;
          result.snz_experiencecancel1 = true;
          result.snz_experiencecancel2 = true;
          result.snz_entermonth_period_id = true;
        }
        if (
          data.snz_state_sentdatapdated === 1 ||
          data.snz_state_sentdata === 1
        ) {
          result.snz_studentcode = true;
          result.snz_experiencefee = true;
          // result.businessunit_id = true;
          result.snz_grade_id = true;
          result.snz_schoolyear = true;
          result.snz_subjectset_id = true;
          // result.snz_discount = true;
          result.snz_application_type = true;
        }
      } else {
        if (
          // data.course &&
          // data.course.anomalous_change_flag &&
          ((data.subject_set && data.subject_set.snz_update_subject_flag) ||
          (data.subject_set_change &&
            data.subject_set_change.snz_update_subject_flag)) &&
          (!this.ableRole(['viewonly', 'callcenter']))
        ) {
          result.snz_subjects = false;
          result.snz_discount = false;
          if (data.snz_brand === 7) {
            result.businessunit_id = false;
          }
        }
      }

      return result;
    },
    expectedDiscountNull(form) {
      var returnForm = JSON.parse(JSON.stringify(form));
      let discountArr = returnForm.discounts;
      discountArr = discountArr.filter(function(object) {
        return object.id;
      });
      returnForm.discounts = discountArr || [];
      return returnForm;
    },
    expectedTargetOptions(form) {
      var returnForm = JSON.parse(JSON.stringify(form));
      var contractSubjectDetail = returnForm.cantract_info_subjects;
      if (Array.isArray(contractSubjectDetail)) {
        contractSubjectDetail.forEach(async function(subject) {
          subject.targetPeriodOptions = null;
        });
      }
      returnForm.cantract_info_subjects = contractSubjectDetail || [];
      return returnForm;
    },
    async fetchStartMonthForSubject(form) {
      const brand = form.snz_brand;
      const enterMonth = form.enter_month || null;
      const applicationType = form.snz_application_type;
      const experience_end_month = form.experience_end_month || null;
      const experience_start_month = form.experience_start_month || null;
      var subjects = JSON.parse(JSON.stringify(form.cantract_info_subjects));
      var returnSubjects = JSON.parse(
        JSON.stringify(form.cantract_info_subjects)
      );
      var subjectDefault = null;
      if (_.isEmpty(form.cantract_info_subjects_default)) {
        const res = await subjectMstSubjectSetRequest.getListSubjectDefault({
          snz_subjectset_id: form.snz_subjectset_id,
        });
        subjectDefault = res;
      } else {
        subjectDefault = JSON.parse(
          JSON.stringify(form.cantract_info_subjects_default)
        );
      }
      const calendarPattern = form.business_unit
        ? form.business_unit.snz_calendar_pattern_id
        : null;
      const onlineDate = form.system_date.snz_onlinedate;
      if (brand === 7) {
        const targetSubjectOptions = await this.getStartAndEndTargetOfSubject(
          subjects,
          calendarPattern
        );
        for (let index = 0; index < subjects.length; ++index) {
          returnSubjects[index] = await this.getTargetPeriodPeriodBrand7(
            subjects[index],
            enterMonth,
            applicationType,
            onlineDate,
            experience_end_month,
            experience_start_month,
            calendarPattern,
            targetSubjectOptions
          );
        }
      } else {
        for (let index = 0; index < subjects.length; ++index) {
          returnSubjects[index] = await this.getTargetPeriodPeriodNotBrand7(
            subjects[index],
            enterMonth,
            applicationType,
            onlineDate,
            experience_end_month,
            experience_start_month,
            subjectDefault
          );
        }
      }
      return returnSubjects;
    },
    getTargetPeriodPeriodNotBrand7(
      subject,
      enterMonth,
      applicationType,
      onlineDate,
      experience_end_month,
      experience_start_month,
      subjectDefault
    ) {
      var resultSubject = JSON.parse(JSON.stringify(subject));
      if (_.isEmpty(subject)) {
        resultSubject = this.clearTargetSubject(subject);
        return resultSubject;
      }
      resultSubject = _.find(subjectDefault, function(value) {
        return value.snz_subject_id === subject.snz_subject_id;
      });

      if (_.isEmpty(resultSubject)) {
        resultSubject = this.clearTargetSubject(subject);
        return resultSubject;
      }

      // ・Môn học chưa được thiết lập thời gian khai giảng
      if (
        _.isEmpty(resultSubject.start_month_period) ||
        _.isEmpty(resultSubject.end_month_period)
      ) {
        resultSubject = this.clearTargetSubject(subject);
        return resultSubject;
      }

      // JOIN
      if (
        applicationType === applicationValue.JOIN ||
        applicationType === applicationValue.CONTINUATION
      ) {
        if (enterMonth) {
          // ・Môn học có thời gian khai giảng là trong tương lại
          if (
            resultSubject.start_month_period.snz_date_start >
            enterMonth.snz_date_start
          ) {
            return resultSubject;
          }
          // ・Môn học đang khai giảng
          if (
            enterMonth.snz_date_start >=
            resultSubject.start_month_period.snz_date_start
          ) {
            resultSubject.start_month_period = enterMonth;
            resultSubject.snz_startmonth_period_id = enterMonth.id;
            return resultSubject;
          }
        } else {
          if (subject.start_month_period.snz_date_start < onlineDate) {
            resultSubject.start_month_period = null;
            resultSubject.snz_startmonth_period_id = null;
            return resultSubject;
          } else {
            return resultSubject;
          }
        }
      }

      // EXPERIENCE
      if (
        applicationType === applicationValue.EXPERIENCE &&
        experience_start_month &&
        experience_end_month
      ) {
        // ・Môn học đang khai giảng
        resultSubject.start_month_period = experience_start_month;
        resultSubject.snz_startmonth_period_id = experience_start_month.id;
        resultSubject.end_month_period = experience_end_month;
        resultSubject.snz_endmonth_period_id = experience_end_month.id;
        return resultSubject;
      }

      return resultSubject;
    },
    async getTargetPeriodPeriodBrand7(
      subject,
      enterMonth,
      applicationType,
      onlineDate,
      experience_end_month,
      experience_start_month,
      calendarPatternId,
      targetSubjectOptions
    ) {
      var resultSubject = JSON.parse(JSON.stringify(subject));
      if (_.isEmpty(subject)) {
        resultSubject = this.clearTargetSubject(subject);
        return resultSubject;
      }
      if (
        _.isEmpty(subject.subject) ||
        _.isEmpty(subject.subject.snz_startmonth) ||
        _.isEmpty(subject.subject.snz_endmonth)
      ) {
        resultSubject = this.clearTargetSubject(subject);
        return resultSubject;
      }
      const startDate = new Date(subject.subject.snz_startmonth);
      const startYearCode = startDate.getFullYear();
      const startMontCode = startDate.getMonth() + 1;

      const startMonthPeriod = targetSubjectOptions.find(
        target =>
          target.snz_yearcode === startYearCode &&
          target.snz_monthcode === startMontCode &&
          target.snz_calendar_pattern_id === calendarPatternId
      );

      subject.start_month_period = startMonthPeriod
        ? startMonthPeriod.targetPeriod
        : null;
      subject.snz_startmonth_period_id = subject.start_month_period
        ? subject.start_month_period.id
        : null;

      const endDate = new Date(subject.subject.snz_endmonth);
      const endYearCode = endDate.getFullYear();
      const endMontCode = endDate.getMonth() + 1;

      const endMonthPeriod = targetSubjectOptions.find(
        target =>
          target.snz_yearcode === endYearCode &&
          target.snz_monthcode === endMontCode &&
          target.snz_calendar_pattern_id === calendarPatternId
      );

      subject.end_month_period = endMonthPeriod
        ? endMonthPeriod.targetPeriod
        : null;
      subject.snz_endmonth_period_id = subject.end_month_period
        ? subject.end_month_period.id
        : null;
      resultSubject = JSON.parse(JSON.stringify(subject));

      // ・Môn học chưa được thiết lập thời gian khai giảng
      if (
        _.isEmpty(subject.start_month_period) ||
        _.isEmpty(subject.end_month_period)
      ) {
        resultSubject = this.clearTargetSubject(subject);
        return resultSubject;
      }
      // JOIN
      if (applicationType === applicationValue.JOIN) {
        // ・Môn học có thời gian khai giảng là trong tương lại
        if (
          enterMonth &&
          subject.start_month_period.snz_date_start > enterMonth.snz_date_start
        ) {
          resultSubject.start_month_period = subject.start_month_period;
          resultSubject.snz_startmonth_period_id =
            subject.snz_startmonth_period_id;
          resultSubject.end_month_period = subject.end_month_period;
          resultSubject.snz_endmonth_period_id = subject.snz_endmonth_period_id;
          return resultSubject;
        }

        // ・Môn học đang khai giảng
        if (
          enterMonth &&
          enterMonth.snz_date_start >=
            subject.start_month_period.snz_date_start &&
          enterMonth.snz_date_end <= subject.end_month_period.snz_date_end
        ) {
          resultSubject.start_month_period = enterMonth;
          resultSubject.snz_startmonth_period_id = enterMonth.id;
          resultSubject.end_month_period = subject.end_month_period;
          resultSubject.snz_endmonth_period_id = subject.snz_endmonth_period_id;
          return resultSubject;
        }

        // ・Môn học quá thời gian khai giảng
        if (
          enterMonth &&
          subject.end_month_period.snz_date_end < enterMonth.snz_date_end
        ) {
          resultSubject = this.clearTargetSubject(subject);
          return resultSubject;
        }
      }

      // EXPERIENCE
      if (applicationType === applicationValue.EXPERIENCE) {
        // ・Môn học đang khai giảng
        if (
          experience_start_month &&
          experience_end_month &&
          subject.start_month_period.snz_date_start <=
            experience_start_month.snz_date_start &&
          subject.end_month_period.snz_date_end >=
            experience_end_month.snz_date_end
        ) {
          resultSubject.start_month_period = experience_start_month;
          resultSubject.snz_startmonth_period_id = experience_start_month.id;
          resultSubject.end_month_period = experience_end_month;
          resultSubject.snz_endmonth_period_id = experience_end_month.id;
          return resultSubject;
        } else {
          resultSubject = this.clearTargetSubject(subject);
          return resultSubject;
        }
      }

      // CONTINUATION

      if (applicationType === applicationValue.CONTINUATION) {
        // ・Môn học có thời gian khai giảng là trong tương lại
        if (
          onlineDate &&
          subject.start_month_period.snz_date_start >= onlineDate
        ) {
          return resultSubject;
        }

        // ・Môn học đang khai giảng
        if (
          onlineDate &&
          subject.start_month_period.snz_date_start <= onlineDate &&
          subject.end_month_period.snz_date_end >= onlineDate
        ) {
          resultSubject.start_month_period = null;
          resultSubject.snz_startmonth_period_id = null;
          return resultSubject;
        }

        // ・Môn học quá thời gian khai giảng
        if (subject.end_month_period.snz_date_end < onlineDate) {
          resultSubject = this.clearTargetSubject(subject);
          return resultSubject;
        }
      }

      return resultSubject;
    },
    clearTargetSubject(subject) {
      const resultSubject = JSON.parse(JSON.stringify(subject));
      resultSubject.start_month_period = null;
      resultSubject.snz_startmonth_period_id = null;
      resultSubject.end_month_period = null;
      resultSubject.snz_endmonth_period_id = null;
      return resultSubject;
    },
    setDataDefaultTrue() {
      const result = {
        snz_studentcode: true,
        snz_coolingoffdate: true,
        snz_experiencefee: true,
        businessunit_id: true,
        snz_grade_id: true,
        snz_schoolyear: true,
        snz_cantractstartmonth_period_id: true,
        snz_cantractendmonth_period_id: true,
        snz_experiencecancel1: true,
        snz_experiencecancel2: true,
        snz_entermonth_period_id: true,
        snz_course_id: true,
        snz_selectionappstate: true,
        snz_selectionresult: true,
        snz_applicationdate: true,
        snz_application_type: true,
        snz_subjectset_id: true,
        snz_experiencestartmonth_period_id: true,
        snz_experienceendmonth_period_id: true,
        snz_contract_type: true,
        snz_subjects: true,
        snz_discount: true,
      };
      return result;
    },
    async getCantractStartMonth(cantractSubjects) {
      var cantractStartMonth = null;
      cantractSubjects.forEach(function(subject) {
        if (subject.start_month_period && cantractStartMonth === null) {
          cantractStartMonth = subject.start_month_period;
        }
        if (
          subject.start_month_period &&
          cantractStartMonth &&
          subject.start_month_period.snz_date_start <
            cantractStartMonth.snz_date_start
        ) {
          cantractStartMonth = subject.start_month_period;
        }
      });
      return cantractStartMonth;
    },
    async getCantractEndMonth(cantractSubjects) {
      var cantractEndMonth = null;
      cantractSubjects.forEach(function(subject) {
        if (subject.end_month_period && cantractEndMonth === null) {
          cantractEndMonth = subject.end_month_period;
        }
        if (
          subject.end_month_period &&
          cantractEndMonth &&
          subject.end_month_period.snz_date_end > cantractEndMonth.snz_date_end
        ) {
          cantractEndMonth = subject.end_month_period;
        }
      });
      return cantractEndMonth;
    },
    async setCantractMonth(form) {
      const returnForm = JSON.parse(JSON.stringify(form));
      const cantracStartMonth = await this.getCantractStartMonth(
        returnForm.cantract_info_subjects
      );
      returnForm.cantract_start_month = cantracStartMonth;
      returnForm.snz_cantractstartmonth_period_id = cantracStartMonth
        ? cantracStartMonth.id
        : null;
      if (!returnForm.cantract_end_month) {
        const cantracEndtMonth = await this.getCantractEndMonth(
          returnForm.cantract_info_subjects
        );
        returnForm.cantract_end_month = cantracEndtMonth;
        returnForm.snz_cantractendmonth_period_id = cantracEndtMonth
          ? cantracEndtMonth.id
          : null;
      }
      return returnForm;
    },
    async getStartAndEndTargetOfSubject(subjects, calendarPatternId) {
      // eslint-disable-next-line no-array-constructor
      var queryArray = [];
      if (Array.isArray(subjects)) {
        subjects.forEach(subject => {
          const startDate =
            subject.subject && subject.subject.snz_startmonth
              ? new Date(subject.subject.snz_startmonth)
              : null;
          if (startDate) {
            const startYearCode = startDate ? startDate.getFullYear() : null;
            const startMontCode = startDate.getMonth() + 1;
            const queryStart = {
              snz_yearcode: startYearCode,
              snz_monthcode: startMontCode,
              snz_calendar_pattern_id: calendarPatternId,
            };
            queryArray.push(queryStart);
          }

          const endDate =
            subject.subject && subject.subject.snz_endmonth
              ? new Date(subject.subject.snz_endmonth)
              : null;
          if (endDate) {
            const endYearCode = endDate.getFullYear();
            const endMontCode = endDate.getMonth() + 1;
            const queryEnd = {
              snz_yearcode: endYearCode,
              snz_monthcode: endMontCode,
              snz_calendar_pattern_id: calendarPatternId,
            };
            queryArray.push(queryEnd);
          }
        });
      }
      let targetSubjectOptions = [];
      queryArray = _.unionWith(queryArray, _.isEqual);
      if (queryArray.length) {
        targetSubjectOptions = await targetPeriodRequest.getTargetOfSubjectMst({
          array_target: queryArray,
        });
      }
      return targetSubjectOptions;
    },
  },
};
