<template>
  <el-drawer
    v-model="userStore.showHeaderMore"
    direction="rtl"
    custom-class="up-header-more"
    size="290px"
  >
    <div class="one" @click="toggleDark()">
      <div class="left">
        <up-icon name="theme" />
        <div>{{ isDark ? $t('ThemeLight') : $t('ThemeDark') }}</div>
      </div>
      <div class="right">
        <up-icon name="cutover" />
      </div>
    </div>
    <div class="one" @click="changeLanguage">
      <div class="left">
        <up-icon name="english" />
        <div>{{ $t('Language') }}</div>
      </div>
      <div class="right">
        <div class="now">{{ $t('LanguageNow') }}</div>
        <up-icon name="jump" />
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const i18n = useI18n()
const isDark = useDark()
const { t: $t } = useI18n()

const changeLanguage = () => {
  i18n.locale.value = i18n.locale.value === 'en' ? 'zh' : 'en'
  localStorage.setItem('language', i18n.locale.value)
}

const toggleDark = useToggle(isDark)
</script>

<style lang="scss">
.up-header-more {
  border-radius: 0 !important;
  .el-drawer__body {
    padding: 0;
    .one {
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
      user-select: none;

      .iconpark {
        font-size: 20px;
      }
      .left {
        display: flex;
        align-items: center;
        .iconpark {
          margin-right: 6px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        .icon-cutover {
          font-size: 16px;
        }
        .icon-jump {
          margin-left: 6px;
          font-size: 14px;
        }
        .now {
          font-size: 14px;
          font-weight: 400;
          color: var(--up-text-third);
          line-height: 14px;
        }
      }
    }
  }
}
</style>
