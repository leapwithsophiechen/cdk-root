const extractFromCsv = (csv: any) =>
  csv.split(',').reduce(
    (acc: any, item: any) => {
      const parts = item.split(':');

      if (parts.length > 1) {
        const [key, ...values] = parts;
        acc.keyValues.push([key, values.join(':')]);
      } else {
        acc.values.push(item);
      }

      return acc;
    },
    { keyValues: [], values: [] }
  );

const combineKeyValuePair = (pair: any) => pair.join(':');

const buildCsv = ({ keyValues, values }: any) =>
  [...keyValues.map(combineKeyValuePair), ...values].filter((x) => x).join(',');

const combineUniqueKeyValueArray = (existing: any, additional: any) =>
  Array.from(new Map([...additional, ...existing]));

export const supplementCsv = ({ existing = '', additional = {} } = {}) => {
  const { keyValues, values } = extractFromCsv(existing);
  const additionalNormalised = Object.entries(additional);
  const allTags = combineUniqueKeyValueArray(keyValues, additionalNormalised);
  return buildCsv({ keyValues: allTags, values });
};
