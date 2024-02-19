import { reactive } from "vue";
import {ApiGameSeedDetail} from '~/http/api'

export const store = reactive({
  isMaximum: false,
  autoStart: false,
  autoEnd: false,
  hotkey: false,
  showGameInfoModal: false,
  showMaxValueModal: false,
  showHotkeyModal: false,
  showStatistics: false,
  showFairness: false,
  appOpacity: false,
  plinkoAmount: 0.0,
  plinkoRow: 16,
  plinkoLevel: "middle",
  volumn: 50,
  currentScore: 0,
  currentColor: "",
  currentShadow: "",
  active_casino_bets:'',
  active_client_seed: "",
  active_server_seed_hash:"",
  next_server_seed_hash:"",
  seedMateTimes:0,
  nonce: 6,
  showPro: false,
  proText: "",
  proValue: "",
});

export const mutations = {
  showMaximum(value) {
    store.isMaximum = value;
  },
  updateAuto(action) {
    action === "start"
      ? (store.autoStart = !store.autoStart)
      : (store.autoEnd = !store.autoEnd);
    setTimeout(() => {
      action === "start"
        ? (store.autoStart = !store.autoStart)
        : (store.autoEnd = !store.autoEnd);
    }, 2000);
  },
  updateHotkey() {
    store.hotkey = !store.hotkey;
  },
  currentScore(score, color, shadow) {
    store.currentScore = score;
    store.currentColor = color;
    store.currentShadow = shadow;
  },
  showGameInfoModal() {
    store.showGameInfoModal = !store.showGameInfoModal;
  },
  showHotkeyModal() {
    store.showHotkeyModal = !store.showHotkeyModal;
    this.appOpacity();
  },
  showFairness() {
    store.showFairness = !store.showFairness;
  },
  showMaxValueModal() {
    store.showMaxValueModal = !store.showMaxValueModal;
    this.appOpacity();
  },
  showStatistics() {
    store.showStatistics = !store.showStatistics;
    this.appOpacity();
  },
  appOpacity() {
    if (
      store.showGameInfoModal ||
      store.showHotkeyModal ||
      store.showMaxValueModal
    ) {
      store.appOpacity = true;
    } else {
      store.appOpacity = false;
    }
  },
  updatePlinko(amount, rows, level) {
    store.plinkoAmount = amount;
    store.plinkoLevel = level;
    store.plinkoRow = rows;
  },
  changeVolumn(value) {
    store.volumn = value;
  },
  seedDetail() {
    ApiGameSeedDetail().then((res) => {
      store.active_casino_bets = res.active_casino_bets
      store.active_client_seed = res.active_client_seed;
      store.active_server_seed_hash = res.active_server_seed_hash;
      store.next_server_seed_hash = res.next_server_seed_hash;
      store.seedMateTimes = res.nonce;
    })
  },
  changeShowPro(flag, text, pro) {
    if (flag) {
      store.showPro = flag;
      store.proText = text;
      store.proValue = pro;
    } else {
      store.showPro = flag;
      store.proText = "";
      store.proValue = "";
    }
  },
};
