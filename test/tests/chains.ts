import {assert} from 'chai'
import {mockFetch} from '@wharfkit/mock-data'

import {ChainDefinition, chainIdsToIndices, ChainNames, Chains} from '$lib'
import {BaseAPIClient} from '@wharfkit/antelope'

import {APIClient as LeapAPIClient} from '@wharfkit/apiclient-leap'
import {APIClient as WAXAPIClient} from '@wharfkit/apiclient-wax'

suite('chains', function () {
    suite('chainIdsToIndices', function () {
        test('chainIdsToIndices -> ChainDefinitions ', function () {
            for (const [chainId, indice] of chainIdsToIndices) {
                const def = Chains[indice]
                assert.isTrue(def.id.equals(chainId), `${indice}: ${def.id} !== ${chainId}`)
            }
        })
        test('chainIdToIndices -> ChainNames', function () {
            for (const [, indice] of chainIdsToIndices) {
                const name = ChainNames[indice]
                assert.isDefined(name, `Not defined - ${indice}: ${name}`)
            }
        })
    })
    suite('Chains', function () {
        test('valid data', function () {
            for (const [, indice] of chainIdsToIndices) {
                const def = Chains[indice]
                assert.instanceOf(def, ChainDefinition)
                assert.equal(def.name, ChainNames[indice])
            }
        })
    })
    suite('APIClient', function () {
        test('returns instance of base client', function () {
            const client = Chains.EOS.getClient({fetch: mockFetch})
            assert.instanceOf(client, BaseAPIClient)
        })
        test('returns default APIClient', async function () {
            const client = Chains.EOS.getClient({fetch: mockFetch})
            assert.instanceOf(client, LeapAPIClient)
            const account = await client.v1.chain.get_account('teamgreymass')
            if (account.voter_info) {
                // Ensure this field doesn't exist on the results (since its WAX specific)
                assert.isUndefined(account.voter_info['unpaid_voteshare'])
            }
        })
        test('WAX returns custom APIClient', async function () {
            const client = Chains.WAX.getClient({fetch: mockFetch})
            assert.instanceOf(client, WAXAPIClient)
            const account = await client.v1.chain.get_account('teamgreymass')
            if (account.voter_info) {
                // Ensure this field does exist on the results (since this is WAX)
                assert.isDefined(account.voter_info.unpaid_voteshare)
            }
        })
    })
})
