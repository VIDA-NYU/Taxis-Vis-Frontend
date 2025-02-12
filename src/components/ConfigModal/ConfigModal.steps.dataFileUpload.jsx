import React from 'react';
import {
  Box,
  Heading,
  Spinner,
  FormControl,
  FormLabel,
  Select,
  Input,
  Text,
} from '@chakra-ui/react';
import { ConfigButton } from './ConfigModal.utils.configButton';

export default function DataFileUpload({
  delimiter,
  setDelimiter,
  customDelimiter,
  setCustomDelimiter,
  onDataFileChange,
  dataFile,
  isLoadingFile,
}) {
  return (
    <Box textAlign='center' mt={6}>
      <Heading as='h3' size='md' mb={4}>
        Upload CSV
      </Heading>
      {isLoadingFile ? (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='150px'
        >
          <Spinner size='xl' thickness='4px' speed='0.65s' color='blue.500' />
        </Box>
      ) : (
        <>
          <FormControl mb={3}>
            <FormLabel>Select CSV Delimiter</FormLabel>
            <Select
              borderRadius='12px'
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
            >
              <option value=','>Comma (,)</option>
              <option value='|'>Pipe (|)</option>
              <option value=';'>Semicolon (;)</option>
              <option value='\t'>Tab</option>
              <option value='custom'>Custom</option>
            </Select>
          </FormControl>
          {delimiter === 'custom' && (
            <FormControl mb={3}>
              <FormLabel>Enter Custom Delimiter</FormLabel>
              <Input
                borderRadius='12px'
                placeholder='Type custom delimiter'
                value={customDelimiter}
                onChange={(e) => setCustomDelimiter(e.target.value)}
              />
            </FormControl>
          )}
          <ConfigButton as='label' cursor='pointer'>
            Choose File
            <Input
              type='file'
              display='none'
              accept='.csv'
              onChange={(e) => onDataFileChange(e.target.files[0])}
            />
          </ConfigButton>
          {dataFile && (
            <Text mt={2} fontSize='sm' color='gray.600'>
              {dataFile.name}
            </Text>
          )}
        </>
      )}
    </Box>
  );
}
