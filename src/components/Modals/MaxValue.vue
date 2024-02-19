<template>
  <div :class="['modal', showMaxValueModal ? 'active' : '']" @click="closeModal">
    <div :class="'modal__content'" @click.stop>
      <div :class="'modal-title'">
        <img
          :src="'./image/max-setting.svg'"
          alt="Image"
          width="16"
          height="16"
        />
        <span>{{ $t("plinko_maxvalue") }}</span>
      </div>
      <div :class="'modal-body'">
        <span>{{ showMax ? $t("plinko_maxquestion2") : $t("plinko_maxquestion1") }}</span>
      </div>
      <div :class="'modal__footer'">
        <button :class="'activeButton'" @click="setMaximum">
          <span>{{ showMax ? $t("plinko_turnOff") : $t("plinko_turnOn") }}</span>
        </button>
      </div>
      <button class="modal__close" @click="hideModal">
        <span
          ><img :src="'./image/times.svg'" alt="Image" width="10" height="10"
        /></span>
      </button>
    </div>
  </div>
</template>
<style scoped>
.modal {
  visibility: hidden;
  opacity: 0;
  position: absolute;
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
  height: 100%;
  box-sizing: border-box;
}
.modal.active {
  visibility: visible;
  opacity: 1;
}
.modal:target {
  visibility: visible;
  opacity: 1;
}

.activeButton {
  width: 68px;
  height: 44px;
  flex-shrink: 0;
  border: none;
  border-radius: 4px;
  background: #17e702;
  color: #05080a;

  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.activeButton:hover {
  background-color: #1fff20;
}
.modal__content {
  border-radius: 4px;
  position: relative;
  width: 500px;
  max-width: 94vw;
  background: #1a2c37;
  padding: 16px;
}

.modal-title {
  display: flex;
  gap: 10px;
  align-items: center;
  color: #fff;

  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.modal-body {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  color: #b1bad3;

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.modal__footer {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  color: #585858;
  text-decoration: none;
  background-color: transparent;
  border: none;
  font-size: 14px;
}
</style>

<script>
import { store, mutations } from "../../core/Store";

export default {
  computed: {
    showMax() {
      return store.isMaximum;
    },
    showMaxValueModal() {
      return store.showMaxValueModal;
    },
  },
  methods: {
    closeModal(event) {
      if (event.target.classList.contains('modal')) {
        mutations.showMaxValueModal();
      }
    }
  },
  setup() {
    const hideModal = () => {
      mutations.showMaxValueModal();
    };

    const setMaximum = () => {
      hideModal();
      mutations.showMaximum(!store.isMaximum);
    };
    return {
      hideModal,
      setMaximum,
    };
  },
};
</script>
