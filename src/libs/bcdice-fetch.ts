export const fetcher = (
    url: string,
    {arg}: { arg: string }
) => fetch(`${url}?command=${encodeURIComponent(arg)}`).then(res => res.json())

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