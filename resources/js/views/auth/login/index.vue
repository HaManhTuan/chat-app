<template>
  <div class="limit">
    <div class="container-login">
      <el-row :gutter="20" class="row-login">
        <el-col :span="6" :offset="6">
          <div class="form-wrapper-one">
            <h4 class="title-login">Login</h4>
            <el-form ref="ruleForm" :model="ruleForm" status-icon class="demo-ruleForm" label-position="top">
              <el-form-item label="Email" prop="email">
                <el-input v-model="ruleForm.email" type="email" autocomplete="off" />
              </el-form-item>
              <el-form-item label="Password" prop="password">
                <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="ruleForm.check" label="Remember me leter" name="type" />
              </el-form-item>
              <el-form-item>
                <el-form-item>
                  <el-button type="primary" class="btn btn-login" @click="submitForm('ruleForm')">Login</el-button>
                  <el-button class="btn btn-primary-alta">Sign Up</el-button>
                </el-form-item>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="social-share-media form-wrapper-one">
            <h6>Another way to log in</h6>
            <p>Lorem ipsum dolor sit, amet sectetur adipisicing elit.cumque.</p>
            <button class="another-login login-facebook"><img class="small-image" :src="gg" alt="">
              <span>Log in with Google</span>
            </button>
            <button class="another-login login-facebook">
              <img class="small-image" :src="fb" alt=""><span>Log in with Facebook</span>
            </button>
            <button class="another-login login-twitter">
              <img class="small-image" :src="tweeter" alt=""><span>Log in with Facebook</span>
            </button>
            <button class="another-login login-linkedin">
              <img class="small-image" :src="link" alt=""><span>Log in with Facebook</span>
            </button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { setLogged } from '@/utils/auth';
import localStorageService from '@/utils/localStorageService';

import { Message } from 'element-ui';
const fb = require('@/assets/login/facebook.png').default;
const gg = require('@/assets/login/google.png').default;
const link = require('@/assets/login/link.png').default;
const tweeter = require('@/assets/login/tweeter.png').default;

export default {
  name: 'Login',
  data() {
    return {
      fb: fb,
      gg: gg,
      link: link,
      tweeter: tweeter,
      loading: false,
      ruleForm: {
        email: '',
        password: '',
        check: null,
      },
    };
  },
  created() {
    if (localStorageService.getToken() != null) {
      setLogged(1);
      this.$router.push(
        { path: this.redirect || '/', query: this.otherQuery },
        onAbort => {}
      );
      this.loading = false;
    } else {
      setLogged(0);
      if (localStorageService.getErrorMessage() != null) {
        Message({
          message: localStorageService.getErrorMessage(),
          type: 'error',
          duration: 5 * 1000,
        });
        localStorageService.removeErrorMessage();
      }
    }
  },
  methods: {
    handleLogin() {
      const endpoint = '/saml2/CLOUDGATEUNO/login';
      window.location.href = endpoint;
      this.loading = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles/login";
</style>
