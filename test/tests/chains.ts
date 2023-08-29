import {assert} from 'chai'
import {
    mockFetch,
    mockSessionKitArgs,
    mockSessionKitOptions,
    MockUserInterface,
} from '@wharfkit/mock-data'

import {ChainDefinition, ChainDefinitionType, chainIdsToIndices, Chains, getChainClient} from '$lib'
import {BaseAPIClient} from '@wharfkit/antelope'

import {APIClient as LeapAPIClient} from '@wharfkit/apiclient-leap'
import {APIClient as TelosAPIClient} from '@wharfkit/apiclient-telos'
import {APIClient as WAXAPIClient} from '@wharfkit/apiclient-wax'
import {SessionKit} from '@wharfkit/session'

suite('chains', function () {
    suite('chainIdsToIndices', function () {
        test('chainIdsToIndices -> ChainDefinitions ', function () {
            for (const [chainId, indice] of chainIdsToIndices) {
                const def = Chains[indice]
                assert.isTrue(def.id.equals(chainId), `${indice}: ${def.id} !== ${chainId}`)
            }
        })
    })
    suite('Chains', function () {
        test('valid data', function () {
            for (const [, indice] of chainIdsToIndices) {
                const def = Chains[indice]
                assert.instanceOf(def, ChainDefinition)
            }
        })
    })
    suite('getChainClient', function () {
        test('returns instance of leap client', async function () {
            const client = getChainClient(Chains.EOS.id, {
                url: 'https://eos.greymass.com',
                fetch: mockFetch,
            })
            assert.instanceOf(client, BaseAPIClient)
            assert.instanceOf(client, LeapAPIClient)
            assert.notInstanceOf(client, TelosAPIClient)
            assert.notInstanceOf(client, WAXAPIClient)
            const account = await client.v1.chain.get_account('teamgreymass')
            if (account.voter_info) {
                // Ensure this field doesn't exist on the results (since its WAX specific)
                assert.isUndefined(account.voter_info['unpaid_voteshare'])
                // Ensure this field doesn't exist on the results (since its Telos specific)
                assert.isUndefined(account.voter_info['last_stake'])
            }
        })
        test('returns instance of leap client using generics', async function () {
            const client = getChainClient<'EOS'>(Chains.EOS.id, {
                url: 'https://eos.greymass.com',
                fetch: mockFetch,
            })
            assert.instanceOf(client, BaseAPIClient)
            assert.instanceOf(client, LeapAPIClient)
            assert.notInstanceOf(client, TelosAPIClient)
            assert.notInstanceOf(client, WAXAPIClient)
            const account = await client.v1.chain.get_account('teamgreymass')
            if (account.voter_info) {
                // Ensure this field doesn't exist on the results (since its WAX specific)
                assert.isUndefined(account.voter_info['unpaid_voteshare'])
                // Ensure this field doesn't exist on the results (since its Telos specific)
                assert.isUndefined(account.voter_info['last_stake'])
            }
        })
        test('returns instance of wax client', async function () {
            const client = getChainClient(Chains.WAX.id, {
                url: 'https://wax.greymass.com',
                fetch: mockFetch,
            })
            assert.instanceOf(client, BaseAPIClient)
            assert.instanceOf(client, LeapAPIClient)
            assert.notInstanceOf(client, TelosAPIClient)
            assert.instanceOf(client, WAXAPIClient)
            const account = await client.v1.chain.get_account('teamgreymass')
            if (account.voter_info) {
                // Ensure this field does exist on the results (since this is WAX)
                assert.isDefined(account.voter_info['unpaid_voteshare'])
                // Ensure this field doesn't exist on the results (since its Telos specific)
                assert.isUndefined(account.voter_info['last_stake'])
            }
        })
        test('returns instance of wax client using generics', async function () {
            const client = getChainClient<'WAX'>(Chains.WAX.id, {
                url: 'https://wax.greymass.com',
                fetch: mockFetch,
            })
            assert.instanceOf(client, BaseAPIClient)
            assert.instanceOf(client, LeapAPIClient)
            assert.notInstanceOf(client, TelosAPIClient)
            assert.instanceOf(client, WAXAPIClient)
            const account = await client.v1.chain.get_account('teamgreymass')
            if (account.voter_info) {
                // Ensure this field does exist on the results (since this is WAX)
                assert.isDefined(account.voter_info.unpaid_voteshare)
                // Ensure this field doesn't exist on the results (since its Telos specific)
                assert.isUndefined(account.voter_info['last_stake'])
            }
        })
        test('returns instance of telos client', async function () {
            const client = getChainClient(Chains.Telos.id, {
                url: 'https://telos.greymass.com',
                fetch: mockFetch,
            })
            assert.instanceOf(client, BaseAPIClient)
            assert.instanceOf(client, LeapAPIClient)
            assert.instanceOf(client, TelosAPIClient)
            assert.notInstanceOf(client, WAXAPIClient)
            const account = await client.v1.chain.get_account('teamgreymass')
            if (account.voter_info) {
                // Ensure this field does exist on the results (since this is Telos)
                assert.isDefined(account.voter_info['last_stake'])
                // Ensure this field doesn't exist on the results (since its WAX specific)
                assert.isUndefined(account.voter_info['unpaid_voteshare'])
            }
        })
        test('returns instance of telos client using generics', async function () {
            const client = getChainClient<'Telos'>(Chains.Telos.id, {
                url: 'https://telos.greymass.com',
                fetch: mockFetch,
            })
            assert.instanceOf(client, BaseAPIClient)
            assert.instanceOf(client, LeapAPIClient)
            assert.instanceOf(client, TelosAPIClient)
            assert.notInstanceOf(client, WAXAPIClient)
            const account = await client.v1.chain.get_account('teamgreymass')
            if (account.voter_info) {
                // Ensure this field does exist on the results (since this is Telos)
                assert.isDefined(account.voter_info.last_stake)
                // Ensure this field doesn't exist on the results (since its WAX specific)
                assert.isUndefined(account.voter_info['unpaid_voteshare'])
            }
        })
    })
    suite('chains constant w/ built-in generics', function () {
        test('returns default instance of leap client', async function () {
            // Using the `Chains` constant, the generics are predefined so the developer doesn't need to define them
            const client = Chains.EOS.getClient({fetch: mockFetch})
            const account = await client.v1.chain.get_account('teamgreymass')
            if (account.voter_info) {
                // Ensure neither of these fields exist since they are not part of the Leap implementation
                assert.isUndefined(account.voter_info['unpaid_voteshare'])
                assert.isUndefined(account.voter_info['last_stake'])
            }
        })
        test('returns instance of wax client', async function () {
            // Using the `Chains` constant, the generics are predefined so the developer doesn't need to define them
            const client = Chains.WAX.getClient({fetch: mockFetch})
            const account = await client.v1.chain.get_account('teamgreymass')
            if (account.voter_info) {
                // The `voter_info` contains `unpaid_voteshare` for WAX and Typescript won't error
                assert.isDefined(account.voter_info.unpaid_voteshare)
            }
        })
        test('returns instance of telos client', async function () {
            // Using the `Chains` constant, the generics are predefined so the developer doesn't need to define them
            const client = Chains.Telos.getClient({fetch: mockFetch})
            const account = await client.v1.chain.get_account('teamgreymass')
            if (account.voter_info) {
                // The `voter_info` contains `last_stake` for Telos and Typescript won't error
                assert.isDefined(account.voter_info.last_stake)
            }
        })
    })
    suite('api types from session kit', function () {
        test('can handle `Chains` definitions', async function () {
            // The `Chains` const has WAX defined as a `ChainDefinition<'WAX'>` instance
            const def1 = Chains.WAX
            const client1 = def1.getClient({fetch: mockFetch})
            // Should be WAXAPIClient instance
            const result1 = await client1.v1.chain.get_account('teamgreymass')
            // Result will be WAXAccountObject from the WAXAPIClient

            console.log(result1)

            // Setup a SessionKit and pass in the generic `ChainDefintion<'WAX'>`
            const kit = new SessionKit(
                {
                    ...mockSessionKitArgs,
                    chains: [Chains.WAX],
                },
                mockSessionKitOptions
            )

            // Get it back from the Kit
            const defInKit = kit.chains[0]
            // Result should be a `ChainDefinition<'WAX'>` instance, but is a `ChainDefinition` instance
            // Without using generics on the `SessionKit` itself, I don't think we can return a generically typed `ChainDefinition`
            // ????

            console.log(defInKit)

            // The kit.getChainDefinition() returns whatever was passed above
            const def2 = kit.getChainDefinition(Chains.WAX.id)
            const client2 = def2.getClient({fetch: mockFetch})
            // Should be WAXAPIClient instance
            const result2 = await client2.v1.chain.get_account('teamgreymass')
            // Should be WAXAccountObject from the WAXAPIClient
            console.log(result2)

            // const test2 = def.getClient({fetch: mockFetch})
            // console.log(test2)
        })
    })
})
