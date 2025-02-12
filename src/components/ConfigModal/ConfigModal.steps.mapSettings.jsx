import React from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Select,
  HStack,
  Checkbox,
  Input,
} from '@chakra-ui/react';

export default function MapSettings({
  tileLayer,
  setTileLayer,
  tileLayers,
  threeDEnabled,
  setThreeDEnabled,
  selectedCity,
  setSelectedCity,
  cityCenters,
  centerLat,
  setCenterLat,
  centerLng,
  setCenterLng,
  zoom,
  setZoom,
}) {
  return (
    <VStack spacing={4} align='stretch' mt={6}>
      <FormControl>
        <FormLabel>Tile Layer</FormLabel>
        <Select
          borderRadius='12px'
          value={tileLayer}
          onChange={(e) => setTileLayer(e.target.value)}
        >
          {Object.keys(tileLayers).map((k) => (
            <option key={k} value={tileLayers[k].styleUrl}>
              {k}
            </option>
          ))}
        </Select>
      </FormControl>
      <HStack>
        <Checkbox
          isChecked={threeDEnabled}
          onChange={(e) => setThreeDEnabled(e.target.checked)}
          borderRadius='6px'
        >
          3D Enabled
        </Checkbox>
      </HStack>
      <FormControl>
        <FormLabel>City Center</FormLabel>
        <Select
          borderRadius='12px'
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value='manual'>Manual</option>
          {Object.keys(cityCenters).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Center Latitude</FormLabel>
        <Input
          borderRadius='12px'
          value={centerLat}
          onChange={(e) => setCenterLat(e.target.value)}
          isDisabled={selectedCity !== 'manual'}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Center Longitude</FormLabel>
        <Input
          borderRadius='12px'
          value={centerLng}
          onChange={(e) => setCenterLng(e.target.value)}
          isDisabled={selectedCity !== 'manual'}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Zoom</FormLabel>
        <Input
          borderRadius='12px'
          type='number'
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
        />
      </FormControl>
    </VStack>
  );
}
