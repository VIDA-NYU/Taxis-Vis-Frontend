import React from 'react';
import { Box, Text, Select } from '@chakra-ui/react';
import { ConfigButton } from './ConfigModal.utils.configButton';

export default function ConfigSelector({
  existingConfigs,
  selectedConfig,
  setSelectedConfig,
  onSelectConfig,
}) {
  return (
    <Box mt={4} className='config_modal_section'>
      <Text mb={1} className='config_modal_label'>
        Select a Config:
      </Text>
      <Select
        borderRadius='12px'
        mb={2}
        placeholder='-- Select --'
        value={selectedConfig}
        onChange={(e) => setSelectedConfig(e.target.value)}
        className='config_modal_select'
      >
        {existingConfigs.map((cfg) => (
          <option key={cfg} value={cfg}>
            {cfg}
          </option>
        ))}
      </Select>
      <ConfigButton onClick={onSelectConfig}>Load Config</ConfigButton>
    </Box>
  );
}
