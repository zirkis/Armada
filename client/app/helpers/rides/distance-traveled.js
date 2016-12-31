import Ember from 'ember';

export function ridesDistanceTraveled(params/* , hash */) {
  const departureTime = params[0];
  const speed = params[1];
  const travelDuration = params[2];
  let timeSinceDeparture = (Date.now() - departureTime)/ 1000; // sec
  if (timeSinceDeparture > travelDuration) {
    timeSinceDeparture = travelDuration / 3600; // hour
  } else {
    timeSinceDeparture = timeSinceDeparture / 3600; // hour
  }
  const distance = Math.floor(speed * timeSinceDeparture);
  return `${distance} KM`;
}

export default Ember.Helper.helper(ridesDistanceTraveled);
