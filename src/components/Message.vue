<template>
  <!-- 基本信息 -->
  <audio src="https://yun.rational-stars.top/audio/%E8%87%B4%E6%A9%A1%E6%A0%91.mp3" autoplay></audio>

  <div class="message">
    <!-- Logo -->
    <div class="logo ">
      <img class="logo-img" @click="playA" @mousemove="playA" @mouseleave="playA(false)" :src="siteLogo" alt="logo" />
      <div :class="{ name: true, 'text-hidden': true, long: siteUrl[0].length >= 6 }">
        <span class="bg">{{ siteUrl[0] }}</span>
        <span class="sm">{{ siteUrl[1] }}</span>
      </div>
    </div>
    <!-- 简介 -->
    <div class="description cards" @click="changeBox">
      <div class="content">
        <Icon size="16">
          <QuoteLeft />
        </Icon>
        <div class="text">
          <p>{{ descriptionText.hello }}</p>
          <p class="typewriter">
            {{ descriptionText.text }}
          </p>
        </div>
        <Icon size="16">
          <QuoteRight />
        </Icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@vicons/utils";
import { QuoteLeft, QuoteRight } from "@vicons/fa";
import { Error } from "@icon-park/vue-next";
import { mainStore } from "@/store";
const store = mainStore();
const playA = (play = true) => {
  const audio = document.querySelector('audio')
  if (play) {
    audio.play()
  } else {
    audio.pause()
  }
}
// 主页站点logo
const siteLogo = import.meta.env.VITE_SITE_MAIN_LOGO;
// 站点链接
const siteUrl = computed(() => {
  const url = import.meta.env.VITE_SITE_URL;
  if (!url) return "imsyy.top".split(".");
  // 判断协议前缀
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const urlFormat = url.replace(/^(https?:\/\/)/, "");
    return urlFormat.split(".");
  }
  return url.split(".");
});

// 简介区域文字
const descriptionText = reactive({
  hello: import.meta.env.VITE_DESC_HELLO,
  text: import.meta.env.VITE_DESC_TEXT,
});

// 切换右侧功能区
const changeBox = () => {
  if (store.getInnerWidth >= 990) {
    store.boxOpenState = !store.boxOpenState;
  } else {
    ElMessage({
      message: "当前页面宽度不足以开启盒子",
      grouping: true,
      icon: h(Error, {
        theme: "filled",
        fill: "#efefef",
      }),
    });
  }
};

// 监听状态变化
watch(
  () => store.boxOpenState,
  (value) => {
    if (value) {
      descriptionText.hello = import.meta.env.VITE_DESC_HELLO_OTHER;
      descriptionText.text = import.meta.env.VITE_DESC_TEXT_OTHER;
    } else {
      descriptionText.hello = import.meta.env.VITE_DESC_HELLO;
      descriptionText.text = import.meta.env.VITE_DESC_TEXT;
    }
  },
);
</script>

<style lang="scss" scoped>
// .pause {
//   animation-play-state: paused;
// }

// .play-rotate {
//   animation-play-state: running;
// }

@keyframes rotate {
  0% {

    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.message {
  .logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    animation: fade 0.5s;

    .logo-img {
      border-radius: 50%;
      width: 120px;
      // transition: transform 5s;

      &:hover {
        transform: scale(1.2);
        animation: rotate 2.5s linear infinite;
      }
    }

    .name {
      width: calc(460px - 120px);
      padding-left: 22px;
      transform: translateY(-8px);
      font-family: "Pacifico-Regular";

      .bg {
        font-size: 5rem;
      }

      .sm {
        margin-left: 6px;
        font-size: 2rem;

        @media (min-width: 720px) and (max-width: 789px) {
          display: none;
        }
      }
    }

    @media (max-width: 768px) {
      .logo-img {
        width: 100px;
      }

      .name {
        height: 128px;

        .bg {
          font-size: 4.5rem;
        }
      }
    }
  }

  .description {
    padding: 1rem;
    margin-top: 3.5rem;
    max-width: 460px;
    animation: fade 0.5s;

    .content {
      display: flex;
      justify-content: space-between;

      .text {
        margin: 0.75rem 1rem;
        line-height: 2rem;
        margin-right: auto;

        p {
          &:nth-of-type(1) {
            font-family: "Pacifico-Regular";
          }
        }
      }

      .xicon:nth-of-type(2) {
        align-self: flex-end;
      }
    }

    @media (max-width: 720px) {
      max-width: 100%;
      pointer-events: none;
    }
  }

  @media (max-width: 390px) {
    .logo {
      flex-direction: column;

      .logo-img {
        display: none;
      }

      .name {
        margin-left: 0;
        height: auto;
        transform: none;
        text-align: center;

        .bg {
          font-size: 3.5rem;
        }

        .sm {
          font-size: 1.4rem;
        }
      }
    }

    .description {
      margin-top: 2.5rem;
    }
  }
}

.typewriter {
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  animation: typing 5s steps(100, start) infinite;
  /* 文字逐个出现 */
}

/* 打字动画 */
@keyframes typing {
  from {
    width: 0;
  }

  to {
    width: 130%;
  }
}
</style>
