import {
  singleRountripAverageEmissions,
  tCO2PerEmployee,
  pcEnergyConsumption_kWh,
  usaPowerGrid_tCO2PerKWh,
  daysInYear,
  averageOnlinePlaytimeInHours,
  mobileCO2tFactorPerHour,
  phoneRechargeTimeInHours,
  phoneChargerPower_kW,
  consoleEnergyConsumption_kWh,
} from './constants';
import { GamingPlatform, PlatformType, GameType } from './types';

/**
 * @see singleRountripAverageEmissions
 * The value 0.5058571429 tCO2 represents the emissions produced by a single round-trip in economy class.
 * It is the average of flights from Helsinki to
 *
 * 1 x Paris,
 * 1 x Dubrovnik,
 * 1 x London,
 * 1 x Los Angeles,
 * 1 x New York,
 * 1 x Tokyo,
 * 1 x Seoul,
 *
 * and back (ICAO calculator).
 * Results in tCO2 / year
 *
 * @param numberOfFlightsPerYear number
 * @returns number
 */
export const getTravelEmissions = (numberOfFlightsPerYear = 0) =>
  Number(numberOfFlightsPerYear) * singleRountripAverageEmissions;

/**
 *@see tCO2PerEmployee
 * The value 0.761 tCO2 consists of:
 * - updating equipment (new laptop, phone, etc.) every third year: 0.1606333333 tCO2
 * - the office (electricity, cooling, heating, waste and WFH): 0.6 tCO2
 * - snacks (2 cups of coffee with milk / day / employee): 0.000061 tCO2
 * Result is tCO2 / year
 *
 * @param numberOfPersonnel number
 * @returns number
 */
export const getPersonnelEmissions = (numberOfPersonnel = 0) =>
  Number(numberOfPersonnel) * tCO2PerEmployee;

/**
 * @see pcEnergyConsumption_kWh
 * @see consoleEnergyConsumption_kWh
 * @see phoneChargerPower_kW
 * @see phoneRechargeTimeInHours
 *
 * Results in tCO2 / year
 *
 * @param gamingPlatforms
 * @returns number
 */
export const getPlayerEmissions = (gamingPlatforms: GamingPlatform[]) => {
  let totalPlayerEmission = 0;

  gamingPlatforms.forEach((entry) => {
    const {
      platformType,
      gameType,
      dailyActiveUsers = 0,
      purchasedGamesAmount = 0,
      averagePlayTime = 0,
      sessionLength = 0,
    } = entry;
    if (
      platformType === PlatformType.PC &&
      gameType === GameType.SinglePlayer
    ) {
      //PC single player offline
      totalPlayerEmission +=
        purchasedGamesAmount *
        averagePlayTime *
        pcEnergyConsumption_kWh *
        usaPowerGrid_tCO2PerKWh;
    } else if (
      platformType === PlatformType.PC &&
      gameType === GameType.MultiPlayer
    ) {
      //PC multiplayer online
      totalPlayerEmission +=
        dailyActiveUsers *
        daysInYear *
        averageOnlinePlaytimeInHours *
        pcEnergyConsumption_kWh *
        usaPowerGrid_tCO2PerKWh;
    } else if (platformType === PlatformType.Mobile) {
      //Mobile multiplayer online
      totalPlayerEmission +=
        dailyActiveUsers *
        daysInYear *
        (sessionLength / 60) *
        mobileCO2tFactorPerHour *
        phoneRechargeTimeInHours *
        phoneChargerPower_kW *
        usaPowerGrid_tCO2PerKWh;
    } else if (
      platformType === PlatformType.Console &&
      gameType === GameType.SinglePlayer
    ) {
      //Console single player offline
      totalPlayerEmission +=
        purchasedGamesAmount *
        averagePlayTime *
        consoleEnergyConsumption_kWh *
        usaPowerGrid_tCO2PerKWh;
    } else if (
      platformType === PlatformType.Console &&
      gameType === GameType.MultiPlayer
    ) {
      //Console multiplayer online
      totalPlayerEmission +=
        dailyActiveUsers *
        daysInYear *
        averageOnlinePlaytimeInHours *
        consoleEnergyConsumption_kWh *
        usaPowerGrid_tCO2PerKWh;
    }
  });

  return totalPlayerEmission;
};

export const roundToNearestTen = (value: number) => {
  const result = Math.round(value / 10) * 10;
  if (result < 10) {
    return Math.round(value);
  }
  return result;
};
