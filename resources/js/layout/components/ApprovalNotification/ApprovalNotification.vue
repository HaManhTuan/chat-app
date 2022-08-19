<template>
  <div class="container">
    <el-button style="padding: 3px 18px;border-radius: 50px;" @click="loginOtherSystem">
      <div class="button-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="70.615" height="27" viewBox="0 0 70.615 27">
          <g id="Group_2336" data-name="Group 2336" transform="translate(-1144.986 -14.5)">
            <g id="Group_2333" data-name="Group 2333" transform="translate(17957.398 21236)">
              <text id="テスト_成績" data-name="テスト・成績" transform="translate(-16787.988 -21209.5)" fill="#1467b3" font-size="11" font-weight="500" font-family="YuGothicUI-Regular, Yu Gothic UI"><tspan x="0" y="0">成績管理</tspan><tspan y="0" font-family="SegoeUI, Segoe UI" /><tspan x="0" y="12" /></text>
              <text id="入力" transform="translate(-16763.797 -21197.5)" fill="#1a1714" font-size="11" font-weight="500" font-family="YuGothicUI-Regular, Yu Gothic UI"><tspan x="-25" y="0">システム</tspan></text>
            </g>
            <g id="Group_2330" data-name="Group 2330" transform="translate(1144.986 18.141)">
              <g id="Path_657" data-name="Path 657" transform="translate(0 1.125)" fill="none" stroke-linejoin="bevel">
                <path d="M0,0H16.409V18.6H0Z" stroke="none" />
                <path d="M 1.499995231628418 1.5 L 1.499995231628418 17.09640121459961 L 14.90858554840088 17.09640121459961 L 14.90858554840088 1.5 L 1.499995231628418 1.5 M -5.7220458984375e-06 0 L 16.40858459472656 0 L 16.40858459472656 18.59640121459961 L -5.7220458984375e-06 18.59640121459961 L -5.7220458984375e-06 0 Z" stroke="none" fill="#1467b3" />
              </g>
              <g id="Group_2318" data-name="Group 2318" transform="translate(5.393 0)">
                <path id="Path_115" data-name="Path 115" d="M4.979,54.676l.055-.055,5.854-5.854.061-.061.061-.061,3.1-3.1a0,0,0,0,0,0,0L10.65,42.079h0l-3.1,3.1-.061.061-.061.061L1.515,51.212h0L0,56.189a0,0,0,0,0,0,0L4.9,54.7ZM1.1,55.085,1.861,52.6h0l1.729,1.729a0,0,0,0,1,0,0l-2.485.756A0,0,0,0,1,1.1,55.085Z" transform="translate(0 -40.827)" fill="#1467b3" />
                <path id="Path_116" data-name="Path 116" d="M387.728,3.6a.993.993,0,0,0,0-1.4L386.291.768a.993.993,0,0,0-1.4,0l-.717.717a0,0,0,0,0,0,0l2.834,2.834h0Z" transform="translate(-372.624 -0.48)" fill="#1467b3" />
              </g>
              <path id="Path_658" data-name="Path 658" d="M-16842.674-21151.2h7.592" transform="translate(16847.596 21158.326)" fill="none" stroke="#1467b3" stroke-linecap="round" stroke-width="1" />
              <path id="Path_660" data-name="Path 660" d="M-16842.674-21151.2h6.428" transform="translate(16847.596 21161.611)" fill="none" stroke="#1467b3" stroke-linecap="round" stroke-width="1" />
            </g>
          </g>
        </svg>
      </div>
    </el-button>
  </div>
</template>
<script>
import { count } from './mixins/count';
import { mapGetters } from 'vuex';
import OtherSystemRequest from '@/api/otherSystemRequest';
const otherSystemRequest = new OtherSystemRequest();
export default {
  name: 'ApprovalNotification',
  mixins: [count],
  data() {
    return {
      //
    };
  },
  computed: {
    ...mapGetters(['email']),
  },
  created() {
    // this.countNotApproved();
  },
  methods: {
    loginOtherSystem(){
      otherSystemRequest.get(this.email).then((res) => {
        window.open(res, '_blank');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import './styles/ApprovalNotification/styles.scss';
</style>
