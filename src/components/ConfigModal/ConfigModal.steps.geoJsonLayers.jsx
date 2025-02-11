import React from "react";
import {
    VStack,
    FormControl,
    FormLabel,
    HStack,
    Tag,
    TagLabel,
    TagCloseButton,
    Input,
    Text,
    Box,
} from "@chakra-ui/react";
import {ConfigButton} from "./ConfigModal.utils.configButton";

export default function GeoJsonLayers({
                                          neighborhoodKeys,
                                          newKeyword,
                                          setNewKeyword,
                                          handleAddKeyword,
                                          handleRemoveKeyword,
                                          layers,
                                          updateLayer,
                                          removeLayer,
                                          addLayer,
                                      }) {
    return (
        <VStack spacing={4} align="stretch" mt={6}>
            <FormControl>
                <FormLabel>Neighborhood Key Words</FormLabel>
                <HStack spacing={2} wrap="wrap">
                    {neighborhoodKeys.map((keyword, index) => (
                        <Tag key={index} size="md" variant="solid" colorScheme="blue">
                            <TagLabel>{keyword}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveKeyword(keyword)}/>
                        </Tag>
                    ))}
                </HStack>
                <HStack mt={2}>
                    <Input
                        placeholder="Type and press Enter"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddKeyword();
                            }
                        }}
                        borderRadius="12px"
                    />
                    <ConfigButton onClick={handleAddKeyword}>Add</ConfigButton>
                </HStack>
                <Text fontSize="sm" color="gray.500">
                    Press Enter to add a keyword.
                </Text>
            </FormControl>

            {layers.map((layer, idx) => (
                <Box
                    key={idx}
                    p={3}
                    border="1px solid #ddd"
                    borderRadius="12px"
                    className="config_modal_layer-item"
                >
                    <FormControl mb={2}>
                        <FormLabel>Layer Name</FormLabel>
                        <Input
                            borderRadius="12px"
                            value={layer.layerName}
                            onChange={(e) => updateLayer(idx, "layerName", e.target.value)}
                            isDisabled={idx === 0}
                        />
                    </FormControl>
                    <ConfigButton as="label" cursor="pointer">
                        Upload GeoJSON
                        <Input
                            type="file"
                            display="none"
                            accept=".geojson"
                            onChange={(e) => {
                                if (e.target.files.length > 0) {
                                    updateLayer(idx, "geoJsonFile", e.target.files[0]);
                                }
                            }}
                        />
                    </ConfigButton>
                    {layer.geoJsonFile && (
                        <Text mt={1} fontSize="sm" color="gray.600">
                            {layer.geoJsonFile.name}
                        </Text>
                    )}
                    <FormControl mt={3}>
                        <FormLabel>Layer Color</FormLabel>
                        <Input borderRadius="12px" value={layer.color} isReadOnly/>
                    </FormControl>
                    {idx !== 0 && (
                        <ConfigButton
                            variant="outline"
                            colorScheme="red"
                            mt={3}
                            onClick={() => removeLayer(idx)}
                        >
                            Remove Layer
                        </ConfigButton>
                    )}
                </Box>
            ))}
            <ConfigButton variant="outline" onClick={addLayer}>
                Add GeoJSON Layer
            </ConfigButton>
        </VStack>
    );
}
