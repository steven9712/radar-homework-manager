import React from 'react';
import Dot from './Dot.js';
import renderer from 'react-test-renderer';
import { shallow, mount, render } from 'enzyme';
import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from "sinon";

beforeAll(() => {
  Enzyme.configure({ adapter: new Adapter() })
  jest.useFakeTimers();
});

const dot = {
  center:{x:10,y:15},
  radius:100,
}

it('creates an svg circle with the correct attributes', () => {
  const wrapper = shallow(
    <Dot center={dot.center} radius={dot.radius} />,
  );

  expect(wrapper).toMatchSnapshot();
});

it('creates a null component because of invalid x prop', () => {
  const wrapper = shallow(
    <Dot center={{x:-50, y:dot.center.y}} radius={dot.radius} />,
  );

  expect(wrapper).toMatchSnapshot();
});

it('creates a null component because of invalid y prop', () => {
  const wrapper = shallow(
    <Dot center={{x:dot.center.x, y:-100}} radius={dot.radius} />,
  );

  expect(wrapper).toMatchSnapshot();
});

it('creates a null component because of invalid radius prop', () => {
  const wrapper = shallow(
    <Dot center={dot.center} radius={-1} />,
  );

  expect(wrapper).toMatchSnapshot();
});

it('initialize the dot to have the minimum opacity', () => {
  const wrapper = shallow(
    <Dot center={dot.center} radius={dot.radius} animateFades={true}/>,
  );

  expect(wrapper).toMatchSnapshot();
});

it('should fade in by setting the opacity instantly to 1', () => {
  const component = shallow(<Dot center={dot.center} radius={dot.radius} />);
  component.instance().fadeIn()

  expect(component.instance().state.opacity).toEqual(1);
});

it('should fill checkIntersect with a reference to the asych function that checks for the spinline to intersect this function', () => {
  const component = shallow(<Dot center={dot.center} radius={dot.radius} animateFades={true} />);
  
  expect(component.instance().checkIntersect).toBeDefined();
});

it('should called fadeOut when restartFadeOut is called', () => {
  const component = shallow(<Dot center={dot.center} radius={dot.radius} animateFades={true} />);
  const spy = jest.spyOn(component.instance(),'fadeOut');
  
  component.instance().restartFadeOut();
  
  expect(spy).toBeCalled();
});

it('the old fadeOut interval to be cleared', () => {
  const component = shallow(<Dot center={dot.center} radius={dot.radius} animateFades={true} />);
  component.instance().fOut = {};

  component.instance().startFadeIn();
  
  expect(clearInterval).toBeCalled();
});

it('the fadeIn function to be called and the startFadeOut function to be called', () => {
  const component = shallow(<Dot center={dot.center} radius={dot.radius} animateFades={true} />);
  const spy1 = jest.spyOn(component.instance(),'fadeIn');
  const spy2 = jest.spyOn(component.instance(),'startFadeOut');

  component.instance().startFadeIn();
  
  expect(spy1).toBeCalled();
  expect(spy2).toBeCalled();
});

