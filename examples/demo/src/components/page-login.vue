<template>
  <div id="page">
    <i class="background-logo iconfont icon-logo"></i>
    <div class="head">
      UniPass Demo ({{ CHAIN_CONFIGS[userStore.chainType].name }})
    </div>
    <div class="page-demo">
      <el-radio-group v-model="toTheme">
        <el-radio label="dark">
          <div class="radio_box">
            <div class="radio_0"></div>
          </div>
          <div class="radio_box2"></div>
          Dark mode
        </el-radio>
        <el-radio label="light">
          <div class="radio_box">
            <div class="radio_0"></div>
          </div>
          <div class="radio_box2"></div>
          Light mode
        </el-radio>
      </el-radio-group>

      <div class="chain-label">Chain</div>

      <el-select
        v-model="userStore.chainType"
        class="m-2"
        :suffix-icon="IconArrow"
        @change="chainChange"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          size="16px"
        />
      </el-select>
      <div class="return">
        <div class="return_box">
          <div class="return_s">Return address</div>
          <el-switch
            v-model="returnAddress"
            disabled
            class="ml-2"
            style="--el-switch-on-color: #13ce66"
          />
        </div>
        <div class="return_box">
          <div class="return_s">Return email</div>
          <el-switch
            v-model="returnEmail"
            class="ml-2"
            style="--el-switch-on-color: #13ce66"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="page-demo">
    <div class="st_box">
      <div class="st"></div>
      <div class="users">Onboarding users through Google and Email</div>
      <div class="st"></div>
    </div>

    <div class="oauth-box" @click="connect('google')">
      <div class="one">
        <img class="google_icon" src="@/assets/google.svg" />
        <span>Continue with Google</span>
      </div>
    </div>

    <div class="oauth-box" @click="connect('email')">
      <div class="one">
        <img class="google_icon" src="@/assets/email.svg" />
        <span>Continue with Email</span>
      </div>
    </div>

    <div class="divider"></div>
    <div class="st_box">
      <div class="st"></div>
      <div class="users">Connect UniPass through one button</div>
      <div class="st"></div>
    </div>

    <div class="oauth-box" @click="connect()">
      <div class="one">
        <img class="google_icon" src="@/assets/unipass.svg" />
        <span>Connect UniPass</span>
      </div>
    </div>
  </div>
  <div class="page-demo">
    <div class="link_head">UniPass Documents</div>
    <div class="box">
      <div class="link_box">
        <a class="linkA" href="https://unipass.id/" target="_blank">
          <div class="link_"></div>
          UniPass Website
        </a>
        <a
          class="linkA link_top"
          href="https://docs.wallet.unipass.id/docs/develop/popup-sdk/quick-start"
          target="_blank"
        >
          <div class="link_"></div>
          Popup SDK
        </a>
      </div>
      <div class="link_box">
        <a
          class="linkA"
          href="https://docs.wallet.unipass.id/docs/develop/flutter-sdk/quick-start"
          target="_blank"
        >
          <div class="link_"></div>
          Flutter SDK
        </a>
        <a
          class="linkA link_top"
          href="https://docs.wallet.unipass.id/docs/develop/unity-sdk/quick-start"
          target="_blank"
        >
          <div class="link_"></div>
          Unity SDK
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconArrow from "./icon-arrow.vue";

import { useIndex } from "../composable/useIndex";
const {
  toTheme,
  options,
  returnAddress,
  returnEmail,
  userStore,
  connect,
  chainChange,

  CHAIN_CONFIGS,
} = useIndex();
</script>

<style lang="scss">
#page {
  background-color: #f5f5f5;

  .head {
    width: 100%;
    padding-top: 120px;
    text-align: center;
    font-weight: 700;
    font-size: 28px;
    line-height: 40px;
    color: #1f202a;
  }
}

.page-demo {
  max-width: 480px;
  margin-top: 40px;
  padding: 40px;
  background: #ffffff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  text-align: center;

  .chain-label {
    margin-top: 40px;
    margin-bottom: 8px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
  }

  & + .page-demo {
  }

  .el-radio-group {
    margin: 0 auto;
  }

  .radio_box {
    margin-right: 13px;
    width: 18px;
    height: 18px;
    border: 1.5px solid #8864ff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    .radio_0 {
      width: 10px;
      height: 10px;
      border: 1.5px solid #8864ff;
      background-color: #8864ff;
      border-radius: 50%;
    }
  }

  .radio_box2 {
    margin-right: 13px;
    width: 18px;
    height: 18px;
    border: 1.5px solid #c1c1c1;
    border-radius: 50%;
  }

  .oauth-box {
    width: 100%;
    margin-top: 20px;
    font-size: 16px;
    height: 56px;
    background: #f7f7f7;
    border-radius: 6px;
    color: #1f202a;
    font-weight: 600;
    line-height: 24px;

    .one {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      background-color: var(--up-bg-checked);
      border-radius: 12px;
      transition: all 0.15s;
      box-shadow: inset 1px 1px 3px var(--up-line);
    }
  }

  .oauth-box .one:hover {
    background-color: #eee;
  }

  .link_head {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #1f202a;
  }

  .el-form-item__content {
    .el-textarea__inner {
      height: 56px !important;
      background: #f5f5f5;
      border-radius: 6px;
      padding: 16px !important;
    }
    .el-textarea {
      background: #fcfcfc;
      &.is-disabled {
        background: #f5f5f5;
      }
    }
  }

  .box {
    margin-top: 28px;
    display: flex;
    justify-content: center;
    align-items: center;

    .link_box {
      display: flex;
      flex-direction: column;
      text-align: left;

      & + .link_box {
        margin-left: 20px;
      }
    }
  }

  .link_ {
    width: 2px;
    height: 2px;
    background: #5575ff;
    border-radius: 50%;
    margin-right: 10px;
  }

  .linkA {
    text-decoration: none;
    display: flex;
    justify-content: left;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #8864ff;
  }

  .link_top {
    margin-top: 16px;
  }

  .st_box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;

    .users {
      margin: 0 10px;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      color: #1f202a;
    }

    .st {
      width: 50px;
      background-color: #e5e5e5;
      border: 0 !important;
    }
  }

  .google_icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }

  > .background-logo {
    font-size: 237px;
    position: absolute;
    top: 16px;
    right: -40px;
    color: #5575ff;
    opacity: 0.14;
    z-index: 0;
  }

  .divider {
    margin-top: 40px;
  }

  .return {
    margin-top: 40px;

    .return_box {
      display: flex;
      justify-content: space-between;
      align-items: center;

      & + .return_box {
        margin-top: 28px;
      }

      .return_s {
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
      }
    }
  }

  .transfer {
    width: 100%;
    font-size: 16px;
    height: 56px;
    background: #f7f7f7;
    border-radius: 6px;
    color: #1f202a;
    font-weight: 600;
    line-height: 24px;
  }

  .login {
    margin-top: 20px;
    margin-left: 0 !important;
  }

  .body {
    border-radius: 24px;
    margin: 30px auto 0px;
    width: 100%;
    background: #ffffff;
    padding: 0px 0 21px;
    overflow: hidden;

    .body-input {
      margin-top: -20px;

      .icon-copy {
        cursor: pointer;
      }
    }

    .input {
      text-align: left;
      margin-bottom: 20px;
    }
  }

  .message {
    display: flex;
    justify-content: space-between;

    .message-button {
      margin-top: 30px;
      width: 48%;
      font-size: 20px;
    }
  }

  h4 {
    color: black;
    margin-top: 50px;
  }
}

.unipass-page {
}
</style>
