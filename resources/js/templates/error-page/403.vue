<template>
  <div class="err-container">
    <div class="errPage-container">
      <div class="wscn-http403">
        <div class="pic-403">
          <img :src="errGif" width="313" height="428" alt="Crying girl">
        </div>
        <div class="bullshit">
          <div class="bullshit__oops">
            403 Forbidden
          </div>
          <div class="bullshit__headline">
            指定されたページへのアクセス権限がありません。
          </div>
          <a href="/" class="bullshit__return-home">トップ画面へ</a>
        </div>
      </div>
      <el-dialog :visible.sync="dialogVisible" title="Casual look">
        <img :src="ewizardClap" class="pan-img">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif';

export default {
  name: 'Page403',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      ewizardClap: 'https://i.redd.it/7jvcbsfjz1h11.gif',
      dialogVisible: false,
    };
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' });
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.err-container {
  position: relative;
  width: 100%;
  height: 100vh;
}
.errPage-container {
  transform: translate(-50%,-50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
.wscn-http403 {
  position: relative;
  width: 1200px;
  padding: 0 50px;
  overflow: hidden;
  display: flex;
  align-items: center;
  .pic-403 {
    position: relative;
    float: left;
    width: 600px;
    overflow: hidden;
    img {
      float: right;
    }
  }
  .bullshit {
    position: relative;
    float: left;
    width: 500px;
    padding: 30px 0;
    overflow: hidden;
    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}

</style>
