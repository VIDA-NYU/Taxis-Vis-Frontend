import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  VStack,
  HStack,
} from '@chakra-ui/react';

import {
  fetchTileLayers,
  fetchCityCenters,
  parseCsvFile,
  addLayerToList,
  updateLayerInList,
  removeLayerFromList,
  addKeyword,
  removeKeyword,
  handleSelectExisting,
  useConfigService,
  handleCreateNew,
} from './ConfigModal.services';

import { ConfigButton, StepDots } from './ConfigModal.utils.configButton';
import DataFileUpload from './ConfigModal.steps.dataFileUpload';
import MapSettings from './ConfigModal.steps.mapSettings';
import GeoJsonLayers from './ConfigModal.steps.geoJsonLayers';
import ConfigureRequiredColumns from './ConfigModal.steps.requiredColumns';
import { THEME, getRandomColor } from './ConfigModal.utils';

import './ConfigModal.styles.css';
import ConfigSelector from './ConfigModal.steps.configSelector';

export default function ConfigModal({
  isOpen = true,
  onClose,
  onConfigSelected,
}) {
  const { existingConfigs } = useConfigService();
  const [mode, setMode] = useState('select');

  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Data File', 'Database', 'Map', 'Required Columns', 'GeoJSON'];

  const [selectedConfig, setSelectedConfig] = useState('');
  const [dataFile, setDataFile] = useState(null);
  const [columns, setColumns] = useState([]);

  const [pickupLonCol, setPickupLonCol] = useState('none');
  const [pickupLatCol, setPickupLatCol] = useState('none');
  const [dropoffLonCol, setDropoffLonCol] = useState('none');
  const [dropoffLatCol, setDropoffLatCol] = useState('none');
  const [datetimePickup, setDatetimePickup] = useState('none');
  const [datetimeDropoff, setDatetimeDropoff] = useState('none');

  const [tileLayers, setTileLayers] = useState({});
  const [tileLayer, setTileLayer] = useState('');
  const [threeDEnabled, setThreeDEnabled] = useState(false);
  const [cityCenters, setCityCenters] = useState({});
  const [selectedCity, setSelectedCity] = useState('manual');
  const [centerLat, setCenterLat] = useState('40.7128');
  const [centerLng, setCenterLng] = useState('-74.0060');
  const [zoom, setZoom] = useState('11');

  const [layers, setLayers] = useState([
    {
      layerName: 'neighborhood',
      geoJsonFile: null,
      color: 'rgba(87,6,140,0.3)',
    },
  ]);
  const [requiredColumnsMapping, setRequiredColumnsMapping] = useState({});
  const [neighborhoodKeys, setNeighborhoodKeys] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');

  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [delimiter, setDelimiter] = useState(',');
  const [customDelimiter, setCustomDelimiter] = useState('');

  useEffect(() => {
    fetchTileLayers()
      .then((d) => {
        setTileLayers(d);
        const first = Object.keys(d)[0];
        if (first) setTileLayer(d[first].styleUrl);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchCityCenters()
      .then((d) => setCityCenters(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedCity !== 'manual' && cityCenters[selectedCity]) {
      setCenterLat(cityCenters[selectedCity].lat.toString());
      setCenterLng(cityCenters[selectedCity].lng.toString());
    }
  }, [selectedCity, cityCenters]);

  const onDataFileChange = async (file) => {
    setDataFile(file);

    if (!file || !file.name.toLowerCase().endsWith('.csv')) {
      setColumns([]);
      return;
    }

    setIsLoadingFile(true);

    try {
      const cols = await parseCsvFile(file, delimiter, customDelimiter);
      setColumns(cols);
    } catch (error) {
      console.error('Error reading file:', error);
    } finally {
      setIsLoadingFile(false);
    }
  };

  return (
    <ChakraProvider theme={THEME}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size='xl'
        className='config_modal_overlay'
      >
        <ModalOverlay bg='rgba(0,0,0,0.3)' backdropFilter='blur(8px)' />
        <ModalContent className='config_modal_content'>
          <ModalHeader borderBottomWidth='1px'>
            <Heading size='md' className='config_modal_title'>
              Pick or Create a Temporary
            </Heading>
          </ModalHeader>
          <ModalCloseButton className='config_modal_close' />
          <ModalBody>
            <Tabs
              isFitted
              variant='unstyled'
              index={mode === 'select' ? 0 : 1}
              onChange={(val) => setMode(val === 0 ? 'select' : 'create')}
              className='config_modal_tabs'
            >
              <TabList>
                <Tab
                  className={`config_modal_tab-button ${mode === 'select' ? 'selected' : ''}`}
                  onClick={() => setMode('select')}
                >
                  Pick Existing
                </Tab>
                <Tab
                  className={`config_modal_tab-button ${mode === 'create' ? 'selected' : ''}`}
                  onClick={() => setMode('create')}
                >
                  Create Temporary
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ConfigSelector
                    existingConfigs={existingConfigs}
                    selectedConfig={selectedConfig}
                    setSelectedConfig={setSelectedConfig}
                    onSelectConfig={() =>
                      handleSelectExisting(
                        selectedConfig,
                        onConfigSelected,
                        onClose
                      )
                    }
                  />
                </TabPanel>
                <TabPanel>
                  <Box mt={4}>
                    {activeStep === 0 && (
                      <DataFileUpload
                        delimiter={delimiter}
                        setDelimiter={setDelimiter}
                        customDelimiter={customDelimiter}
                        setCustomDelimiter={setCustomDelimiter}
                        onDataFileChange={onDataFileChange}
                        dataFile={dataFile}
                        isLoadingFile={isLoadingFile}
                      />
                    )}
                    {activeStep === 1 && (
                      <VStack spacing={4} align='stretch' mt={6}>
                        <ConfigureRequiredColumns
                          title='Geospatial Data'
                          columns={columns}
                          requiredColumns={[
                            'Pickup Datetime Column',
                            'Dropoff Datetime Column',
                            'Pickup Longitude Column',
                            'Pickup Latitude Column',
                            'Dropoff Longitude Column',
                            'Dropoff Latitude Column',
                          ]}
                          columnMapping={{
                            'Pickup Datetime Column': datetimePickup,
                            'Dropoff Datetime Column': datetimeDropoff,
                            'Pickup Longitude Column': pickupLonCol,
                            'Pickup Latitude Column': pickupLatCol,
                            'Dropoff Longitude Column': dropoffLonCol,
                            'Dropoff Latitude Column': dropoffLatCol,
                          }}
                          setColumnMapping={{
                            'Pickup Datetime Column': setDatetimePickup,
                            'Dropoff Datetime Column': setDatetimeDropoff,
                            'Pickup Longitude Column': setPickupLonCol,
                            'Pickup Latitude Column': setPickupLatCol,
                            'Dropoff Longitude Column': setDropoffLonCol,
                            'Dropoff Latitude Column': setDropoffLatCol,
                          }}
                        />
                      </VStack>
                    )}
                    {activeStep === 2 && (
                      <MapSettings
                        tileLayer={tileLayer}
                        setTileLayer={setTileLayer}
                        tileLayers={tileLayers}
                        threeDEnabled={threeDEnabled}
                        setThreeDEnabled={setThreeDEnabled}
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        cityCenters={cityCenters}
                        centerLat={centerLat}
                        setCenterLat={setCenterLat}
                        centerLng={centerLng}
                        setCenterLng={setCenterLng}
                        zoom={zoom}
                        setZoom={setZoom}
                      />
                    )}
                    {activeStep === 3 && (
                      <VStack spacing={4} align='stretch' mt={6}>
                        <ConfigureRequiredColumns
                          columns={columns}
                          requiredColumns={Object.keys(requiredColumnsMapping)}
                          columnMapping={requiredColumnsMapping}
                          setColumnMapping={setRequiredColumnsMapping}
                        />
                      </VStack>
                    )}
                    {activeStep === 4 && (
                      <GeoJsonLayers
                        neighborhoodKeys={neighborhoodKeys}
                        newKeyword={newKeyword}
                        setNewKeyword={setNewKeyword}
                        handleAddKeyword={() => {
                          const updated = addKeyword(
                            newKeyword,
                            neighborhoodKeys
                          );
                          setNeighborhoodKeys(updated);
                          setNewKeyword('');
                        }}
                        handleRemoveKeyword={(keywordToRemove) => {
                          setNeighborhoodKeys(
                            removeKeyword(keywordToRemove, neighborhoodKeys)
                          );
                        }}
                        layers={layers}
                        updateLayer={(index, field, value) => {
                          setLayers((prevLayers) =>
                            prevLayers.map((layer, i) =>
                              i === index ? { ...layer, [field]: value } : layer
                            )
                          );
                        }}
                        removeLayer={(index) => {
                          setLayers((prev) => removeLayerFromList(prev, index));
                        }}
                        addLayer={() => {
                          setLayers((prev) =>
                            addLayerToList(prev, getRandomColor)
                          );
                        }}
                      />
                    )}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          {mode === 'create' && (
            <ModalFooter>
              <HStack
                w='100%'
                justifyContent='space-between'
                alignItems='center'
              >
                <ConfigButton
                  variant='outline'
                  isDisabled={activeStep === 0}
                  onClick={() => {
                    if (activeStep > 0) setActiveStep((s) => s - 1);
                  }}
                  className='config_modal_secondary-button'
                >
                  Back
                </ConfigButton>

                <StepDots steps={steps} activeIndex={activeStep} />

                {activeStep < steps.length - 1 && (
                  <ConfigButton
                    onClick={() => {
                      if (activeStep < steps.length - 1)
                        setActiveStep((s) => s + 1);
                    }}
                    className='config_modal_primary-button'
                    isDisabled={isLoadingFile}
                  >
                    Next
                  </ConfigButton>
                )}
                {activeStep === steps.length - 1 && (
                  <ConfigButton
                    colorScheme='green'
                    className='config_modal_primary-button'
                    onClick={() =>
                      handleCreateNew(
                        'temporary_config',
                        dataFile,
                        tileLayer,
                        centerLat,
                        centerLng,
                        zoom,
                        pickupLonCol,
                        pickupLatCol,
                        dropoffLonCol,
                        dropoffLatCol,
                        datetimePickup,
                        datetimeDropoff,
                        layers,
                        onConfigSelected,
                        onClose,
                        threeDEnabled,
                        requiredColumnsMapping,
                        neighborhoodKeys
                      )
                    }
                  >
                    Create Config
                  </ConfigButton>
                )}
              </HStack>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
