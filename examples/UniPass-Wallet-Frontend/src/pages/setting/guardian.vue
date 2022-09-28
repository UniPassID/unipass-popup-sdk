<template>
  <div id="page-setting-guardian">
    <up-header :title="$t('GuardianMail')" :back="back">
      <template #right>
        <div
          v-if="form.guardians.filter((e) => e.added).length > 0"
          class="delete-btn"
          @click="form.isDelete = !form.isDelete"
        >
          {{ form.isDelete ? $t('Cancel') : $t('Delete') }}
        </div>
      </template>
    </up-header>
    <div class="subtitle">{{ $t('SettingGuardianSubtitle') }}</div>
    <el-checkbox-group v-model="deleteChecked">
      <div class="one">
        <div class="top">
          <div class="name">{{ $t('RegisterAccount') }}</div>
          <div class="score">60</div>
        </div>
        <div class="email">{{ userStore.user?.email }}</div>
      </div>
      <el-checkbox
        v-for="(guardian, i) in form.guardians"
        :key="guardian.recoveryEmail"
        :label="guardian.recoveryEmail"
      >
        <div class="one">
          <div class="top">
            <div class="name">{{ $t('Guardian') }} {{ i + 1 }}</div>
            <template v-if="!guardian.added">
              <div v-if="guardian.type === 'success'" class="success">
                <up-icon name="correct" />
                <span>{{ $t('Finish') }}</span>
              </div>
              <div v-else class="waiting">
                <up-icon name="loading" class="is-loading" />
                <span>{{ $t('Waiting') }}</span>
              </div>
              <up-icon name="close" class="close" @click="closeGuardian(i)"></up-icon>
            </template>
            <div v-else class="score">40</div>
          </div>
          <el-form v-if="!guardian.added" class="email-box">
            <up-form-item :label="$t('Email')">
              <up-input :value="guardian.recoveryEmail" readonly>
                <template #suffix v-if="guardian.type !== 'success'">
                  <el-button
                    class="send-code"
                    :loading="guardian.loading"
                    :disabled="guardian.count > 0 || guardian.loading"
                    link
                    @click="sendLink(i)"
                  >
                    <template v-if="guardian.count > 0">{{ guardian.count }}s</template>
                    <template v-else>{{ $t('FetchEmailCode') }}</template>
                  </el-button>
                </template>
              </up-input>
            </up-form-item>
          </el-form>
          <div v-else class="email">{{ guardian.recoveryEmail }}</div>
          <div v-if="form.isDelete" class="delete-box">
            <div class="check">
              <div class="dot"></div>
            </div>
          </div>
        </div>
      </el-checkbox>
    </el-checkbox-group>

    <div class="bottom-box" v-if="form.isDelete">
      <up-button type="primary" :disabled="deleteChecked.length <= 0" @click="submit('delete')">
        {{ $t('Delete') }} {{ deleteChecked.length ? `(${deleteChecked.length})` : '' }}
      </up-button>
    </div>
    <div class="bottom-box edit" v-else>
      <up-button type="info" @click="form.show = true">{{ $t('Add') }}</up-button>
      <up-button type="primary" :disabled="submitDisabled" @click="submit('add')">
        {{ $t('Submit') }}
      </up-button>
    </div>
    <el-drawer
      :title="$t('AddGuardianTitle')"
      custom-class="add-guardian"
      v-model="form.show"
      direction="btt"
      size="auto"
    >
      <el-form @submit.prevent ref="formElement" :model="form">
        <up-form-item
          :label="form.email && $t('Email')"
          prop="email"
          :rules="[{ validator: unipass.checkEmailFormat, trigger: 'blur' }]"
        >
          <up-input
            @input="(v: string) => (form.email = unipass.formatEmail(v))"
            clearable
            v-model="form.email"
            :placeholder="$t('EmailEmpty')"
            @keydown.enter="form.email && sendLink(-1)"
          />
        </up-form-item>
      </el-form>
      <up-button
        type="primary"
        :disabled="!form.email"
        :loading="form.loading"
        @click="sendLink(-1)"
      >
        {{ $t('SendInvitationLink') }}
      </up-button>
    </el-drawer>
    <el-drawer
      :title="$t('Authentication')"
      custom-class="add-guardian"
      v-model="auth.show"
      direction="btt"
      size="auto"
      destroy-on-close
    >
      <el-form @submit.prevent ref="authElement" :model="auth">
        <up-form-item
          :label="auth.password && $t('Password')"
          prop="password"
          :rules="[{ validator: unipass.checkPassword, trigger: 'blur' }]"
        >
          <up-input
            @input="(v: string) => (auth.password = unipass.formatPassword(v))"
            clearable
            v-model="auth.password"
            :placeholder="$t('PasswordEmpty')"
            @keydown.enter="auth.password && authentication()"
            show-password
          />
        </up-form-item>
      </el-form>
      <up-button
        type="primary"
        :disabled="!auth.password"
        :loading="auth.loading"
        @click="authentication"
      >
        {{ $t('Confirm') }}
      </up-button>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { useGuardian } from '@/composable/useGuardian'

const {
  back,
  sendLink,
  authentication,
  deleteChecked,
  submitDisabled,
  submit,
  formElement,
  authElement,
  unipass,
  form,
  auth,
  userStore,
  closeGuardian,
} = useGuardian()
</script>

<style lang="scss">
#page-setting-guardian {
  position: relative;
  min-height: 100vh;
  padding-bottom: 100px;

  .delete-btn {
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    color: var(--up-text-secondary);
    line-height: 20px;
  }

  .subtitle {
    margin-top: 25px;
    font-size: 14px;
    font-weight: 400;
    color: var(--up-text-third);
    line-height: 20px;
    text-align: left;
  }
  .one {
    margin-top: 28px;
    background: var(--up-bg);
    border-radius: 12px;
    backdrop-filter: blur(8px);
    padding: 16px 20px;
    text-align: left;
    position: relative;

    .top {
      display: flex;
      .name {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        color: initial;
      }
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
      .waiting,
      .success {
        margin-left: 12px;
        color: var(--up-text-third);
        display: flex;
        align-items: center;
        span {
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          margin-left: 4px;
        }
      }
      .icon-close {
        cursor: pointer;
        font-size: 16px;
        color: initial;
        padding: 4px;
        margin-left: auto;
      }
      .success {
        color: var(--up-green);
      }
    }
    .email {
      margin-top: 8px;
      font-size: 14px;
      font-weight: 400;
      color: var(--up-text-third);
      line-height: 20px;
    }
    .email-box {
      margin-top: 24px;
    }
    .delete-box {
      position: absolute;
      top: 0;
      right: 20px;
      bottom: 0;
      height: 100%;
      display: flex;
      align-items: center;
      .check {
        margin-left: auto;
        border-radius: 50%;
        width: 14px;
        height: 14px;
        border: 1px solid var(--up-line);
        display: flex;
        justify-content: center;
        align-items: center;
        .dot {
          border-radius: 50px;
          width: 8px;
          height: 8px;
        }
      }
    }
  }

  .bottom-box {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 24px;
    display: flex;
  }
  .add-guardian {
    .up-button {
      margin-top: 40px;
      margin-bottom: 20px;
    }
  }

  .el-checkbox-group {
    .el-checkbox {
      margin-right: 0;
      display: block;
      height: auto;
      width: 100%;
      &.is-checked {
        .delete-box {
          .check {
            border-color: #8864ff;

            .dot {
              background: #8864ff;
            }
          }
        }
      }
      .el-checkbox__label {
        padding: 0;
        width: 100%;
      }
      .el-checkbox__input {
        display: none;
      }
    }
  }
}
</style>
