import sinon from 'sinon'
import chai, { expect, assert, should } from 'chai'
import chaiAsPromised from 'chai-as-promised'

process.env.NODE_ENV = 'test'

Object.assign(global, {
    chai,
    expect,
    assert,
    should,
    sinon
})

chai.use(chaiAsPromised)
