<template>
  <div id="page-recovery-guardian">
    <page-login-verify
      v-if="show2FA"
      @back="show2FA = false"
      :email="recoveryStore.email"
      @token="getToken"
    />
    <div class="main-content" v-else>
      <up-header :back="() => $emit('back')" />
      <h2>{{ $t('RecoveryGuardianTitle') }}</h2>
      <div class="send-box">
        <img class="send" src="@/assets/img/recovery/send.png" />
        <div class="dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <img class="receive" src="@/assets/img/recovery/receive.png" />
      </div>
      <template v-if="form.guardians.length > 1">
        <div class="progress-box">
          <div class="tip">{{ $t('CurrentProgress') }}{{ progress }}<span>/100</span></div>
          <div class="line">
            <div class="now" :style="{ width: `${progress}%` }"></div>
          </div>
          <div
            v-show="progress < 100"
            class="progress wait-48h"
            :class="{ active: progress >= 60 }"
          >
            <div class="box">{{ $t('Recovery48Hours') }}</div>
          </div>
          <div class="progress right-now" :class="{ active: progress >= 100 }">
            <div class="box">{{ $t('RestoreNow') }}</div>
          </div>
        </div>
        <h4>
          {{ $t('recoveryGuardianTip') }}
        </h4>
      </template>
      <h4 v-else>{{ $t('RecoveryGuardianSubtitle') }}</h4>
      <div class="recovery-emails">
        <div class="email-box" v-for="(guardian, i) in form.guardians" :key="i">
          <div class="top">
            <div class="info">
              <div class="title">
                <span>
                  {{ registerEmail === guardian.email ? $t('OwnEmail') : $t('GuardianEmail') + i }}
                </span>
                <div class="score">{{ registerEmail === guardian.email ? 60 : 40 }}</div>
              </div>
              <div>{{ guardian.email }}</div>
            </div>
            <el-button
              v-if="guardian.type === 'send'"
              type="primary"
              :loading="guardian.countDown > 0 || guardian.disbaled"
              @click="sendEmail(i)"
              class="btn"
            >
              <span>{{ $t('Send') }}</span>
            </el-button>
            <div v-else-if="guardian.type === 'pending'" class="btn pending">
              <el-button
                type="primary"
                @click="sendEmail(i)"
                :loading="guardian.countDown > 0 || guardian.disbaled"
              >
                <template v-if="guardian.countDown > 0">{{ guardian.countDown }}s</template>
                <template v-else>{{ $t('Resend') }}</template>
              </el-button>
            </div>
            <div v-else-if="guardian.type === 'success'" class="btn success">
              {{ $t('ForwardSuccess') }}
            </div>
          </div>
          <div class="bottom" v-if="guardian.type === 'pending'">
            <div>{{ $t('WaitingRecoveryEmail') }}</div>
            <div class="right">{{ $t('Verifying') }}</div>
          </div>
        </div>
        <div class="email-box" v-if="form.guardians.length === 1">
          <div class="top">
            <div class="info">
              <div class="title">
                <span>{{ $t('SafetyVerification') }}</span>
                <div class="score">40</div>
              </div>
              <div>{{ $t('To2faVerification') }}</div>
            </div>
            <el-button
              v-if="verify2FA === 'need'"
              type="primary"
              @click="show2FA = true"
              class="btn"
            >
              <span>{{ $t('Go') }}</span>
            </el-button>
            <div class="btn success" v-if="verify2FA === 'success'">
              {{ $t('ForwardSuccess') }}
            </div>
          </div>
        </div>
        <div class="submit">
          <up-button
            type="primary"
            @click="startRecovery"
            :loading="form.loading"
            :disabled="progress < 60"
          >
            {{ $t('Submit') }}
          </up-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRecoveryGuardian } from '@/composable/useRecovery'
import { useRecoveryStore } from '@/store/recovery'

const recoveryStore = useRecoveryStore()

const getToken = (token: string, type: number) => {
  console.log('token', token, type)
  show2FA.value = false
  verify2FA.value = 'success'
}

const progress = computed(() => {
  const { isHaveTimeLock, canSendStartRecoveryTx } = recoveryStore
  if (canSendStartRecoveryTx) {
    if (form.guardians.length === 1 && verify2FA.value === 'success') {
      return 100
    }
    if (isHaveTimeLock) {
      return 60
    } else {
      return 100
    }
  }
  return 0
})

const { sendEmail, form, registerEmail, startRecovery, verify2FA, show2FA } = useRecoveryGuardian()
</script>

<style lang="scss">
#page-recovery-guardian {
  .main-content {
    position: relative;
    min-height: 100vh;
    padding-bottom: 100px;
    h2 {
      margin-top: 40px;
    }
    .send-box {
      margin: 40px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .send,
      .receive {
        width: 60px;
        height: 60px;
      }
      .dots {
        display: flex;
        margin: 0 37px;
        .dot {
          border-radius: 50%;
          width: 4px;
          height: 4px;
          background: var(--up-line);
        }
        .dot + .dot {
          margin-left: 12px;
        }
      }
    }

    .progress-box {
      padding-top: 8px;
      position: relative;
      text-align: left;
      .tip {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        span {
          color: var(--up-text-third);
        }
      }
      .line {
        margin-top: 10px;
        width: 100%;
        height: 8px;
        background: var(--up-bg-checked);
        border-radius: 4px;
        overflow: hidden;
        .now {
          min-width: 6px;
          height: 100%;
          background: var(--up-primary);
          border-radius: 4px;
        }
      }
      .progress {
        position: absolute;
        top: 0;
        padding: 4px 12px;
        border-radius: 32px;
        background: var(--up-bg-solid);
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        &.wait-48h {
          left: 42%;
        }
        &.right-now {
          right: 0;
        }
        .box {
          position: relative;
          &::before {
            position: absolute;
            bottom: -15px;
            left: calc(50% - 6px);
            content: '';
            width: 0px;
            height: 6px;
            border: 6px solid;
            border-color: var(--up-bg-solid) transparent transparent transparent;
          }
        }

        &.active {
          background: var(--up-primary);
          .box {
            color: #fff;
            &::before {
              border-color: var(--up-primary) transparent transparent transparent;
            }
          }
        }
      }
    }
    .recovery-emails {
      margin-top: 40px;
      .email-box {
        backdrop-filter: blur(8px);
        border-radius: 12px;
        overflow: hidden;
        background: var(--up-bg);
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          text-align: left;
          .info {
            font-size: 14px;
            font-weight: 400;
            .title {
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 16px;

              display: flex;
              align-items: center;

              .score {
                user-select: none;
                margin-left: 8px;
                padding: 0 13px;
                background: rgba(173, 148, 255, 0.16);
                border-radius: 10px;
                border: 1px solid #ad94ff;
                font-size: 12px;
                font-weight: 400;
                color: #ad94ff;
                line-height: 20px;
              }
            }
          }
          .btn {
            min-width: 68px;
            text-align: center;
          }
          .btn.success {
            font-weight: 600;
            color: var(--up-green);
          }
        }
        .bottom {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--up-bg);

          font-size: 14px;
          font-weight: 400;
          color: var(--up-text-third);
          .right {
            font-weight: 600;
          }
        }
      }
      .email-box + .email-box {
        margin-top: 24px;
      }
    }
    .submit {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}
</style>
