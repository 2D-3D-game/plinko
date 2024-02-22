<template>
  <div id="setting" :class="'footer-container'">
    <div :class="'button-group-container'">
      <div :class="'dropdown'">
        <!-- <div :class="'stooltip'">
          <button :class="['button-group', 'dropbtn']" @click="showSetting">
            <span><img :src="settingSrc" width="14" height="14" alt="Image" @mouseover="handleMouseOver('setting')"
                @mouseout="handleMouseOut('setting')" /></span>
            <span class="tooltiptext">{{ $t("plinko_tooltip1") }}</span>
          </button>
        </div> -->
        <div v-if="isShowSetting" class="dropdown-content">
          <div :class="'contents'">
            <button>
              <span>
                <img :src="volumn > 0 ? './image/voice-active.svg' : './image/voice.svg'
                  " width="16" height="16" alt="Image" @click="
    volumn === 0
      ? ((volumn = 50), changeVolumn(50))
      : ((volumn = 0), changeVolumn(0))
    " />
              </span>
            </button>
            <div class="windowsSlider">
              <input v-model="volumn" type="range" class="windowsSliderInput" min="0" max="100"
                @input="changeVolumn(volumn)" />
              <div class="windowsSliderProgress" :style="{ width: volumn + '%' }"></div>
            </div>
          </div>
          <!-- <button
            :class="['contents', isLive ? 'unactivecontent' : 'activecontent']"
            @click="liveSetting"
          >
            <span
              ><img
                :src="isLive ? './image/live-active.svg' : './image/live.svg'"
                width="14"
                height="14"
                alt="Image"
              />
              <span :class="isLive ? 'active' : null">{{
                $t("plinko_live")
              }}</span></span
            >
          </button> -->
          <!-- <button
            :class="[
              'contents',
              isAnimation ? 'unactivecontent' : 'activecontent',
            ]"
            @click="animationSetting"
          >
            <span
              ><img
                :src="
                  isAnimation
                    ? './image/animation-active.svg'
                    : './image/animation.svg'
                "
                width="14"
                height="14"
                alt="Image"
              />
              <span :class="isAnimation ? 'active' : null">{{
                $t("plinko_animation")
              }}</span></span
            >
          </button> -->
          <button :class="['contents', showMax ? 'unactivecontent' : 'activecontent']" @click="showMaxSetting">
            <span><img :src="showMax ? './image/maxvalue-active.svg' : './image/maxvalue.svg'
              " width="14" height="14" alt="Image" />
              <span :class="showMax ? 'active' : ''">{{
                $t("plinko_maxvalue")
              }}</span></span>
          </button>
          <button :class="['contents', 'activecontent']" @click="showGameInfo">
            <span><img :src="'./image/info.svg'" width="14" height="14" alt="Image" />
              <span>{{ $t("plinko_info") }}</span></span>
          </button>
          <!-- <button
            :class="[
              'contents',
              hotkeyState ? 'unactivecontent' : 'activecontent',
            ]"
            @click="showHotkeySetting"
          >
            <span
              ><img
                :src="hotkeyState ? './image/key-active.svg' : './image/key.svg'"
                width="14"
                height="14"
                alt="Image"
              />
              <span :class="hotkeyState ? 'active' : ''">{{
                $t("plinko_keyboard")
              }}</span></span
            >
          </button> -->
          <div :class="'triangle'"></div>
        </div>
      </div>
      <!-- <div :class="'stooltip'">
        <button :class="'button-group'">
          <span>
            <img
              :src="rectSrc"
              width="14"
              height="14"
              alt="Image"
              @mouseover="handleMouseOver('rect')"
              @mouseout="handleMouseOut('rect')"
            />
          </span>
          <span class="tooltiptext">{{ $t("plinko_tooltip2") }}</span>
        </button>
      </div> -->
      <!-- <div :class="'stooltip'">
        <button :class="'button-group'" @click="showStatistics">
          <span>
            <img
              :src="totalSrc"
              width="14"
              height="14"
              alt="Image"
              @mouseover="handleMouseOver('total')"
              @mouseout="handleMouseOut('total')"
            />
          </span>
          <span class="tooltiptext">{{ $t("plinko_tooltip3") }}</span>
        </button>
      </div> -->
      <!-- <div :class="'stooltip'">
        <button :class="'button-group'" @click="changeImage">
          <span>
            <img :src="isFavorite ? './image/favorite.svg' : unSrc" width="14" height="14" alt="Image"
              @mouseover="handleMouseOver('un')" @mouseout="handleMouseOut('un')" />
          </span>
          <span class="tooltiptext">{{ $t("plinko_tooltip4") }}</span>
        </button>
      </div> -->
      <!-- <div :class="'divider'"></div> -->
    </div>
    <div v-if="logoUrl" :class="'footer-image'">
      <img :src="logoSrc" alt="Image" width="68" height="25" />
    </div>
    <button :style="{ background: 'transparent', border: 'none' }" @click="showFairness">
      <span :class="'footer-span'">{{ $t("plinko_fairness") }}</span>
    </button>
    <!-- <RealTimeStatistics /> -->
  </div>
</template>

<style scoped>
@import "../assets/css/setting.css";
</style>

<script>
import { ref } from "vue";
import { mutations, store } from "../core/Store";
import RealTimeStatistics from "./Modals/RealTimeStatistics.vue";
import { useAppStore } from "~/store/app";
import { storeToRefs } from "pinia";
import { GAMES_LIST_ENUM } from 'feie-ui'

export default {
  components: {
    RealTimeStatistics,
  },
  data() {
    return {
      settingSrc: "./image/setting.svg",
      rectSrc: "./image/rect.svg",
      totalSrc: "./image/total.svg",
      unSrc: "./image/unfavorite.svg",
    };
  },
  methods: {
    handleMouseOut(button) {
      this.settingSrc = "./image/setting.svg";
      this.rectSrc = "./image/rect.svg";
      this.totalSrc = "./image/total.svg";
      this.unSrc = "./image/unfavorite.svg";
    },
    handleMouseOver(button) {
      switch (button) {
        case "setting":
          this.settingSrc = "./image/settinghover.svg";
          break;
        case "total":
          this.totalSrc = "./image/totalhover.svg";
          break;
        case "rect":
          this.rectSrc = "./image/recthover.svg";
          break;
        case "un":
          this.unSrc = "./image/unfavoritehover.svg";
          break;
      }
    },
  },

  computed: {
    showMax() {
      return store.isMaximum;
    },
    hotkeyState() {
      return store.hotkey;
    },
  },
  setup() {
    const isFavorite = ref(false);
    const isShowSetting = ref(false);
    const isLive = ref(false);
    const isAnimation = ref(false);
    const volumn = ref(50);
    const rectComponent = ref(null);
    const { logoSrc ,isLogin,logoUrl} = storeToRefs(useAppStore())

    const changeImage = () => {
      isFavorite.value = !isFavorite.value;
    };

    const showSetting = () => {
      isShowSetting.value = !isShowSetting.value;
    };

    const liveSetting = () => {
      isLive.value = !isLive.value;
    };

    const animationSetting = () => {
      isAnimation.value = !isAnimation.value;
    };

    const showMaxSetting = () => {
      if (!store.isMaximum) {
        mutations.showMaxValueModal();
        isShowSetting.value = false;
        scrollUp();
      } else {
        mutations.showMaximum(!store.isMaximum);
      }
    };

    const showGameInfo = () => {
      mutations.showGameInfoModal();
      isShowSetting.value = false;
      scrollUp();
    };

    const showHotkeySetting = () => {
      mutations.showHotkeyModal();
      isShowSetting.value = false;
      scrollUp();
    };

    const showStatistics = () => {
      mutations.showStatistics();
      isShowSetting.value = false;
      scrollUp();
    };

    const showFairness = () => {
      // mutations.seedDetail();
      // mutations.showFairness();
      if(!isLogin.value){
        return window.miniGameWujie.bus.$emit('openRegister')
      }
      window.miniGameWujie.bus.$emit('openProvablyFair',GAMES_LIST_ENUM.PLINKO)
      scrollUp();
    };

    const scrollUp = () => {
      window.miniGameWujie.bus.$emit('scrollToTop')
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }

    const changeVolumn = (value) => {
      mutations.changeVolumn(value);
    };

    return {
      isFavorite,
      isShowSetting,
      isLive,
      isAnimation,
      volumn,
      rectComponent,
      logoSrc,
      logoUrl,
      changeImage,
      showSetting,
      liveSetting,
      animationSetting,
      showMaxSetting,
      showGameInfo,
      showHotkeySetting,
      showStatistics,
      showFairness,
      changeVolumn,
    };
  },
};
</script>
