import React from 'react'
import { shallow, mount } from 'enzyme'
import { Search } from './Search'

jest.useFakeTimers();

const createTestData = () => ([
  {
    key: "5397076989446422",
    offset: 21489934,
    partition: 0,
    timestamp: 1561968263681,
    topic: "cc_payments",
    value: '{"id":"txn1561968263681","time":"2019-07-01T08:04:23.681Z","amount":2682.92,"currency":"USD","creditCardId":"5397076989446422","merchantId":40}'
  },
  {
    key: "5373595752176476",
    offset: 21489935,
    partition: 0,
    timestamp: 1561968263881,
    topic: "cc_payments",
    value: '{"id":"txn1561968263881","time":"2019-07-01T08:04:23.881Z","amount":4469.6,"currency":"EUR","creditCardId":"5373595752176476","merchantId":72}'
  },
  {
    key: "5524874546065610",
    offset: 21489936,
    partition: 0,
    timestamp: 1561968264082,
    topic: "cc_payments",
    value: '{"id":"txn1561968264082","time":"2019-07-01T08:04:24.082Z","amount":3739.19,"currency":"EUR","creditCardId":"5524874546065610","merchantId":63}'
  }
])

const setupElements = comp => ({

  inputSearchQuery: () => comp.find('[name="searchQuery"]'),
  buttonSearchNext: () => comp.find('[name="searchNext"]'),
  buttonSearchPrev: () => comp.find('[name="searchPrev"]'),
  buttonClearSearch: () => comp.find('[name="clearSearch"]'),
  summaryBlock: () => comp.find('[name="summaryBlock"]')
})

describe('<Search /> component', () => {
  describe('click on "search next" after changing searchQuery input', () => {
    const ctx = {}
    beforeAll(() => {
      ctx.spyUpdateSearchResult = jest.fn()
      ctx.comp = shallow(<Search messages={createTestData()} searchResultIndex={null} updateSearchResult={ctx.spyUpdateSearchResult} />)
      ctx.elems = setupElements(ctx.comp)
      ctx.elems.inputSearchQuery().simulate('change', { target: { value: 'EUR' } })
      ctx.elems.buttonSearchNext().simulate('click')
      jest.runAllTimers();
    })

    test('should call updateSearchResult with first available result index', () => {
      expect(ctx.spyUpdateSearchResult).toHaveBeenCalledWith(1)
    })

    test('should render summary text', () => {
      expect(ctx.elems.summaryBlock().text()).toEqual('1 / 2')
    })

    test('all control buttons should be enabled', () => {
      expect(ctx.elems.buttonSearchNext().prop('disabled')).toBe(false)
      expect(ctx.elems.buttonSearchPrev().prop('disabled')).toBe(false)
      expect(ctx.elems.buttonClearSearch().prop('disabled')).toBe(false)
    })
  })

  describe('click on "search prev" after changing searchQuery input', () => {
    const ctx = {}
    beforeAll(() => {
      ctx.spyUpdateSearchResult = jest.fn()
      ctx.comp = shallow(<Search messages={createTestData()} searchResultIndex={null} updateSearchResult={ctx.spyUpdateSearchResult} />)
      ctx.elems = setupElements(ctx.comp)
      ctx.elems.inputSearchQuery().simulate('change', { target: { value: 'EUR' } })
      ctx.elems.buttonSearchPrev().simulate('click')
      jest.runAllTimers();
    })

    test('should call updateSearchResult with first available result index', () => {
      expect(ctx.spyUpdateSearchResult).toHaveBeenCalledWith(2)
    })

    test('should render summary text', () => {
      expect(ctx.elems.summaryBlock().text()).toEqual('2 / 2')
    })

    test('all control buttons should be enabled', () => {
      expect(ctx.elems.buttonSearchNext().prop('disabled')).toBe(false)
      expect(ctx.elems.buttonSearchPrev().prop('disabled')).toBe(false)
      expect(ctx.elems.buttonClearSearch().prop('disabled')).toBe(false)
    })
  })

  describe('No results', () => {
    const ctx = {}
    beforeAll(() => {
      ctx.spyUpdateSearchResult = jest.fn()
      ctx.comp = shallow(<Search messages={createTestData()} searchResultIndex={null} updateSearchResult={ctx.spyUpdateSearchResult} />)
      ctx.elems = setupElements(ctx.comp)
      ctx.elems.inputSearchQuery().simulate('change', { target: { value: 'some random string' } })
      ctx.elems.buttonSearchPrev().simulate('click')
      jest.runAllTimers();
    })

    test('should render summary showing "no results" text', () => {
      expect(ctx.elems.summaryBlock().text()).toEqual('No results')
    })

    test('should call updateSearchResult handler with null', () => {
      expect(ctx.spyUpdateSearchResult).toHaveBeenCalledWith(null)
    })
  })

  describe('click on "search next" again without changing input', () => {
    const ctx = {}
    beforeAll(() => {
      ctx.spyUpdateSearchResult = jest.fn()
      ctx.comp = shallow(<Search messages={createTestData()} searchResultIndex={null} updateSearchResult={ctx.spyUpdateSearchResult} />)
      ctx.elems = setupElements(ctx.comp)
      ctx.elems.inputSearchQuery().simulate('change', { target: { value: 'EUR' } })
      ctx.elems.buttonSearchNext().simulate('click')
      ctx.comp.setProps({ searchResultIndex: 1 })
      ctx.elems.buttonSearchNext().simulate('click')
      jest.runAllTimers();
    })

    test('should call updateSearchResult with following available result index', () => {
      expect(ctx.spyUpdateSearchResult).toHaveBeenCalledWith(2)
    })

    test('should render summary text', () => {
      expect(ctx.elems.summaryBlock().text()).toEqual('2 / 2')
    })
  })

  describe('click on "search prev" again without changing input', () => {
    const ctx = {}
    beforeAll(() => {
      ctx.spyUpdateSearchResult = jest.fn()
      ctx.comp = shallow(<Search messages={createTestData()} searchResultIndex={null} updateSearchResult={ctx.spyUpdateSearchResult} />)
      ctx.elems = setupElements(ctx.comp)
      ctx.elems.inputSearchQuery().simulate('change', { target: { value: 'EUR' } })
      ctx.elems.buttonSearchPrev().simulate('click')
      ctx.comp.setProps({ searchResultIndex: 2 })
      ctx.elems.buttonSearchPrev().simulate('click')
      jest.runAllTimers();
    })

    test('should call updateSearchResult with precedent available result index', () => {
      expect(ctx.spyUpdateSearchResult).toHaveBeenCalledWith(1)
    })

    test('should render summary text', () => {
      expect(ctx.elems.summaryBlock().text()).toEqual('1 / 2')
    })
  })

  describe('click on "clear"', () => {
    const ctx = {}
    beforeEach(() => {
      ctx.spyUpdateSearchResult = jest.fn()
      ctx.comp = mount(<Search messages={createTestData()} searchResultIndex={null} updateSearchResult={ctx.spyUpdateSearchResult} />)

      ctx.elems = setupElements(ctx.comp)
      ctx.elems.inputSearchQuery().simulate('change', { target: { value: 'EUR' } })
      ctx.elems.buttonClearSearch().simulate('click')
      jest.runAllTimers();
    })

    test('should call updateSearchResult with null', () => {
      expect(ctx.spyUpdateSearchResult).toHaveBeenCalledWith(null)
    })

    test('should clear searchQuery input', () => {
      expect(ctx.elems.inputSearchQuery().text()).toBe('')
    })

    test('summary should be hidden', () => {
      expect(ctx.elems.summaryBlock().exists()).toBe(false)
    })
  })
})