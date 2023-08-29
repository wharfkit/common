import {APIClientOptions, Checksum256, Checksum256Type, Struct} from '@wharfkit/antelope'

import {APIClient as LeapAPIClient} from '@wharfkit/apiclient-leap'
import {APIClient as TelosAPIClient} from '@wharfkit/apiclient-telos'
import {APIClient as WAXAPIClient} from '@wharfkit/apiclient-wax'

import {ExplorerDefinition} from './explorer'
import {Logo} from './logo'

import type {ExplorerDefinitionType, LogoType} from './types'

/**
 * A list of string-based chain names to assist autocompletion
 */
export type ChainKeys =
    | 'Antelope'
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
 * A list of chain IDs and their ChainIndices for reference lookups
 */
export const chainIdsToIndices: Map<Checksum256Type, ChainKeys> = new Map([
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
 * APIClient class instances used for each Chain
 */
const ChainClients: Record<ChainKeys, typeof LeapAPIClient> = {
    // Generic Leap clients
    Antelope: LeapAPIClient,
    EOS: LeapAPIClient,
    FIO: LeapAPIClient,
    FIOTestnet: LeapAPIClient,
    Jungle4: LeapAPIClient,
    KylinTestnet: LeapAPIClient,
    Libre: LeapAPIClient,
    LibreTestnet: LeapAPIClient,
    Proton: LeapAPIClient,
    ProtonTestnet: LeapAPIClient,
    UX: LeapAPIClient,
    // Telos clients
    Telos: TelosAPIClient,
    TelosTestnet: TelosAPIClient,
    // WAX clients
    WAX: WAXAPIClient,
    WAXTestnet: WAXAPIClient,
}

/**
 * Type mapping for APIClient classes by Chain
 */
export type ClientType<T> =
    // Override WAX
    T extends 'WAX'
        ? WAXAPIClient
        : // Override WAX Testnet
        T extends 'WAXTestnet'
        ? WAXAPIClient
        : // Override Telos
        T extends 'Telos'
        ? TelosAPIClient
        : // Override Telos Testnet
        T extends 'TelosTestnet'
        ? TelosAPIClient
        : // Default to Leap
          LeapAPIClient

/**
 * Method to return a specific chain client given an ID
 */
export function getChainClient<ChainName extends ChainKeys = 'Antelope'>(
    id: Checksum256Type,
    options: APIClientOptions
): ClientType<ChainName> {
    // Determine if we have a custom client for this chain
    const indice = chainIdsToIndices.get(String(id))
    if (indice) {
        return new ChainClients[indice](options) as ClientType<ChainName>
    }
    // Return generic APIClient when unknown blockchain
    return new LeapAPIClient(options) as ClientType<ChainName>
}

/**
 * A definition that defines the connection information and metadata for a specific chain
 */
@Struct.type('chain_definition')
export class ChainDefinition<ChainName extends ChainKeys = 'Antelope'> extends Struct {
    /**
     * The chain ID.
     */
    @Struct.field('checksum256') declare id: Checksum256

    /**
     * The base URL of the chain's API endpoint (e.g. https://jungle4.greymass.com).
     */
    @Struct.field('string') declare url: string

    /**
     * The human readable name for the chain
     */
    @Struct.field('string', {optional: true}) declare name: string

    /**
     * The absolute URL(s) to the chain's logo.
     */
    @Struct.field(Logo, {optional: true}) declare logo?: LogoType

    /**
     * The explorer definition for the chain.
     */
    @Struct.field(ExplorerDefinition, {optional: true}) declare explorer?: ExplorerDefinitionType

    static from<ChainName extends ChainKeys = 'Antelope'>(data) {
        const detected = chainIdsToIndices.get(String(data.id))
        if (detected) {
            const clientType = ChainClients[detected]
            if (clientType) {
                return super.from({
                    ...data,
                    explorer: data.explorer ? ExplorerDefinition.from(data.explorer) : undefined,
                    logo: data.logo ? Logo.from(data.logo) : undefined,
                }) as ChainDefinition<ChainName>
            }
        }
        return super.from({
            ...data,
            explorer: data.explorer ? ExplorerDefinition.from(data.explorer) : undefined,
            logo: data.logo ? Logo.from(data.logo) : undefined,
        }) as ChainDefinition<ChainName>
    }

    public getLogo(): Logo | undefined {
        if (this.logo) {
            return Logo.from(this.logo)
        }
        return undefined
    }

    public getClient(options?: APIClientOptions) {
        // Create options that default to URL defined in ChainDefinition
        const opts = {
            url: this.url,
            ...options,
        }
        return getChainClient<ChainName>(this.id, opts)
    }
}

/**
 * An exported list of known ChainDefinition entries for immediate use.
 */
export const Chains = {
    EOS: ChainDefinition.from<'EOS'>({
        id: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        url: 'https://eos.greymass.com',
        name: 'EOS',
        logo: 'https://assets.wharfkit.com/chain/eos.png',
        explorer: {
            prefix: 'https://bloks.io/transaction/',
            suffix: '',
        },
    }),
    FIO: ChainDefinition.from<'FIO'>({
        id: '21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c',
        url: 'https://fio.greymass.com',
        name: 'FIO',
        logo: 'https://assets.wharfkit.com/chain/fio.png',
        explorer: {
            prefix: 'https://fio.bloks.io/transaction/',
            suffix: '',
        },
    }),
    FIOTestnet: ChainDefinition.from<'FIOTestnet'>({
        id: 'b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e',
        url: 'https://fiotestnet.greymass.com',
        name: 'FIO (Testnet)',
        logo: 'https://assets.wharfkit.com/chain/fio.png',
        explorer: {
            prefix: 'https://fio-test.bloks.io/transaction/',
            suffix: '',
        },
    }),
    Jungle4: ChainDefinition.from<'Jungle4'>({
        id: '73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d',
        url: 'https://jungle4.greymass.com',
        name: 'Jungle 4 (Testnet)',
        logo: 'https://assets.wharfkit.com/chain/jungle.png',
    }),
    KylinTestnet: ChainDefinition.from<'KylinTestnet'>({
        id: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
        url: 'https://api.kylin.alohaeos.com',
        name: 'Kylin (Testnet)',
    }),
    Libre: ChainDefinition.from<'Libre'>({
        id: '38b1d7815474d0c60683ecbea321d723e83f5da6ae5f1c1f9fecc69d9ba96465',
        url: 'https://libre.greymass.com',
        name: 'Libre',
        logo: 'https://assets.wharfkit.com/chain/libre.png',
        explorer: {
            prefix: 'https://www.libreblocks.io/tx/',
            suffix: '',
        },
    }),
    LibreTestnet: ChainDefinition.from<'LibreTestnet'>({
        id: 'b64646740308df2ee06c6b72f34c0f7fa066d940e831f752db2006fcc2b78dee',
        url: 'https://libretestnet.greymass.com',
        name: 'Libre (Testnet)',
        logo: 'https://assets.wharfkit.com/chain/libre.png',
    }),
    Proton: ChainDefinition.from<'Proton'>({
        id: '384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0',
        url: 'https://proton.greymass.com',
        name: 'Proton',
        logo: 'https://assets.wharfkit.com/chain/proton.png',
        explorer: {
            prefix: 'https://www.protonscan.io/transaction/',
            suffix: '',
        },
    }),
    ProtonTestnet: ChainDefinition.from<'ProtonTestnet'>({
        id: '71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd',
        url: 'https://proton-testnet.greymass.com',
        name: 'Proton (Testnet)',
        logo: 'https://assets.wharfkit.com/chain/proton.png',
    }),
    Telos: ChainDefinition.from<'Telos'>({
        id: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
        url: 'https://telos.greymass.com',
        name: 'Telos',
        logo: 'https://assets.wharfkit.com/chain/telos.png',
        explorer: {
            prefix: 'https://explorer.telos.net/transaction/',
            suffix: '',
        },
    }),
    TelosTestnet: ChainDefinition.from<'TelosTestnet'>({
        id: '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
        url: 'https://telos.greymass.com',
        name: 'Telos (Testnet)',
        logo: 'https://assets.wharfkit.com/chain/telos.png',
    }),
    WAX: ChainDefinition.from<'WAX'>({
        id: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
        url: 'https://wax.greymass.com',
        name: 'WAX',
        logo: 'https://assets.wharfkit.com/chain/wax.png',
        explorer: {
            prefix: 'https://waxblock.io/transaction/',
            suffix: '',
        },
    }),
    WAXTestnet: ChainDefinition.from<'WAXTestnet'>({
        id: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
        url: 'https://waxtestnet.greymass.com',
        name: 'WAX (Testnet)',
        logo: 'https://assets.wharfkit.com/chain/wax.png',
    }),
    UX: ChainDefinition.from<'UX'>({
        id: '8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02',
        url: 'https://api.uxnetwork.io',
        name: 'UX Network',
        logo: 'https://assets.wharfkit.com/chain/ux.png',
        explorer: {
            prefix: 'https://explorer.uxnetwork.io/tx/',
            suffix: '',
        },
    }),
}
