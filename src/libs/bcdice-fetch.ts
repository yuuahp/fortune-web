import useSWRMutation from "swr/mutation";
import {useSelector} from "react-redux";
import {RootState} from "@/stores/store";

export const fetcher = (
    url: string,
    {arg}: { arg: string }
) => fetch(`${url}?command=${encodeURIComponent(arg)}`).then(res => res.json())

export function useBCDiceRoll({onSuccess, onBCDiceError, onTypeError, onFetchError, anyway}: {
    onSuccess: (result: BCDiceResult) => void,
    onBCDiceError: (error: BCDiceError) => void,
    onTypeError: () => void,
    onFetchError: () => void,
    anyway?: () => void
}) {
    const base = useSelector((state: RootState) => state.bcdice.base)
    const game = useSelector((state: RootState) => state.bcdice.game)

    const {
        trigger
    } = useSWRMutation<BCDiceResponse>(
        `${base}/v2/game_system/${game}/roll`,
        fetcher, {
            onSuccess: data => {
                if (isBCDiceResult(data)) {
                    onSuccess(data)
                } else if (isBCDiceError(data)) {
                    onBCDiceError(data)
                } else {
                    onTypeError()
                }

                anyway ? anyway() : undefined
            },
            onError: () => {
                onFetchError()

                anyway ? anyway() : undefined
            }
        }
    )

    // @ts-ignore
    const fetchRoll = (command: string) => trigger(command).then()

    return {
        fetchRoll
    }
}

export type BCDiceResponse = {
    ok: boolean;
    reason?: string;
    text?: string;
    secret?: boolean;
    success?: boolean;
    failure?: boolean;
    critical?: boolean;
    fumble?: boolean;
    rands?: {
        kind: string;
        sides: number;
        value: number;
    }[];
}

export type BCDiceResult = {
    ok: true;
    text: string;
    secret: boolean;
    success: boolean;
    failure: boolean;
    critical: boolean;
    fumble: boolean;
    rands: {
        kind: string;
        sides: number;
        value: number;
    }[];
}

export type BCDiceError = {
    ok: false;
    reason: string;
}

export function isBCDiceResult(response: BCDiceResponse): response is BCDiceResult {
    return response.ok
        && typeof response.text === 'string'
        && typeof response.secret === 'boolean'
        && typeof response.success === 'boolean'
        && typeof response.failure === 'boolean'
        && typeof response.critical === 'boolean'
        && typeof response.fumble === 'boolean'
        && Array.isArray(response.rands)
}

export function isBCDiceError(response: BCDiceResponse): response is BCDiceError {
    return !response.ok && typeof response.reason === 'string';
}
