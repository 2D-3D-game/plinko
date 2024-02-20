<template>
  <div :class="['modal', 'active']" :ref="'scoreModal'" @click="closeModal">
    <div :class="'modal__content'" @click.stop>
      <div :class="'modal-title'">
        <span
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '16px',
          }"
        >
          <img :src="'./image/score.svg'" alt="Image" width="16" height="16" />
          {{ $t("plinko_bet") }}
        </span>
        <button class="modal__close" @click="hideModal">
          <span
            ><img :src="'./image/times.svg'" alt="Image" width="10" height="10"
          /></span>
        </button>
      </div>

      <div :class="'modal-body'">
        <span :class="'white-span'" :style="{ height: '22px' }">Plinko</span>
        <div :class="'id-container'" :style="{ height: '22px' }">
          <span :class="'white-span'"
            >ID <span :style="{ fontFamily: 'Inter' }">{{ copy1 }}</span></span
          >
          <div :class="'stooltip'">
            <button
              @mouseover="changeHover('isHover1', 'on')"
              @mouseout="changeHover('isHover1', 'off')"
              @click="copyText('copy1')"
            >
              <span>
                <img
                  :src="
                    isHover1 ? './image/copy-hover.svg' : './image/copy.svg'
                  "
                  alt="Image"
                  width="14"
                  height="14"
                />
              </span>
            </button>
            <span
              :class="['tooltiptext1', copied1 ? 'tooltiptext1-active' : '']"
              >{{ $t("plinko_copyId_share") }}</span
            >
          </div>
          <div :class="'stooltip'">
            <button
              @mouseover="changeHover('isHover2', 'on')"
              @mouseout="changeHover('isHover2', 'off')"
              @click="copyText('copy5')"
            >
              <span>
                <img
                  :src="
                    isHover2 ? './image/link-hover.svg' : './image/link.svg'
                  "
                  alt="Image"
                  width="14"
                  height="14"
                />
              </span>
            </button>
            <span
              :class="['tooltiptext1', copied5 ? 'tooltiptext1-active' : '']"
              >{{ $t("plinko_copyId") }}</span
            >
          </div>
        </div>
        <span
          :class="'gray-span'"
          :style="{ marginTop: '16px', height: '20px' }"
        >
          {{ $t("plinko_scoreboard_time") }}dwwyy332
        </span>
        <span
          :class="'gray-span'"
          :style="{ marginTop: '5px', height: '20px' }"
        >
          {{ $t("plinko_scoreboard_on") }}
          <span :style="{ fontFamily: 'Inter' }">1/13/2024</span>
          {{ $t("plinko_scoreboard_at") }}
          <span :style="{ fontFamily: 'Inter' }">4:51</span> PM
        </span>
        <div :class="'forLogo'">
          <img
            :src="'./image/Vector1.svg'"
            alt="Image"
            width="91"
            height="34"
          />
        </div>
        <div :class="'state-container'">
          <div :class="'state'">
            <span :class="'gray-span'">{{ $t("plinko_bet") }}</span>
            <span :class="'number-span'">
              {{ plinkoAmount }}
              <img
                :src="'./image/bit.svg'"
                alt="Image"
                width="14"
                height="14"
              />
            </span>
          </div>
          <div :class="'state'">
            <span :class="'gray-span'">{{
              $t("plinko_scoreboard_multi")
            }}</span>
            <span :class="'number-span'"> {{ cText }}x </span>
          </div>
          <div :class="'state'">
            <span :class="'gray-span'">{{
              $t("plinko_scoreboard_payout")
            }}</span>
            <span v-if="plinkoAmount * (cText - 1) > 0" :class="['number-span', 'success']">
              {{ (plinkoAmount * (cText - 1)).toFixed(9) }}
              <img
                :src="'./image/bit.svg'"
                alt="Image"
                width="14"
                height="14"
              />
            </span>
            <span v-else :class="['number-span', 'failed']">
              {{ (0).toFixed(9) }}
              <img
                :src="'./image/bit.svg'"
                alt="Image"
                width="14"
                height="14"
              />
            </span>
          </div>
        </div>
        <div :class="'score'">
          <div
            :class="'rect'"
            :style="{
              background: cColor,
              boxShadow: `0px 3px 0px 0px ${cShadow}`,
            }"
          >
            <span :class="'gray-span'" :style="{ color: '#000' }"
              >{{ cText }}x</span
            >
          </div>
        </div>
        <div :class="'rowrisk'">
          <div :class="'input-container'">
            <div :class="'gray-span'" :style="{ fontFamily: 'Inter' }">
              {{ $t("plinko_risk") }}
            </div>
            <input
              :class="'inputStyle'"
              type="text"
              :value="$t(`${plinkoLevel}`)"
              readonly
            />
          </div>
          <div :class="'input-container'">
            <div :class="'gray-span'" :style="{ fontFamily: 'Inter' }">
              {{ $t("plinko_rows") }}
            </div>
            <input
              :class="'inputStyle'"
              type="text"
              :value="plinkoRow"
              readonly
            />
          </div>
        </div>
        <button :class="'playbutton'" @click="hideModal">
          <span :class="'gray-span'"
            >{{ $t("plinko_scoreboard_play") }}</span
          >
        </button>
        <div :class="'fairness'">
          <span
            :class="'white-span'"
            @click="showFairness"
            :style="{ cursor: 'pointer', fontSize: '14px' }"
            @mouseover="changeHover('isHover3', 'on')"
            @mouseout="changeHover('isHover3', 'off')"
          >
            {{ $t("plinko_scoreboard_provable") }}
            <img
              :src="
                isHover3
                  ? './image/arrow-left-hover.svg'
                  : './image/arrow-left.svg'
              "
              alt="Image"
              width="14"
              height="14"
              :style="{ transform: showFairFlag ? 'rotate(-90deg)' : 'none' }"
            />
          </span>
          <div :class="'fairness-container'" v-if="showFairFlag">
            <div :class="'input-container'">
              <div :class="'gray-span'">{{ $t("plinko_prove_text1") }}</div>
              <div :class="'inputBox'">
                <input
                  :class="'inputStyle'"
                  type="text"
                  :value="$t('plinko_prove_value1')"
                  readonly
                  :style="{
                    background: '#203441',
                    color: '#868F96',
                    borderColor: '#203441',
                  }"
                />
              </div>
            </div>
            <div :class="'input-container'">
              <div :class="'gray-span'">{{ $t("plinko_prove_text2") }}</div>
              <div :class="['inputBox', 'buttonBox']">
                <input
                  :class="'inputStyle'"
                  type="text"
                  v-model="copy2"
                  readonly
                  :style="{ width: 'calc(100% - 46px)' }"
                />
                <div :class="'stooltip'" :style="{ width: '46px' }">
                  <button :class="'copy'" @click="copyText('copy2')">
                    <span>
                      <img
                        :src="'./image/copy-hover.svg'"
                        alt="Image"
                        width="14"
                        height="14"
                      />
                    </span>
                  </button>
                  <span
                    :class="[
                      'tooltiptext1',
                      copied2 ? 'tooltiptext1-active' : '',
                    ]"
                    >{{ $t("plinko_copyText") }}</span
                  >
                </div>
              </div>
            </div>
            <div :class="'seed'">
              <div :class="'input-container'">
                <div :class="'gray-span'">{{ $t("plinko_prove_text3") }}</div>
                <div :class="['inputBox', 'buttonBox']">
                  <input
                    :class="'inputStyle'"
                    type="text"
                    v-model="copy3"
                    readonly
                    :style="{ width: 'calc(100% - 46px)' }"
                  />
                  <div :class="'stooltip'" :style="{ width: '46px' }">
                    <button :class="'copy'" @click="copyText('copy3')">
                      <span>
                        <img
                          :src="'./image/copy-hover.svg'"
                          alt="Image"
                          width="14"
                          height="14"
                        />
                      </span>
                    </button>
                    <span
                      :class="[
                        'tooltiptext1',
                        copied3 ? 'tooltiptext1-active' : '',
                      ]"
                      >{{ $t("plinko_copyText") }}</span
                    >
                  </div>
                </div>
              </div>
              <div :class="'input-container'">
                <div :class="'gray-span'">{{ $t("plinko_prove_text4") }}</div>
                <div :class="['inputBox', 'buttonBox']">
                  <input
                    :class="'inputStyle'"
                    type="text"
                    v-model="copy4"
                    readonly
                    :style="{ width: 'calc(100% - 46px)' }"
                  />
                  <div :class="'stooltip'" :style="{ width: '46px' }">
                    <button :class="'copy'" @click="copyText('copy4')">
                      <span>
                        <img
                          :src="'./image/copy-hover.svg'"
                          alt="Image"
                          width="14"
                          height="14"
                        />
                      </span>
                    </button>
                    <span
                      :class="[
                        'tooltiptext1',
                        copied4 ? 'tooltiptext1-active' : '',
                      ]"
                      >{{ $t("plinko_copyText") }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div
              :style="{
                marginTop: '-4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '9px',
              }"
            >
              <button :class="'fobutton'">
                <span :class="'gray-span'">{{
                  $t("plinko_prove_button1")
                }}</span>
              </button>
              <button :class="'fobutton'">
                <span :class="'gray-span'">{{
                  $t("plinko_prove_button2")
                }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal {
  visibility: hidden;
  opacity: 0;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.32);
  transition: all 0.4s;
  z-index: 9;
}
.modal.active {
  visibility: visible;
  opacity: 1;
}
.modal:target {
  visibility: visible;
  opacity: 1;
}
.buttonBox {
  display: flex;
}
.modal__content {
  width: 94vw;
  max-width: 500px;
  border-radius: 8px;
  background: #0f212e;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.16);
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 650px;
}
.rowrisk {
  width: calc(100% - 32px);
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding: 0 16px;
}

.fairness-container {
  width: 100%;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.seed {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.inputBox {
  width: 100%;
  position: relative;
}

.inputBox button {
  position: absolute;
  top: 13px;
  right: 15px;
  background: transparent;
  border: none;
  padding: 0;
}

.seed .input-container:first-child {
  width: 65%;
}
.seed .input-container:not(:first-child) {
  width: 30%;
}
.seed .input-container .inputStyle {
  width: 100%;
  position: relative;
}
.inputStyle {
  width: 100%;
  box-sizing: border-box;
  background: #304554;
  border: 2px solid #304554;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  color: #fff;

  font-weight: 600;
  height: 40px;
  padding: 0 9px;
  appearance: none;
  font-size: 14px;
}
input,
select {
  font-size: 14px;
}
.inputStyle:hover {
  border: 2px solid #557086;
}
.inputStyle:focus {
  border: 2px solid #557086;
  outline: 0;
}
.fobutton {
  background: transparent;
  border: none;
  margin: auto;
}
.expand-button {
  width: calc(100% - 32px);
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 13px;
  padding: 0 16px;
}
.playbutton {
  padding: 12px 18px;
  border: none;
  border-radius: 4px;
  background: #0f212e;
  margin: 16px 0;
  height: 44px;
}
.fairness {
  width: 100%;
  padding: 13px 16px;
  border: none;
  box-sizing: border-box;
  border-radius: 0px 0px 8px 8px;
  background: #0f212e;
}
.fairness span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
}
.forLogo {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  width: calc(100% - 32px);
  padding: 0 16px;
  margin-top: 30px;
}
.forLogo::before {
  content: "";
  background: #2f4553;
  height: 2px;
  flex-grow: 1;
}

.forLogo::after {
  content: "";
  background: #2f4553;
  height: 2px;
  flex-grow: 1;
}
.white-span {
  color: #fff;

  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.gray-span {
  color: #b1bad3;

  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.number-span {
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.84px;
  color: #fff;
}

.modal-title {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  height: 22px;

  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  padding: 0 16px;
  padding-top: 16px;
  background: #1a2c38;
}
.modal-body {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 18px;
  color: #b1bad3;

  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  background: #1a2c38;
}
.id-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}
.inputBox .copy {
  position: absolute;
  top: 0;
  right: 0;
  background: #304554;
  border: none;
  padding: 0;
  width: 46px;
  height: 40px;
  border-radius: 0 4px 4px 0;
  outline: none;
}
.inputBox .copy:hover {
  background: #567086;
}
.inputBox:has(.copy:hover) > input {
  border: 2px solid #557086;
}

.buttonBox .inputStyle {
  border-radius: 4px 0 0 4px;
}
.id-container button {
  border: none;
  background: transparent;
  padding: 0;
}
.state-container {
  border-radius: 4px;
  background: #0f212e;
  display: grid;
  width: calc(100% - 32px);
  justify-content: center;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 20px 0;
  margin-top: 16px;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  height: 43px;
  position: relative;
}

.state span:not(:first-child) {
  display: flex;
  align-items: center;
  gap: 4px;
}

.state:not(:first-child)::before {
  content: "";
  position: absolute;
  background: #213743;
  height: 45px;
  top: 50%;
  right: 100%;
  transform: translate(-50%, -50%);
  width: 2px;
}
.score {
  position: relative;
  width: 100%;
  height: 36px;
  align-items: center;
  justify-content: center;
  display: flex;
  margin-top: 21px;
}
.rect {
  border-radius: 4px;
  width: 48px;
  height: 40px;
  background: #fa223e;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.success {
  color: #17e700;
}
.input-container {
  height: 57px;
}
.input-container .gray-span {
  font-family: Inter;
}
.input-container .inputStyle {
  font-family: Inter;
}
.failed {
  color: #b1bad3;
}
.copy span {
  display: flex;
  justify-content: center;
}
.modal__close {
  color: #585858;
  text-decoration: none;
  background-color: transparent;
  border: none;
  font-size: 14px;
}
.fobutton:hover span {
  color: #fff;
}
@media screen and (max-width: 560px) {
  .state-container {
    grid-template-columns: 1fr;
  }
  .state {
    padding: 0.5em;
    gap: 0;
    height: 34px;
  }
  .state:not(:first-child)::before {
    height: 0;
    width: 0;
  }
  .state:first-child {
    padding-top: 0;
  }
  .state:last-child {
    padding-bottom: 0;
  }
  .copy:hover {
    background: #304554 !important;
  }
}
</style>

<script>
import { ref, computed } from "vue";
import { store, mutations } from "../core/Store";
import { useI18n } from "vue-i18n";


export default {
  computed: {
    cColor() {
      return store.currentColor;
    },
    cShadow() {
      return store.currentShadow;
    },
    cText() {
      return store.currentScore;
    },
    plinkoAmount() {
      return store.plinkoAmount;
    },
    plinkoLevel() {
      const { t } = useI18n();
      if (store.plinkoLevel === "low") {
        return t('plinko_after_bet_pop_up_risk_level_1');
      } else if (store.plinkoLevel === "middle") {
        return t('plinko_after_bet_pop_up_risk_level_2');
      } else if (store.plinkoLevel === "high") {
        return t('plinko_after_bet_pop_up_risk_level_3');
      }
    },
    plinkoRow() {
      return store.plinkoRow;
    },
  },
  methods: {
    closeModal(event) {
      if (event.target.classList.contains("modal")) {
        mutations.currentScore(0, "", "");
      }
    },
  },
  setup() {
    const showFairFlag = ref(false);
    const isHover1 = ref(false);
    const isHover2 = ref(false);
    const isHover3 = ref(false);
    const copy1 = ref("201.213.564.969");
    const copy2 = ref(
      computed(() => {
        return store.active_server_seed_hash;
      })
    );
    const copy3 = ref(
      computed(() => {
        return store.active_client_seed;
      })
    );
    const copy4 = ref(
      computed(() => {
        return store.nonce;
      })
    );
    const copied1 = ref(false);
    const copied2 = ref(false);
    const copied3 = ref(false);
    const copied4 = ref(false);
    const copied5 = ref(false);
    const hideModal = () => {
      mutations.currentScore(0, "", "");
    };
    const showFairness = () => {
      showFairFlag.value = !showFairFlag.value;
      if (showFairFlag.value) {
        mutations.seedDetail();
      }
    };
    const changeHover = (hover, req) => {
      if (window.innerWidth < 560) {
        return;
      }
      if (hover === "isHover1") {
        if (req === "on") {
          isHover1.value = true;
        } else {
          isHover1.value = false;
        }
      } else if (hover === "isHover2") {
        if (req === "on") {
          isHover2.value = true;
        } else {
          isHover2.value = false;
        }
      } else if (hover === "isHover3") {
        if (req === "on") {
          isHover3.value = true;
        } else {
          isHover3.value = false;
        }
      }
    };
    const copyText = (req) => {
      let text = "";
      switch (req) {
        case "copy1":
          text = copy1.value;
          copied1.value = true;
          setTimeout(() => {
            copied1.value = false;
          }, 1000);
          break;
        case "copy2":
          text = copy2.value;
          copied2.value = true;
          setTimeout(() => {
            copied2.value = false;
          }, 1000);
          break;
        case "copy3":
          text = copy3.value;
          copied3.value = true;
          setTimeout(() => {
            copied3.value = false;
          }, 1000);
          break;
        case "copy4":
          text = copy4.value;
          copied4.value = true;
          setTimeout(() => {
            copied4.value = false;
          }, 1000);
          break;
        case "copy5":
          text = copy1.value;
          copied5.value = true;
          setTimeout(() => {
            copied5.value = false;
          }, 1000);
          break;
      }
      navigator.clipboard.writeText(text);
    };
    return {
      showFairFlag,
      isHover1,
      isHover2,
      isHover3,
      hideModal,
      copy1,
      copy2,
      copy3,
      copy4,
      copied1,
      copied2,
      copied3,
      copied4,
      copied5,
      showFairness,
      changeHover,
      copyText,
    };
  },
};
</script>
