import {Checksum256, Checksum256Type, Struct} from '@wharfkit/antelope'

import {ExplorerDefinition} from './explorer'
import {Logo} from './logo'

import type {ExplorerDefinitionType, LogoType} from './types'

/**
 * The information required to interact with a given chain.
 */
@Struct.type('chain_definition')
export class ChainDefinition extends Struct {
    /**
     * The chain ID.
     */
    @Struct.field('checksum256') declare id: Checksum256

    /**
     * The base URL of the chain's API endpoint (e.g. https://jungle4.greymass.com).
     */
    @Struct.field('string') declare url: string

    /**
     * The absolute URL(s) to the chain's logo.
     */
    @Struct.field(Logo, {optional: true}) declare logo?: LogoType

    /**
     * The explorer definition for the chain.
     */
    @Struct.field(ExplorerDefinition, {optional: true}) declare explorer?: ExplorerDefinitionType

    static from(data) {
        return super.from({
            ...data,
            explorer: data.explorer ? ExplorerDefinition.from(data.explorer) : undefined,
            logo: data.logo ? Logo.from(data.logo) : undefined,
        }) as ChainDefinition
    }

    get name() {
        const indice = chainIdsToIndices.get(String(this.id))
        if (!indice) {
            return 'Unknown blockchain'
        }
        return ChainNames[indice]
    }

    public getLogo(): Logo | undefined {
        const id = String(this.id)
        if (this.logo) {
            return Logo.from(this.logo)
        }
        if (chainLogos.has(id)) {
            const logo = chainLogos.get(id)
            if (logo) {
                return Logo.from(logo)
            }
        }
        return undefined
    }
}

/**
 * A list of string-based chain names to assist autocompletion
 */
export type ChainIndices =
    | 'EOS'
    | 'FIO'
    | 'FIOTestnet'
    | 'Jungle4'
    | 'KylinTestnet'
    | 'Libre'
    | 'LibreTestnet'
    | 'Proton'
    | 'ProtonTestnet'
    | 'Telos'
    | 'TelosTestnet'
    | 'WAX'
    | 'WAXTestnet'
    | 'UX'

/**
 * List of human readable chain names based on the ChainIndices type.
 */
export const ChainNames: Record<ChainIndices, string> = {
    EOS: 'EOS',
    FIO: 'FIO',
    FIOTestnet: 'FIO (Testnet)',
    Jungle4: 'Jungle 4 (Testnet)',
    KylinTestnet: 'Kylin (Testnet)',
    Libre: 'Libre',
    LibreTestnet: 'Libre (Testnet)',
    Proton: 'Proton',
    ProtonTestnet: 'Proton (Testnet)',
    Telos: 'Telos',
    TelosTestnet: 'Telos (Testnet)',
    WAX: 'WAX',
    WAXTestnet: 'WAX (Testnet)',
    UX: 'UX Network',
}

/**
 * An exported list of ChainDefinition entries for select chains.
 */
export const Chains: Record<ChainIndices, ChainDefinition> = {
    EOS: ChainDefinition.from({
        id: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        url: 'https://eos.greymass.com',
        explorer: {
            prefix: 'https://bloks.io/transaction/',
            suffix: '',
        },
    }),
    FIO: ChainDefinition.from({
        id: '21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c',
        url: 'https://fio.greymass.com',
        explorer: {
            prefix: 'https://fio.bloks.io/transaction/',
            suffix: '',
        },
    }),
    FIOTestnet: ChainDefinition.from({
        id: 'b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e',
        url: 'https://fiotestnet.greymass.com',
        explorer: {
            prefix: 'https://fio-test.bloks.io/transaction/',
            suffix: '',
        },
    }),
    Jungle4: ChainDefinition.from({
        id: '73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d',
        url: 'https://jungle4.greymass.com',
    }),
    KylinTestnet: ChainDefinition.from({
        id: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
        url: 'https://api.kylin.alohaeos.com',
    }),
    Libre: ChainDefinition.from({
        id: '38b1d7815474d0c60683ecbea321d723e83f5da6ae5f1c1f9fecc69d9ba96465',
        url: 'https://libre.greymass.com',
        explorer: {
            prefix: 'https://www.libreblocks.io/tx/',
            suffix: '',
        },
    }),
    LibreTestnet: ChainDefinition.from({
        id: 'b64646740308df2ee06c6b72f34c0f7fa066d940e831f752db2006fcc2b78dee',
        url: 'https://libretestnet.greymass.com',
    }),
    Proton: ChainDefinition.from({
        id: '384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0',
        url: 'https://proton.greymass.com',
        explorer: {
            prefix: 'https://www.protonscan.io/transaction/',
            suffix: '',
        },
    }),
    ProtonTestnet: ChainDefinition.from({
        id: '71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd',
        url: 'https://proton-testnet.greymass.com',
    }),
    Telos: ChainDefinition.from({
        id: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
        url: 'https://telos.greymass.com',
        explorer: {
            prefix: 'https://explorer.telos.net/transaction/',
            suffix: '',
        },
    }),
    TelosTestnet: ChainDefinition.from({
        id: '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
        url: 'https://telostestnet.greymass.com',
    }),
    WAX: ChainDefinition.from({
        id: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
        url: 'https://wax.greymass.com',
        explorer: {
            prefix: 'https://waxblock.io/transaction/',
            suffix: '',
        },
    }),
    WAXTestnet: ChainDefinition.from({
        id: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
        url: 'https://waxtestnet.greymass.com',
    }),
    UX: ChainDefinition.from({
        id: '8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02',
        url: 'https://api.uxnetwork.io',
        explorer: {
            prefix: 'https://explorer.uxnetwork.io/tx/',
            suffix: '',
        },
    }),
}

/**
 * A list of chain IDs and their ChainIndices for reference lookups
 */
export const chainIdsToIndices: Map<Checksum256Type, ChainIndices> = new Map([
    ['aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', 'EOS'],
    ['21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c', 'FIO'],
    ['b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e', 'FIOTestnet'],
    ['73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d', 'Jungle4'],
    ['5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191', 'KylinTestnet'],
    ['38b1d7815474d0c60683ecbea321d723e83f5da6ae5f1c1f9fecc69d9ba96465', 'Libre'],
    ['b64646740308df2ee06c6b72f34c0f7fa066d940e831f752db2006fcc2b78dee', 'LibreTestnet'],
    ['384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0', 'Proton'],
    ['71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd', 'ProtonTestnet'],
    ['4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11', 'Telos'],
    ['1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f', 'TelosTestnet'],
    ['8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02', 'UX'],
    ['1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4', 'WAX'],
    ['f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12', 'WAXTestnet'],
])

/**
 * A list of known chain IDs and their logos.
 */
export const chainLogos: Map<Checksum256Type, LogoType> = new Map([
    [
        'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        'https://assets.wharfkit.com/chain/eos.png',
    ],
    [
        '21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c',
        'https://assets.wharfkit.com/chain/fio.png',
    ],
    [
        'b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e',
        'https://assets.wharfkit.com/chain/fio.png',
    ],
    [
        '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
        'https://assets.wharfkit.com/chain/jungle.png',
    ],
    [
        '73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d',
        'https://assets.wharfkit.com/chain/jungle.png',
    ],
    [
        '38b1d7815474d0c60683ecbea321d723e83f5da6ae5f1c1f9fecc69d9ba96465',
        'https://assets.wharfkit.com/chain/libre.png',
    ],
    [
        'b64646740308df2ee06c6b72f34c0f7fa066d940e831f752db2006fcc2b78dee',
        'https://assets.wharfkit.com/chain/libre.png',
    ],
    [
        '384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0',
        'https://assets.wharfkit.com/chain/proton.png',
    ],
    [
        '71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd',
        'https://assets.wharfkit.com/chain/proton.png',
    ],
    [
        '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
        'https://assets.wharfkit.com/chain/telos.png',
    ],
    [
        '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
        'https://assets.wharfkit.com/chain/telos.png',
    ],
    [
        '8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02',
        'https://assets.wharfkit.com/chain/ux.png',
    ],
    [
        '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
        'https://assets.wharfkit.com/chain/wax.png',
    ],
    [
        'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
        'https://assets.wharfkit.com/chain/wax.png',
    ],
])
