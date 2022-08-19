import { DOT_NOT_FIRST, EMAIL_FORMAT } from '@/utils/validate';
import Vue from 'vue';
export const validate = {
  data(){
    return {
      searchRules: {
        name: [
          {
            required: true,
            message: '名前を入力してください。',
            trigger: 'none',
          },
          {
            max: 200,
            message: '名前は200文字以内で、入力してください。',
            trigger: 'none',
          },
        ],
        email: [
          {
            required: true,
            message: 'メールアドレスを入力してください。',
            trigger: 'none',
          },
          {
            max: 200,
            message: 'メールアドレスは200文字以内で、入力してください。',
            trigger: 'none',
          },
          { pattern: DOT_NOT_FIRST, message: '@の直前に「.(ドット)」があるメールアドレスは登録できません。', trigger: 'none' },
          { pattern: EMAIL_FORMAT, message: 'メールアドレスは「xxx@xxx.xx」の形式で入力してください。', trigger: 'none' },
        ],
        role: [
          {
            required: true,
            message: '該当ロールを選択してください。',
            trigger: 'none',
          },
        ],
        is_locked: [
          {
            required: true,
          },
        ],
        maintain_locked: [
          {
            required: true,
          },
        ],
        names: [
          {
            required: true,
            message: 'ユーザーの組織と役割を作成してください',
            trigger: 'none',
          },
        ],
        organization: [
          {
            required: true,
            message: '所属組織を選択してください。',
            trigger: 'none',
          },
        ],
        status: [
          {
            required: true,
          },
        ],
      },
    };
  },
};
Vue.mixin({
  methods: {
    focusFieldErrorBlockEnd() {
      this.fields.every(item => {
        if (item.validateState === 'error') {
          // item.$children[1].$el.querySelector('input,select,textarea').focus();
          item.$children[1].$el.scrollIntoView({
            block: 'end',
          });
          return false;
        }
        return true;
      });
    },
  },
});
