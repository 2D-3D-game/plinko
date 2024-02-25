/**
 * This configuration is for local development use
 *
 * When packaged online, the corresponding content will be replaced.
 *
 * In the onMounted event of App.vue,
 * the currentGlobalCurrencyBalance event can obtain the latest balance.
 * If the balance is received, it will overwrite the local balance.
 * If the balance is insufficient, it will prompt that the betting information cannot be
 */

export function initWujie() {
  window.miniGameWujie = window.$wujie ? window.$wujie : {
    props: {
      "staticDomain": "https://d2utx4nptvgikt.cloudfront.net",
      "logoUrl": "brand/1706678673680.webp",
      "currencyId": "702",
      "currency": "BRL",
      "lang": "en-US", // en-US
      "backendLang": "zh_CN", // en_US
      /** balance is the currency balance currently selected by the user */
      "balance": "0.00",
      /** token is used to determine whether to log in */
      "token": "t:igAiFj5N4Exrd0bD9dpZeJdA",
      "getBalanceData": () => { },
      "openNotify": () => { },
      /** 汇率 */
      rate: '1',
      /** 货币符号 */
      currencyPrefix: '***',
      decimalNum: 2
    },
    "bus": {
      "$on": () => { },
      "$emit": () => { },
      "$off": () => { }
    }
  }
}

