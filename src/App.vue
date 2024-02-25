<template>
  <div :class="'responsive'">
    <div :style="{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }">
      <div :class="'mycontainer'">
        <div id="app" class="app-container"></div>
        <div id="canvas-container" class="canvas-container">
          <div id="canvas" class="canvas"></div>
          <div id="overlay" class="overlay-container" v-if="showPro">
            <div class="profit-container">
              <div :style="{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }">
                <span :style="{
                  fontSize: '14px',
                  fontFamily: 'PingFang SC',
                  color: '#B1BAD3',
                }">{{ $t("plinko_showPro_profit") }}</span>
                <span :style="{
                  fontSize: '12px',
                  fontFamily: 'PingFang SC',
                  color: '#B1BAD3',
                }">$0.00</span>
              </div>
              <div :style="{ position: 'relative' }">
                <input class="profit-input" type="text" :value="proText" readonly />
                <img :src="`https://d2utx4nptvgikt.cloudfront.net/currency/${currency_id}.webp`" alt="" width="16"
            height="16" :style="{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: '12px',
                }" />
              </div>
            </div>
            <div class="profit-container">
              <span :style="{
                fontSize: '14px',
                fontFamily: 'PingFang SC',
                color: '#B1BAD3',
              }">{{ $t("plinko_showPro_chance") }}</span>
              <div :style="{ position: 'relative' }">
                <input class="profit-input" type="text" :value="proValue" readonly />
                <img :src="'./image/percent.svg'" alt="" :style="{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: '12px',
                }" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="score !== 0">
          <ScoreBoard />
        </div>
      </div>
      <Setting />
    </div>
    <Fairness v-if="showFairness" />
    <MaxValue v-if="showMaxModal" />
    <GameInfo v-if="showGameInfo" />
    <Hotkeys v-if="showHotkeyModal" />
  </div>
</template>

<style scoped>
@import "./assets/css/style.css";
</style>

<script>
import { onMounted, onUnmounted } from 'vue'
import { store } from "./core/Store";
import ScoreBoard from "./components/ScoreBoard.vue";
import Setting from "./components/Setting.vue";
import Fairness from "./components/Modals/Fairness.vue";
import MaxValue from "./components/Modals/MaxValue.vue";
import GameInfo from "./components/Modals/GameInfo.vue";
import Hotkeys from "./components/Modals/Hotkeys.vue";
import { useAppStore } from '~/store/app'
import { storeToRefs } from "pinia";


export default {
  components: {
    ScoreBoard,
    Fairness,
    Setting,
    MaxValue,
    GameInfo,
    Hotkeys,
  },

  computed: {
    score() {
      return store.currentScore;
    },
    showFairness() {
      return store.showFairness;
    },
    showMaxModal() {
      return store.showMaxValueModal;
    },
    showGameInfo() {
      return store.showGameInfoModal;
    },
    showHotkeyModal() {
      return store.showHotkeyModal;
    },
    showPro() {
      return store.showPro;
    },
    proText() {
      return ((store.proText * 1 - 1) * store.plinkoAmount).toFixed(8);
    },
    proValue() {
      return (store.proValue * 100).toFixed(4);
    },
  },
  setup() {
    const appStore = useAppStore()
    const {currency_id} = storeToRefs(appStore)

    //You will receive the latest updates here
    function propsChange(newObj) {
      console.log("🚀 ~ propsChange ~ newObj:", newObj)
      window.miniGameWujie.props = Object.assign({}, window.miniGameWujie.props, newObj)
      appStore.changeCurrencyId(window.miniGameWujie.props.currencyId)
      appStore.changeCurrentBalance(window.miniGameWujie.props.balance)
      appStore.changeToken(window.miniGameWujie.props.token)
      appStore.changeRate(window.miniGameWujie.props.rate)
      appStore.changeCurrencyPrefix(window.miniGameWujie.props.currencyPrefix)
      appStore.changeDecimalNum(window.miniGameWujie.props.decimalNum)
      appStore.changeLogoUrl(window.miniGameWujie.props.logoUrl)
    }

    onMounted(() => {
      console.log('小游戏加载完成✅');
      window.miniGameWujie.bus.$on('channelMessageWujie', propsChange)
      window.miniGameWujie.bus.$emit('loaded')
    })

    onUnmounted(() => {
      window.miniGameWujie.bus.$off('channelMessageWujie', propsChange)
    })

    return {
      currency_id
    }
  }
};
</script>
