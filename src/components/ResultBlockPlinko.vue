<script setup lang="ts">
import { defineProps, ref, Ref, onMounted, onBeforeUnmount } from "vue";
import { GlobalFunc } from "~/core/GlobalFunc";

interface Props {
  // start from 0
  index: number;
  // result '1.5'
  result: string;
  // risk
  risk: "low" | "middle" | "high";
  // row
  row: "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16";
}

interface ColorInfo {
  color: number;
  shadow: number;
}

const props = defineProps<Props>();
const color: Ref<string> = ref("");
const shadow: Ref<string> = ref("");

const generateScore = () => {
  const info: ColorInfo = GlobalFunc().getColorFromIndexAndRow(props.index, props.row);
  const redc = (info.color >> 16) & 255;
  const greenc = (info.color >> 8) & 255;
  const bluec = info.color & 255;
  const reds = (info.shadow >> 16) & 255;
  const greens = (info.shadow >> 8) & 255;
  const blues = info.shadow & 255;

  color.value = `rgb(${redc}, ${greenc}, ${bluec})`;
  shadow.value = `rgb(${reds}, ${greens}, ${blues})`;
};

onMounted(() => {
  generateScore();
});

onBeforeUnmount(() => {
  color.value = "";
  shadow.value = "";
});

</script>

<template>
  <div
    :class="'score-container'"
    :style="{
      background: color,
      boxShadow: `0px 3px 0px 0px ${shadow}`,
    }"
  >
    <span :class="'score-span'"> {{ result }}x </span>
  </div>
</template>

<style scoped>
.score-container {
  border-radius: 4px;
  width: 48px;
  height: 40px;
  background: #fa223e;
  display: flex;
  align-items: center;
  justify-content: center;
}
.score-span {
  color: #000;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 1;
  padding-bottom: 4px;
}
</style>
