import {assert} from 'chai'

import {ChainDefinition, chainIdsToIndices, ChainNames, Chains} from '$lib'

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
})
