const baseSafetyRatings = {
  "UberX": 16,
  "Uber Green": 16,
  "UberXL": 16,
  "Comfort Electric": 16,
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
  "Black": 16,
  "Black SUV": 16,
  "VTA": 13,
  "BART": 10,
  "Caltrain": 18
};

const calculateSafetyRating = (cost, safety, speed, transportationOptions) => {
  let adjustedSafetyRatings = {};

  for (let option of transportationOptions) {
    const time = option.time;
    const distance = option.distance;
    const distanceTimeFactor = (time * distance) / 1000;

    let scaledSafety = baseSafetyRatings[option.type] - distanceTimeFactor * 0.1;
    scaledSafety -= (20 - safety) * 0.2;
    scaledSafety += speed * 0.5;

    if (cost < option.priceRange.low || cost > option.priceRange.high) {
      scaledSafety -= 0.5;
    }

    adjustedSafetyRatings[option.type] = scaledSafety;
  }

  return adjustedSafetyRatings;
};

export default calculateSafetyRating;
