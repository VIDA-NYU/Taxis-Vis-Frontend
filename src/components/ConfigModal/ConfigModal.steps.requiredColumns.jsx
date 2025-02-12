import React, { useEffect } from 'react';
import { FormControl, FormLabel, Select, VStack, Text } from '@chakra-ui/react';
import { fetchConfig } from '../DataAnalysisManager/DataAnalysisManager.services';

export default function ConfigureRequiredColumns({
  title,
  columns,
  requiredColumns,
  columnMapping,
  setColumnMapping,
}) {
  useEffect(() => {
    if (!requiredColumns.length) {
      fetchConfig().then((config) => {
        if (config?.required_columns) {
          const initialMapping = config.required_columns.reduce((acc, col) => {
            acc[col] = '';
            return acc;
          }, {});
          setColumnMapping(initialMapping);
        }
      });
    }
  }, [requiredColumns, setColumnMapping]);

  const handleMappingChange = (requiredCol, selectedCol) => {
    if (typeof setColumnMapping === 'function') {
      setColumnMapping((prev) => ({ ...prev, [requiredCol]: selectedCol }));
    } else if (
      typeof setColumnMapping === 'object' &&
      setColumnMapping[requiredCol]
    ) {
      setColumnMapping[requiredCol](selectedCol);
    }
  };

  return (
    <VStack align='stretch' spacing={4}>
      <Text fontSize='lg' fontWeight='bold'>
        Configure Required Columns for {title}
      </Text>
      {requiredColumns.map((requiredCol) => (
        <FormControl key={requiredCol}>
          <FormLabel>{requiredCol}</FormLabel>
          <Select
            value={columnMapping[requiredCol] || ''}
            onChange={(e) => handleMappingChange(requiredCol, e.target.value)}
          >
            <option value=''>None</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </Select>
        </FormControl>
      ))}
    </VStack>
  );
}
