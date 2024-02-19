import {httpClient} from './index'

export function ApiGameBetting(data:{
    line: string
    amount: string
    risk: string
    currency_id: string
}){
    return httpClient.post<{
        id: string;
        active: boolean;
        payout_multiplier: string;
        amount_multiplier: string;
        amount: string;
        payout: string;
        updated_at: number;
        currency: string;
        game: string;
        uid: string;
        name: string;
        state: {
            risk: string;
            rows: string;
            point: string;
            index: number;
            result: string;
            path: string[];
        };
    }>('/game/original/plinko',data)
}

export function ApiMemberBalance(){
    return httpClient.get<{
        [t:string]:string
        uid: string;
        site_id: string;
        bRL: string;
        cNY: string;
        iNR: string;
        vND: string;
        tHB: string;
        uSDT: string;
        bTC: string;
        eTH: string;
        bNB: string;
        eUR: string;
        jPY: string;
        cAD: string;
        aRS: string;
        cLP: string;
        pEN: string;
        mXN: string;
        lTC: string;
        dOGE: string;
        bCH: string;
        xRP: string;
        eOS: string;
        tRX: string;
        uSDC: string;
        aPE: string;
        bUSD: string;
        cRO: string;
        dAI: string;
        lINK: string;
        sAND: string;
        sHIB: string;
        uNI: string;
        mATIC: string;
    }>('/member/balance')
}


export function ApiGameSeedDetail(){
  return httpClient.get<{
    active_casino_bets:string
    active_client_seed: string;
    active_server_seed_hash: string;
    next_server_seed_hash: string;
    nonce: number;
  }>('/game/original/seed/detail')
}
