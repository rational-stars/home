<template>
  <div :class="store.backgroundShow ? 'cover show' : 'cover'">
    <video class="bg" :key="bgcUrl" autoplay loop muted playsinline @error="imgLoadError">
      <source :src="bgcUrl" type="video/mp4">
    </video>
    <!-- <img v-show="store.imgLoadStatus" class="bg" alt="cover" :src="bgUrl" @load="imgLoadComplete"
      @error.once="imgLoadError" @animationend="imgAnimationEnd" /> -->
    <div :class="store.backgroundShow ? 'gray hidden' : 'gray'" />
    <Transition name="fade" mode="out-in">
      <a v-if="store.backgroundShow && store.coverType != '3'" class="down" :href="bgUrl" target="_blank">
        下载壁纸
      </a>
    </Transition>
  </div>
</template>

<script setup>
import { mainStore } from "@/store";
import { Error } from "@icon-park/vue-next";
import { getBgcList } from '@/api'



const store = mainStore();
const bgUrl = ref(null);
let bgcUrl = ref('')
const imgTimeout = ref(null);
const emit = defineEmits(["loadComplete"]);
const baseUrl = 'https://yun.rational-stars.top'
const bgcList = ref([])



// 更换壁纸链接
const randomFun = (number) => {
  let historyRandom = Number(localStorage.getItem('historyRandom'))
  const val = Math.floor(Math.random() * number);
  if (val !== historyRandom) return val
  else return randomFun(number)

}
const resetBgc = () => {
  const bgRandom = randomFun(bgcList.value.length)
  localStorage.setItem('historyRandom', bgRandom)
  bgcUrl.value = baseUrl + '/home-wlop-video/' + bgcList.value[bgRandom]?.name

}
const changeBg = async () => {
  const res = await getBgcList()
  bgcList.value = res.files
  if (res.files.length <= 1) {
    return bgcUrl.value = baseUrl + '/home-wlop-video/' + res.files[0].name
  }
  resetBgc()
  imgLoadComplete()
  imgAnimationEnd()
};

// 图片加载完成
const imgLoadComplete = () => {
  imgTimeout.value = setTimeout(
    () => {
      store.setImgLoadStatus(true);
    },
    Math.floor(Math.random() * (600 - 300 + 1)) + 300,
  );
};

// 图片动画完成
const imgAnimationEnd = () => {
  console.log("壁纸加载且动画完成");
  // 加载完成事件
  emit("loadComplete");
};

// 图片显示失败
const imgLoadError = () => {
  console.error("壁纸加载失败：", bgUrl.value);
  ElMessage({
    message: "壁纸加载失败，已临时切换回默认",
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  bgUrl.value = `/images/background${bgRandom}.jpg`;
};

onMounted(() => {
  // 加载壁纸
  changeBg(store.coverType);

  console.log("向前🇨🇳 ====> changeBg:", bgUrl.value)
});

onBeforeUnmount(() => {
  clearTimeout(imgTimeout.value);
});
defineExpose({
  resetBgc,
});

</script>

<style lang="scss" scoped>
.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 0.25s;
  z-index: -1;

  &.show {
    z-index: 1;
  }

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    backface-visibility: hidden;
    filter: blur(20px) brightness(0.3);
    transition:
      filter 0.3s,
      transform 0.3s;
    animation: fade-blur-in 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: 0.45s;
  }

  .gray {
    opacity: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
      radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);

    transition: 1.5s;

    &.hidden {
      opacity: 0;
      transition: 1.5s;
    }
  }

  .down {
    font-size: 16px;
    color: white;
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    padding: 20px 26px;
    border-radius: 8px;
    background-color: #00000030;
    width: 120px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      transform: scale(1.05);
      background-color: #00000060;
    }

    &:active {
      transform: scale(1);
    }
  }
}
</style>