<template>
  <div id="page-setting">
    <up-header :title="$t('Setting')"></up-header>

    <router-link class="one" to="/setting/2FA">
      <div class="left">
        <up-icon name="identity" />
        <div>{{ $t('DualAuthentication') }}</div>
      </div>
      <div class="right">
        <up-icon name="jump" />
      </div>
    </router-link>
    <!-- <router-link class="one" to="/setting/chain">
      <div class="left">
        <up-icon name="from" />
        <div>{{ $t('Network') }}</div>
      </div>
      <div class="right">
        <div class="now">ETH</div>
        <up-icon name="jump" />
      </div>
    </router-link> -->
    <router-link class="one" to="/setting/guardian">
      <div class="left">
        <up-icon name="email" />
        <div>{{ $t('Guardian') }}</div>
      </div>
      <div class="right">
        <div class="now"></div>
        <up-icon name="jump" />
      </div>
    </router-link>
    <!-- <router-link class="one" to="/setting/change-password">
      <div class="left">
        <up-icon name="change-password" />
        <div>{{ $t('ChangePassword') }}</div>
      </div>
      <div class="right">
        <up-icon name="jump" />
      </div>
    </router-link> -->
    <div class="line"></div>
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

    <up-button class="exit" type="info" @click="unipass.userExit">
      <up-icon name="exit" />
      <span>{{ $t('LogOut') }}</span>
    </up-button>
  </div>
</template>

<script lang="ts" setup>
import { useUniPass } from '@/utils/useUniPass'

const unipass = useUniPass()
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
#page-setting {
  .line {
    width: 100%;
    height: 1px;
    background-color: var(--up-line);
    margin: 20px 0;
  }

  .up-header {
    margin-bottom: 16px;
  }

  .one {
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
  a.one {
    color: initial;
  }

  .exit {
    margin-top: 30px;
    .icon-exit {
      font-size: 24px;
      margin-right: 8px;
    }
  }
}
</style>
