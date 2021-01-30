import React from 'react'
import { shallow } from 'enzyme'
import { Subscribe } from  './Subscribe'


const subscribeProps = () => ({
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  subscriptions: [],
  messages: []

})

const generateMockArray = () => {
  const res = []
  for(let i = 0; i < 15000; i++) {
    res.push(i)
  }
  return res
}

describe('<Subscribe /> component', () => {
  test('should call unsubscribe for each topic after messages count exceeds 15k', () => {
    const props = { 
      ...subscribeProps(),
      subscriptions: ['a', 'b']
    }
    const comp = shallow(<Subscribe {...props} />)
    comp.setProps({ messages: generateMockArray() })
    expect(props.unsubscribe).toHaveBeenCalledWith({ topics: ['a', 'b']})
  })
})