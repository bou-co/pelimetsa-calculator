import { pricePerCO2TonneInEuros, pricePerHectare } from './constants';
import {
  getPersonnelEmissions,
  getPlayerEmissions,
  getTravelEmissions,
  roundToNearestTen,
} from './helpers';

import { EmissionsData, EmissionResults } from './types';

export const calculateEmissions = (data: EmissionsData): EmissionResults => {
  //emissions per category
  const travelEmissionsPerYear = getTravelEmissions(data.travel) || 0;
  const personnelEmissionsPerYear = getPersonnelEmissions(data.personnel) || 0;
  const playerEmissionsPerYear = getPlayerEmissions(data.players) || 0;
  const otherEmissionsPerYear = Number(data.other) || 0;

  //total carbon emissions per year
  const _totalCarbonEmissionsPerYear =
    travelEmissionsPerYear +
    personnelEmissionsPerYear +
    playerEmissionsPerYear +
    otherEmissionsPerYear;

  //round the total number of emissions
  const totalCarbonEmissionsPerYear = roundToNearestTen(
    _totalCarbonEmissionsPerYear
  );

  //calculate percentages per category
  const travelEmissionsPercentage =
    (travelEmissionsPerYear / _totalCarbonEmissionsPerYear) * 100 || 0;
  const personnelEmissionsPercentage =
    (personnelEmissionsPerYear / _totalCarbonEmissionsPerYear) * 100 || 0;
  const playerEmissionsPercentage =
    (playerEmissionsPerYear / _totalCarbonEmissionsPerYear) * 100 || 0;
  const otherEmissionsPercentage =
    (otherEmissionsPerYear / _totalCarbonEmissionsPerYear) * 100 || 0;

  //calculate donations
  const donationSumInEuros =
    totalCarbonEmissionsPerYear * pricePerCO2TonneInEuros;

  const protectedForestAreaInHectares = donationSumInEuros / pricePerHectare;

  return {
    totalCarbonEmissionsPerYear,
    emissionPercentages: {
      travel: travelEmissionsPercentage,
      personnel: personnelEmissionsPercentage,
      players: playerEmissionsPercentage,
      other: otherEmissionsPercentage,
    },
    donationSumInEuros,
    protectedForestAreaInHectares,
  };
};
