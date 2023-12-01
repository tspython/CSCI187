const baseSafetyRatings = {
  "UberX": 16,
  "Uber Green": 16,
  "Comfort Electric": 16,
  "UberXL": 16,
  "Comfort": 16,
  "Uber Pet": 16,
  "Black": 16,
  "Black SUV": 16,
  "WAV": 16,
  "Assist": 16,
  "Select": 16,
  "Lyft": 16,
  "Extra Comfort": 16,
  "XL": 16,
  "BUS": 13,
  "BART": 10,
  "Caltrain": 18
};

function rankOptions(cost, safety, speed, transportationData) {
  const rankedOptions = transportationData.map(option => {
    const safetyDifference = Math.abs(option.safety - safety);
    const costDifference = Math.abs(option.cost - cost);
    const speedDifference = Math.max(0, Math.abs(option.speedRating - speed)); // Adjusted to handle speed below 0

    const totalDifference = safetyDifference + costDifference + speedDifference;

    return { option, totalDifference };
  });

  // Sort based on the total difference
  rankedOptions.sort((a, b) => a.totalDifference - b.totalDifference);

  // Scale the safety score of each option using adjustSafety function
  rankedOptions.forEach((rankedOption) => {
    rankedOption.option.safety = adjustSafety(rankedOption.option.safety, rankedOption.option.distance, rankedOption.option.time);
  });

  return rankedOptions;
}


function adjustSafety(baseSafety, distance, time) {
  const distanceFactor = 0.1;
  const timeFactor = 0.05;

  const safetyReduction = distance * distanceFactor + time * timeFactor;

  let adjustedSafety = baseSafety - safetyReduction;

  if (adjustedSafety < 0) {
    adjustedSafety = 0;
  }

  return adjustedSafety;
}

function parseTransportationOptions(lyftData, uberData, publicTransitData) {
  const transportationOptions = [];

    // Parse Uber data and convert estimatedTripTime from seconds to minutes
  const formattedUberData = uberData.map((ride) => ({
    type: ride.rideType,
    cost: parseFloat(ride.fare.replace('$', '')),
    safety: baseSafetyRatings[ride.rideType] || 16, // Default safety value as 16 for missing safety values
    distance: parseFloat(ride.distanceInMiles), // Use distanceInMiles attribute for distance
    time: Math.ceil(ride.estimatedTripTime / 60), // Convert seconds to minutes
    speed: 0, // Initial speed value set to 0
  }));
  transportationOptions.push(...formattedUberData);
  // Parse Public Transit data
  const publicTransitOption = {
    type: publicTransitData.legs[0].transitDetails[0].vehicleType,
    cost: parseFloat(publicTransitData.fare.replace('$', '').split(' ')[0]),
    safety: 16, // Default safety value as 16 for Public Transit
    distance: parseFloat(publicTransitData.totalDistance.split(' ')[0]), // Extract distance in miles
    time: parseInt(publicTransitData.totalDuration.split(' ')[0]), // Extract minutes from totalDuration
    speed: 0, // Initial speed value set to 0
  };


  transportationOptions.push(publicTransitOption);
  transportationOptions.forEach((option) => {
   // if (option.speed === 0) {
    //  option.speed = calculateSpeed(option.distance, option.time, transportationOptions);
    //}
    // Calculating rating for speed based on time
    option.speedRating = calculateSpeedRatingBasedOnTime(option.time, transportationOptions);
  });

  return transportationOptions;
}

function calculateSpeedRatingBasedOnTime(time, allOptions) {
  const times = allOptions.map((option) => option.time).sort((a, b) => a - b);
  const index = times.indexOf(time);
  const rating = time > 0 ? ((times.length - index - 1) / (times.length - 1)) * 5 : 0;
  return rating;
}

export default rankOptions;
