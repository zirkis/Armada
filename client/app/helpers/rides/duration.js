import Ember from 'ember';

export function ridesDuration(params/*, hash*/) {
  let duration = params[0]; // sec
  let durationLabel = '';
  if (Math.floor(duration / 86400)) {
    durationLabel += `${Math.floor(duration / 86400)} J `;
    duration = duration - Math.floor(duration / 86400) * 86400;
  }
  if (Math.floor(duration / 3600)) {
    durationLabel += `${Math.floor(duration / 3600)} H `;
    duration = duration - Math.floor(duration / 3600) * 3600;
  }
  durationLabel += `${Math.floor(duration / 60)} M`;
  // durationLabelSec = durationLabelSec - Math.floor(durationLabelSec / 60) * 60;
  return durationLabel;
}

export default Ember.Helper.helper(ridesDuration);
