import '../../internal/tests'
import * as React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { dmsSign } from 'geospatialdraw/bin/coordinates/dms-formatting'
import { DMSValueEditor } from './dms-value-editor'

describe('<DMSValueEditor />', () => {
  const getWrapper = (degree, minute, second, setValue = () => {}) =>
    shallow(
      <DMSValueEditor
        maxDegrees={90}
        negativeHeadingName="-"
        negativeHeadingTooltip=""
        positiveHeadingName="+"
        positiveHeadingTooltip=""
        value={{
          degree,
          minute,
          second,
        }}
        setValue={setValue}
      />
    )
  describe('renders', () => {
    it('default', () => {
      const wrapper = getWrapper(30, 15, 7.5)
      expect(wrapper.exists()).to.equal(true)
      expect(wrapper.find('SmallInput').length).to.equal(2)
      expect(wrapper.find('WideInput').length).to.equal(1)
      expect(wrapper.find('HeadingButton').length).to.equal(2)
    })
    it('positive value', () => {
      const wrapper = getWrapper(30, 15, 7.5)
      expect(
        wrapper
          .find('HeadingButton[isSelected=true]')
          .childAt(0)
          .text()
      ).to.equal('+')
    })
    it('negative value', () => {
      const wrapper = getWrapper(-30, 15, 7.5)
      expect(
        wrapper
          .find('HeadingButton[isSelected=true]')
          .childAt(0)
          .text()
      ).to.equal('-')
    })
  })
  describe('setValue', () => {
    const getValueWrapper = (done, expectedDMS) =>
      getWrapper(5, 5, 5, dms => {
        expect(dms).to.deep.equal(expectedDMS)
        done()
      })
    it('degree', done => {
      const wrapper = getValueWrapper(done, {
        degree: 11,
        minute: 5,
        second: 5,
      })
      wrapper
        .find('SmallInput')
        .at(0)
        .prop('onChange')(11)
    })
    it('minute', done => {
      const wrapper = getValueWrapper(done, {
        degree: 5,
        minute: 45,
        second: 5,
      })
      wrapper
        .find('SmallInput')
        .at(1)
        .prop('onChange')(45)
    })
    it('second', done => {
      const wrapper = getValueWrapper(done, {
        degree: 5,
        minute: 5,
        second: 78,
      })
      wrapper.find('WideInput').prop('onChange')(78)
    })
    it('positive', done => {
      const wrapper = getValueWrapper(done, {
        degree: 5,
        minute: 5,
        second: 5,
      })
      wrapper
        .find('HeadingButton')
        .at(0)
        .prop('onClick')()
    })
    it('negative', done => {
      const wrapper = getValueWrapper(done, {
        degree: -5,
        minute: -5,
        second: -5,
      })
      wrapper
        .find('HeadingButton')
        .at(1)
        .prop('onClick')()
    })
  })
})
