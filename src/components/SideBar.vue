<template>
  <div :class="'container'">
    <div :class="['betTypeContainer']">
      <button
        :class="[
          'typeButton',
          isAutoBetting ? 'disabled' : '',
          { betTypeActive: isManualButton },
        ]"
        @click="activeButton('manualButton')"
        :disabled="isAutoBetting"
      >
        <span>{{ $t("plinko_manual") }}</span>
      </button>
      <button
        :class="[
          'typeButton',
          isAutoBetting ? 'disabled' : '',
          { betTypeActive: isAutoButton },
        ]"
        @click="activeButton('autoButton')"
        :disabled="isAutoBetting"
      >
        <span>{{ $t("plinko_auto") }}</span>
      </button>
    </div>
    <div :ref="'amountorder'" :class="['amountorder']">
      <div :class="'betamountcontainer'">
        <div :class="'spanstyle'">{{ $t("plinko_amount") }}</div>
        <div :class="'spanstyle'" :style="{ fontSize: '12px' }">
          {{ currencyPrefix
          }}<span :style="{ fontFamily: 'PingFang SC' }">{{
            amountMulRate
          }}</span>
        </div>
      </div>
      <!-- 投注金额 -->
      <div :class="'betAmountContainer'">
        <div :class="['tooltip']" style="position: static">
          <input
            :class="[
              'betAmountInput',
              isAutoBetting ? 'disabled' : '',
              { warning: isError || isAmountOverBalance },
            ]"
            :ref="'betAmountInput'"
            v-model="amount"
            placeholder="0.00000000"
            type="number"
            min="0"
            step="0.00000001"
            @focus="selectInput"
            @focusout="changeAmount"
            @change="changeState"
            :disabled="isAutoBetting"
          />
          <img
            :src="`https://d2utx4nptvgikt.cloudfront.net/currency/${currency_id}.webp`"
            width="16"
            height="16"
            alt="Image"
            :class="'bitImage'"
          />
          <span
            v-if="isAmountOverBalance"
            class="tooltiptext"
            style=" visibility: visible;left:50%;transform: translateX(-50%); }"
            >{{ $t("plinko_betamountalert") }}</span
          >
        </div>
        <div :class="['buttons-container', isBetting ? 'disabled' : '']">
          <button
            :class="'betAmountTimesBtn'"
            @click="betAmountTimes(0.5)"
            :disabled="isAutoBetting"
          >
            <span>½</span>
          </button>
          <button
            :class="'betAmountTimesBtn'"
            @click="betAmountTimes(2)"
            :disabled="isAutoBetting"
          >
            <span>2×</span>
          </button>
          <button
            v-if="showMax"
            :class="'betAmountTimesBtn'"
            @click="betAmountTimes(999)"
            :disabled="isAutoBetting"
          >
            <span>{{ $t("plinko_max") }}</span>
          </button>
        </div>
      </div>
    </div>
    <div :class="['levelorder']">
      <div :class="'spanstyle'">{{ $t("plinko_risk") }}</div>
      <img
        :src="'./image/arrow-down.svg'"
        width="14"
        height="14"
        alt="Image"
        :class="'arrow-down'"
      />
      <select
        :class="['baseStyle', isBetting || isAutoBetting ? 'disabled' : '']"
        v-model="level"
        @change="changeState"
        :disabled="isBetting || isAutoBetting"
        :style="{ fontFamily: 'PingFang SC', fontWeight: 600 }"
      >
        <option value="low">{{ $t("plinko_level1") }}</option>
        <option value="middle">{{ $t("plinko_level2") }}</option>
        <option value="high">{{ $t("plinko_level3") }}</option>
      </select>
    </div>
    <div :class="['roworder']">
      <div :class="'spanstyle'">{{ $t("plinko_rows") }}</div>
      <img
        :src="'./image/arrow-down.svg'"
        width="14"
        height="14"
        alt="Image"
        :class="'arrow-down'"
      />
      <select
        :class="['baseStyle', isBetting || isAutoBetting ? 'disabled' : '']"
        v-model="rows"
        @change="changeState"
        :disabled="isBetting || isAutoBetting"
        :style="{ fontFamily: 'Inter', fontWeight: 600 }"
      >
        <option v-for="value in rowValues" :key="value" :value="value">
          {{ value }}
        </option>
      </select>
    </div>
    <div :class="['betNumberContainer']" v-if="isAutoButton">
      <div :class="'spanstyle'">{{ $t("plinko_betNumbers") }}</div>
      <div :class="['tooltip']">
        <input
          :class="['baseStyle', isAutoBetting ? 'disabled' : '']"
          v-model="numberofbet"
          type="number"
          min="0"
          max="999999999"
          @change="changeState"
          @input="
            validNumberofBet = numberofbet > 999999999 ? true : false;
            numberofbet = numberofbet > 999999999 ? 999999999 : numberofbet;
          "
          @focusout="validNumberofBet = false"
          :disabled="isAutoBetting"
          :style="{
            fontFamily: 'Inter',
            fontWeight: 600,
            paddingRight: isInfinitive ? '5px' : '0px',
          }"
        />
        <span
          v-if="validNumberofBet"
          class="tooltiptext"
          style=" visibility: visible;left:50%;transform: translateX(-50%); }"
          >{{ $t("plinko_maximum_auto_bet_number") }}</span
        >
      </div>
      <img
        v-show="isInfinitive"
        :src="'./image/infinitive.svg'"
        width="14"
        height="14"
        alt="Image"
        :class="'infinitiveImage'"
      />
    </div>
    <!-- 投注 -->
    <div :ref="'betbuttonorder'" :class="'betbuttonorder'">
      <button
        class="baseStyle betButton"
        :class="{ betBtnDisabled: betBtnDisabled }"
        @click="bet"
        :disabled="betLoading"
      >
        <span v-show="isManualButton ? !betLoading : true">{{
          isManualButton
            ? $t("plinko_bet")
            : isAutoBetting
            ? $t("plinko_autobetstop")
            : $t("plinko_autobetstart")
        }}</span>
        <img
          v-show="betLoading && !isAutoBetting"
          :src="'./image/dice.svg'"
          width="16"
          height="16"
          alt="Image"
          class="ani-roll"
        />
        <img
          v-if="isAutoBetting"
          :src="'./image/betting.svg'"
          width="16"
          height="16"
          alt="Image"
          :class="'betting-image'"
        />
      </button>
    </div>
  </div>
  <div :class="'alert-container'">
    <div v-if="autoStart" :class="'autobet-alert'">
      <div :class="'auto-image'">
        <img
          :src="'./image/auto.svg'"
          width="20"
          height="20"
          alt="Image"
          :class="'infinitiveImage'"
        />
      </div>
      <span>{{ $t("plinko_autobetalert1") }}</span>
      <div :class="'close'">
        <img
          :src="'./image/times.svg'"
          width="14"
          height="14"
          alt="Image"
          :class="'infinitiveImage'"
        />
      </div>
      <div :class="'alert-timeline'"></div>
    </div>
    <div v-if="autoEnd" :class="'autobet-alert'">
      <div :class="'auto-image'">
        <img
          :src="'./image/auto.svg'"
          width="20"
          height="20"
          alt="Image"
          :class="'infinitiveImage'"
        />
      </div>
      <span>{{ $t("plinko_autobetalert2") }}</span>
      <div :class="'close'">
        <img
          :src="'./image/times.svg'"
          width="14"
          height="14"
          alt="Image"
          :class="'infinitiveImage'"
        />
      </div>
      <div :class="'alert-timeline'"></div>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/css/sidebar.css";
</style>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import axios from "axios";
import { store, mutations } from "../core/Store";
import { Plinko } from "../core/Plinko";
import Language from "./Language.vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "~/store/app";
import { storeToRefs } from "pinia";
import { ApiGameBetting } from "~/http/api";
import { useRequest } from "vue-request";
import { bettingBus } from "~/core/bus";
import { mul, toFixed } from "~/utils/number";
import { NineSlicePlane } from "pixi.js";

export default {
  computed: {
    showMax() {
      return store.isMaximum;
    },
    autoStart() {
      return store.autoStart;
    },
    autoEnd() {
      return store.autoEnd;
    },
  },
  setup() {
    const appStore = useAppStore();
    const {
      token,
      isLogin,
      currency_id,
      currentBalance,
      rate,
      currencyPrefix,
      decimalNum,
    } = storeToRefs(appStore);
    const { t } = useI18n();

    const isManualButton = ref(true);
    const isAutoButton = ref(false);
    const isAutoBetting = ref(false);
    const isError = ref(false);
    const amount = ref(toFixed(0, decimalNum.value));
    const level = ref(localStorage.getItem("PLINKO_DEFAULT_LEVEL") ?? "middle");
    const rows = ref("16");
    const numberofbet = ref(0);
    const validNumberofBet = ref(false);
    const isMaximum = ref(false);
    const rowValues = ["8", "9", "10", "11", "12", "13", "14", "15", "16"];
    let intervalId;
    const bettingCount = ref(0);
    const betAmountInput = ref(null);
    const statisticsComponent = ref(null);
    const amountorder = ref(null);
    const betbuttonorder = ref(null);
    const volumn = ref(
      computed(() => {
        return store.volumn;
      })
    );
    const isAmountOverBalance = computed(
      () => +amount.value > +currentBalance.value
    );
    const isBetting = computed(() => bettingCount.value > 0);
    const isInfinitive = computed(() => numberofbet.value === 0);
    const amountMulRate = computed(() =>
      toFixed(+mul(+amount.value, +rate.value))
    );

    const plinko = Plinko(document.body.querySelector("#canvas"));
    plinko.map();

    const changeState = () => {
      mutations.updatePlinko(amount.value, rows.value, level.value);
      plinko.GetSettings(level.value, rows.value);
      plinko.clear();
      plinko.map();
    };

    const selectInput = () => {
      const inputField = betAmountInput.value;
      if (inputField) {
        inputField.select();
      }
    };
    // play mp3
    const playMp3 = () => {
      const audio = new Audio("./audio/bet.mp3");
      audio.volume = volumn.value / 100;
      audio.play();
    };

    // 下注
    const { run: runBetting, loading: betLoading } = useRequest(
      () =>
        ApiGameBetting({
          line: rows.value,
          amount: amount.value.toString(),
          risk: level.value.toLowerCase(),
          currency_id: currency_id.value,
        }),
      {
        manual: true,
        onSuccess(res) {
          playMp3();
          plinko.add(res.state.index + 1);
          bettingCount.value = bettingCount.value + 1;

          if (isAutoBetting.value && numberofbet.value > 0) {
            numberofbet.value -= 1;
            if (numberofbet.value === 0) {
              stopAutoBetting();
            }
          }
        },
      }
    );
    const betBtnDisabled = computed(() => {
      if (isLogin.value) {
        return betLoading.value || isAmountOverBalance.value;
      }
      return false;
    });

    const bet = () => {
      // token
      if (!token.value) return window.miniGameWujie.bus.$emit("openRegister");

      // not enough balance
      if (!amount.value || +amount.value > +currentBalance.value) {
        isError.value = true;
        return;
      }

      // manual bet
      if (isManualButton.value) {
        return runBetting();
      }

      // auto bet
      if (!isAutoBetting.value) {
        startAutoBetting();
      } else {
        stopAutoBetting();
      }
    };

    const showAlert = (req) => {
      mutations.updateAuto(req);
    };

    const startAutoBetting = () => {
      isAutoBetting.value = true;
      window.miniGameWujie.props.openNotify({
        type: "auto",
        message: `<span style="color:#fff;font-weight:600;">${t(
          "plinko_autobetalert1"
        )}</span>`,
      });

      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (+amount.value > +currentBalance.value) {
          stopAutoBetting();
        } else if (!betLoading.value) {
          runBetting();
        }
      }, 1000);
    };

    const stopAutoBetting = () => {
      isAutoBetting.value = false;
      window.miniGameWujie.props.openNotify({
        type: "auto",
        message: `<span style="color:#fff;font-weight:600;">${t(
          "plinko_autobetalert2"
        )}</span>`,
      });
      clearInterval(intervalId);
    };

    const activeButton = (buttonId) => {
      isManualButton.value = buttonId === "manualButton";
      isAutoButton.value = buttonId === "autoButton";
      changeOrder();
    };

    const changeOrder = () => {
      if (window.innerWidth > 1100) {
        betbuttonorder.value.style.order = 6;
        amountorder.value.style.order = 1;
      } else {
        betbuttonorder.value.style.order = isAutoButton.value ? 1 : 2;
        amountorder.value.style.order = isAutoButton.value ? 2 : 1;
      }
    };

    const betAmountTimes = (times) => {
      if (times === 999) {
        amount.value = 999999;
      }
      amount.value = amount.value * times;
      changeAmount();
    };

    const handleResize = () => {
      let newWidth = window.innerWidth;
      if (newWidth < 1200) {
        changeOrder();
      }
      plinko.map();
    };

    const changeAmount = () => {
      amount.value = toFixed(+amount.value, decimalNum.value);
      mutations.updatePlinko(amount.value, rows.value, level.value);
    };
    const handleDataUpdate = (data) => {
      if (data === 1 || data === 2) {
        playMp3();
        bettingCount.value = bettingCount.value - 1;
        window.miniGameWujie.props.getBalanceData();
      }
    };

    watch(decimalNum, () => {
      amount.value = toFixed(0, decimalNum.value);
    });
    watch(level, (a) => {
      localStorage.setItem("PLINKO_DEFAULT_LEVEL", a);
    });

    onMounted(() => {
      bettingBus.on(handleDataUpdate);
      window.addEventListener("resize", handleResize);
      plinko.GetSettings(level.value, rows.value);

      const a = document.getElementsByTagName("canvas");
      const canvasArr = Array.from(a);
      for (let i = 0; i < canvasArr.length; i++) {
        canvasArr[i].style.touchAction = "manipulation";
      }

      localStorage.setItem("PLINKO_DEFAULT_LEVEL", level.value);
    });

    onUnmounted(() => {
      bettingBus.off(handleDataUpdate);
      window.removeEventListener("resize", handleResize);
    });

    return {
      isManualButton,
      isAutoButton,
      isAutoBetting,
      isError,
      amount,
      level,
      rows,
      numberofbet,
      rowValues,
      bettingCount,
      isBetting,
      betAmountInput,
      statisticsComponent,
      isMaximum,
      amountorder,
      betbuttonorder,
      currency_id,
      isAmountOverBalance,
      betLoading,
      isInfinitive,
      rate,
      currencyPrefix,
      amountMulRate,
      betBtnDisabled,
      validNumberofBet,
      activeButton,
      selectInput,
      betAmountTimes,
      changeState,
      bet,
      changeAmount,
    };
  },
};
</script>
