require('./lib/ol-tests')
const { expect } = require('chai')
const MockDrawingContext = require('./lib/mock-drawing-context').default
const BoundingBoxDrawingControl = require('../bin/drawing/openlayers/bounding-box-drawing-control').default
const { BOUNDING_BOX, POLYGON } = require('../bin/shapes')
const { METERS } = require('../bin/geometry')

describe('BoundingBoxDrawingControl', () => {
  const makePolygonJSON = () => ({
    type: 'Feature',
    properties: {
      color: 'blue',
      shape: BOUNDING_BOX,
      id: 'identifier',
      buffer: {
        width: 0,
        unit: METERS,
      },
    },
    geometry: {
      type: POLYGON,
      coordinates: [
        [
          [10, 10],
          [50, 10],
          [50, 50],
          [10, 50],
          [10, 10],
        ],
      ],
    },
    bbox: [10, 10, 50, 50],
  })
  describe('constructor', () => {
    it('default', () => {
      const context = new MockDrawingContext()
      const receiver = geoJSON => {}
      const control = new BoundingBoxDrawingControl(context, receiver)
    })
  })
  describe('setGeo', () => {
    it('default', () => {
      const context = new MockDrawingContext()
      const receiver = geoJSON => {}
      const control = new BoundingBoxDrawingControl(context, receiver)
      control.setGeo(makePolygonJSON())
      const expected = makePolygonJSON()
      expect(
        context
          .getMethodCalls()
          .updateFeature[0][0].getGeometry()
          .getCoordinates()
      ).to.deep.equal(expected.geometry.coordinates)
      expect(context.getMethodCalls().updateFeature.length).to.equal(1)
      expect(context.getMethodCalls().removeFeature.length).to.equal(0)
      expect(control.isDrawing()).to.equal(true)
    })
  })
  describe('startDrawing', () => {
    it('default', () => {
      const context = new MockDrawingContext()
      const receiver = geoJSON => {}
      const control = new BoundingBoxDrawingControl(context, receiver)
      control.startDrawing()
      expect(context.getMethodCalls().addInteractions.length).to.equal(0)
      expect(
        context.getMethodCalls().addInteractionsWithoutModify.length
      ).to.equal(1)
      expect(context.getMethodCalls().setEvent.length).to.equal(1)
      expect(context.getMethodCalls().setDrawInteraction.length).to.equal(1)
      expect(context.getMethodCalls().updateFeature.length).to.equal(0)
      expect(context.getMethodCalls().removeFeature.length).to.equal(1)
      expect(control.isDrawing()).to.equal(true)
    })
  })
  describe('cancelDrawing', () => {
    it('default', () => {
      const context = new MockDrawingContext()
      const receiver = geoJSON => {}
      const control = new BoundingBoxDrawingControl(context, receiver)
      control.cancelDrawing()
      expect(context.getMethodCalls().removeListeners.length).to.equal(1)
      expect(context.getMethodCalls().removeInteractions.length).to.equal(1)
      expect(control.isDrawing()).to.equal(false)
    })
  })
  describe('extentChanged', () => {
    const makeExtent = () => [11, 20, 50, 60]
    const makeExpectedJSON = () => ({
      type: 'Feature',
      properties: {
        color: '',
        shape: BOUNDING_BOX,
        id: '',
        buffer: {
          width: 0,
          unit: METERS,
        },
      },
      geometry: {
        type: POLYGON,
        coordinates: [
          [
            [11, 20],
            [50, 20],
            [50, 60],
            [11, 60],
            [11, 20],
          ],
        ],
      },
      bbox: makeExtent(),
    })
    it('default', () => {
      const context = new MockDrawingContext()
      let updated = null
      const receiver = geoJSON => {
        updated = geoJSON
      }
      const control = new BoundingBoxDrawingControl(context, receiver)
      control.setInputBlocked(true)
      control.extentChanged({
        extent: makeExtent(),
      })
      control.setInputBlocked(false)
      const expected = makeExpectedJSON()
      expect(updated).to.deep.equal(expected)
    })
    it('startDrawing -> extentChanged', () => {
      const context = new MockDrawingContext()
      let updated = null
      const receiver = geoJSON => {
        updated = geoJSON
      }
      const control = new BoundingBoxDrawingControl(context, receiver)
      control.startDrawing()
      control.setGeo(makePolygonJSON())
      control.setInputBlocked(true)
      control.extentChanged({
        extent: makeExtent(),
      })
      control.setInputBlocked(false)
      const expected = makeExpectedJSON()
      expected.properties.id = 'identifier'
      expected.properties.color = 'blue'
      expect(updated).to.deep.equal(expected)
    })
  })
})
