<template>
  <div id="page-verify-phone">
    <up-header :title="$t('PhoneVerify')" />
    <img class="up-illustration" src="@/assets/img/verify/phone.png" />
    <h6>{{ $t('VerifyPhoneTip') }}</h6>
    <el-form @submit.prevent ref="formElement" :model="form">
      <up-form-item class="phone" prop="phone" :label="form.phone && $t('Phone')">
        <up-input
          v-model="form.phone"
          :placeholder="$t('EnterPhone')"
          :disabled="form.loading"
          @keydown.enter="form.phone && form.phoneCode && fetchPhoneCode()"
          type="tel"
          maxlength="11"
          @input="(v) => (form.phone = v.replaceAll(/\D/g, ''))"
        >
          <template #prefix>
            <el-select
              v-model="form.areaCode"
              filterable
              class="country-code"
              :filter-method="country.filter"
              popper-class="country-code-popper"
            >
              <el-option
                v-for="item in country.list"
                :key="item.en"
                :label="item.phone_code"
                :value="item.phone_code"
              >
                <div class="one">
                  <span class="left">{{ $i18n.locale === 'zh' ? item.cn : item.en }}</span>
                  <span class="right">{{ item.phone_code }}</span>
                </div>
              </el-option>
            </el-select>
          </template>
        </up-input>
      </up-form-item>
      <up-form-item class="code" prop="phoneCode" :label="form.phoneCode && $t('PhoneCode')">
        <up-input
          v-model="form.phoneCode"
          :placeholder="$t('EnterPhoneCode')"
          :disabled="form.loading"
          @keydown.enter="form.phone && form.phoneCode && verifyPhoneCode()"
          type="tel"
          maxlength="6"
          @input="(v) => (form.phoneCode = v.replaceAll(/\D/g, ''))"
        >
          <template #suffix>
            <el-button
              class="send-code"
              :loading="form.isPhoneCodeLoading"
              :disabled="form.count > 0 || form.loading || !form.phone"
              link
              @click="fetchPhoneCode"
            >
              <template v-if="form.count > 0"> {{ form.count }}s </template>
              <template v-else>{{ $t('FetchEmailCode') }}</template>
            </el-button>
          </template>
        </up-input>
      </up-form-item>

      <up-button
        class="submit"
        type="primary"
        @click="verifyPhoneCode"
        :disabled="!(form.phone && form.phoneCode)"
        :loading="form.loading"
      >
        {{ $t('Confirm') }}
      </up-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useVerifyPhone } from '@/composable/useVerify'
import CountryCode from '@/utils/country-code'
const country = reactive({
  filter(v: string) {
    v = v.toLowerCase()
    country.list = CountryCode.filter((e) => {
      const en = e.en.toLowerCase()
      return e.cn.includes(v) || en.includes(v) || e.phone_code.includes(v)
    })
  },
  list: CountryCode,
})

const { form, formElement, fetchPhoneCode, verifyPhoneCode } = useVerifyPhone()
</script>

<style lang="scss">
.country-code-popper {
  .one {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .right {
      margin-left: 8px;
    }
  }
  .el-popper__arrow {
    display: none;
  }
}
#page-verify-phone {
  .phone {
    margin-top: 40px;
    > .el-form-item__content {
      > .el-input {
        > .el-input__wrapper {
          padding-left: 100px;
        }
      }
    }
    .country-code {
      width: 100px;
      .el-input__wrapper {
        box-shadow: none !important;
        background: transparent;
      }
    }
  }

  .code {
    margin-top: 24px;
  }

  .submit {
    margin-top: 40px;
  }
}
</style>
