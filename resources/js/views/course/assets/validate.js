export const ListCourse = {
  data() {
    return {
      rules: {
        snz_coursecode: [
          { required: false, message: '', trigger: 'blur' },
          // { max: 8, message: '開講コースコードは8文字以内で、入力してください。', trigger: 'blur' },
        ],
        snz_name: [
          { required: false, message: '', trigger: 'blur' },
          // { max: 100, message: 'コース名は100文字以内で、入力してください。', trigger: 'blur' },
        ],
        snz_coursetype: [
          { required: false, message: '', trigger: 'change' },
        ],
        snz_list_display: [
          { required: false, message: '', trigger: 'change' },
        ],
      },
    };
  },
};
