/**
 * total: the overall total value.
 * used: how much of the total has been used.
 *
 * @export
 */
export interface ISimpleUsageChartData {
  total: number;
  used: number;
}
/**
 * The % usage thresholds at which to show the various colors on the chart.
 * The threshold will be met if the used value is greater than the threshold,
 * this is to allow > 0% but not 0% thresholds.
 * The 'ok' color will always be used if no threshold is met or no thresholds are found.
 * 
 * The colors are take from the $status-colors scss theme variable.
 * @export
 */
export interface IChartThresholds {
  danger?: number;
  warning?: number;
}

/**
 * Internal
 *
 * @export
 */
export interface IUsageColor {
  domain: [string, string];
}

/**
 * Internal
 *
 * @export
 */
export interface IChartData {
  colors: IUsageColor;
  total: number;
  used: number;
  results: [
    {
      name: 'Used',
      value: number
    },
    {
      name: 'Remaining',
      value: number
    }
  ]
}