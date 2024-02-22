import { defineStore, acceptHMRUpdate } from 'pinia'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import { ApiMemberBalance } from '~/http/api'



export const useAppStore = defineStore('app', () => {
    const token = ref(window.miniGameWujie.props.token)
    const isLogin =  computed(()=> !!token.value)
    // const currency = ref(window.miniGameWujie.props.currency)
    const currency_id = ref(window.miniGameWujie.props.currencyId)
    const staticDomain = ref(window.miniGameWujie.props.staticDomain)
    const logoUrl = ref(window.miniGameWujie.props.logoUrl)
    const currentBalance = ref(window.miniGameWujie.props.balance)
    const rate = ref(window.miniGameWujie.props.rate)
    const currencyPrefix = ref(window.miniGameWujie.props.currencyPrefix)
    const decimalNum = ref(window.miniGameWujie.props.decimalNum)

    const logoSrc = computed(()=> staticDomain.value + '/' + logoUrl.value )

    // const { data: balanceData, run: runGetBalance, loading: balanceLoading } = useRequest(ApiMemberBalance,{
    //     ready:isLogin
    // })


    function changeCurrencyId(v: string) {
        currency_id.value = v
    }
    function changeCurrentBalance(v:string){
      currentBalance.value = v
    }
    function changeToken(v:string){
      token.value = v
    }
    function changeRate(v:string){
      rate.value = v
    }
    function changeCurrencyPrefix(v:string){
      currencyPrefix.value = v
    }
    function changeDecimalNum(v:number){
      decimalNum.value = v
    }
    function changeLogoUrl(v:string){
      logoUrl.value = v
    }

    return {
        token,
        currency_id,
        currentBalance,
        logoSrc,
        logoUrl,
        rate,
        currencyPrefix,
        isLogin,
        decimalNum,
        changeLogoUrl,
        changeCurrencyId,
        changeCurrentBalance,
        changeToken,
        changeRate,
        changeCurrencyPrefix,
        changeDecimalNum
    }
})

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
