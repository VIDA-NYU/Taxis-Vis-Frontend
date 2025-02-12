import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  DateRange,
  ExpandLess,
  ExpandMore,
  Hail,
  Moving,
  RemoveRoad,
  Tour,
} from '@mui/icons-material';
import { DateRangePicker } from '@adobe/react-spectrum';
import './ToolbarPanel.styles.css';
import ToolbarPanelUtilsButton from './ToolbarPanel.utils.button';
import ToolbarPanelUtilsSlider from './ToolbarPanel.utils.slider';
import useMapBoxDrawHandler from './ToolbarPanel.hooks.useMapBoxDrawHandler';
import { fetchDateRange } from './ToolbarPanel.services';
import { useDuckDb } from 'duckdb-wasm-kit';
import { parseDate } from '@internationalized/date';
import { useAppConfig } from '../../providers/DuckDB/DuckDBProvider';

const ToolbarPanel = ({
  features,
  onCreate,
  onUpdate,
  onDelete,
  onDateRangeChange,
  bufferDistance,
  setBufferDistance,
  map,
  draw,
}) => {
  const { db, loading } = useDuckDb();
  const [activeButton, setActiveButton] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [initialDateRange, setInitialDateRange] = useState({});
  const [localDateRange, setLocalDateRange] = useState({});
  const config = useAppConfig();

  const isSliderVisible = activeButton === 'directional';
  const isDatePickerVisible = activeButton === 'calendar';

  const hasPickupAndDropoff =
    features &&
    features.pickup &&
    features.pickup.length > 0 &&
    features.dropoff &&
    features.dropoff.length > 0;
  const hasAnyFeature =
    features &&
    ((features.pickup && features.pickup.length > 0) ||
      (features.dropoff && features.dropoff.length > 0) ||
      (features.directional && features.directional.length > 0));

  const handleButtonClick = (buttonType, action) => {
    setActiveButton((prev) => {
      const nextState = prev === buttonType ? null : buttonType;
      if (action) action(nextState);
      return nextState;
    });
  };

  const activateDrawing = (mode) => {
    if (!draw) return;
    if (mode === 'pickup') {
      draw.changeMode('pickup_mode');
    } else if (mode === 'dropoff') {
      draw.changeMode('dropoff_mode');
    } else if (mode === 'directional') {
      draw.changeMode('directional_mode');
    }
  };

  const handleDelete = () => {
    if (hasAnyFeature) {
      if (!draw) return;

      setActiveButton((prev) => (prev === 'delete' ? null : 'delete'));
      let selectedIds = draw.getSelectedIds();

      if (selectedIds.length === 0) {
        const allFeatures = draw.getAll().features;
        if (allFeatures.length > 0) {
          selectedIds = [allFeatures[0].id];
          draw.changeMode('simple_select', { featureIds: selectedIds });
        }
      }
      draw.trash();
      setActiveButton(null);
      draw.changeMode('simple_select');
    }
  };

  useEffect(() => {
    if (!db || loading) return;

    (async () => {
      try {
        const dateRange = await fetchDateRange(db, config);

        setInitialDateRange({
          start: dateRange.start
            ? parseDate(dateRange.start.split('T')[0])
            : null,
          end: dateRange.end ? parseDate(dateRange.end.split('T')[0]) : null,
        });

        setLocalDateRange({
          start: dateRange.start
            ? parseDate(dateRange.start.split('T')[0])
            : null,
          end: dateRange.end ? parseDate(dateRange.end.split('T')[0]) : null,
        });
      } catch (error) {
        console.error('Failed to fetch date range from DuckDB:', error);
      }
    })();
  }, [db, loading]);

  useMapBoxDrawHandler({
    draw,
    map,
    onCreate,
    onUpdate,
    onDelete,
    activeButton,
    setActiveButton,
  });

  return (
    <>
      <div
        className={`toolbar_panel-container ${isMinimized ? 'minimized' : ''}`}
      >
        <div className='toolbar_panel-minimize-btn-container'>
          <ToolbarPanelUtilsButton
            icon={isMinimized ? <ExpandMore /> : <ExpandLess />}
            title={isMinimized ? 'Expand Toolbar' : 'Minimize Toolbar'}
            onClick={() => setIsMinimized(!isMinimized)}
            isDisabled={!!activeButton}
            ariaLabel={isMinimized ? 'Expand Toolbar' : 'Minimize Toolbar'}
          />
        </div>

        {!isMinimized && (
          <>
            <ToolbarPanelUtilsButton
              icon={<Hail />}
              title='Draw A Pickup ROI'
              onClick={() =>
                handleButtonClick('pickup', (nextState) => {
                  if (nextState) activateDrawing('pickup');
                })
              }
              isActive={activeButton === 'pickup'}
              isDisabled={features.pickup && features.pickup.length > 0}
              extraClasses='pickup'
              ariaLabel='Draw A Pickup ROI'
            />

            <ToolbarPanelUtilsButton
              icon={<Tour />}
              title='Draw A Dropoff ROI'
              onClick={() =>
                handleButtonClick('dropoff', (nextState) => {
                  if (nextState) activateDrawing('dropoff');
                })
              }
              isActive={activeButton === 'dropoff'}
              isDisabled={features.dropoff && features.dropoff.length > 0}
              extraClasses='dropoff'
              ariaLabel='Draw A Dropoff ROI'
            />

            <ToolbarPanelUtilsButton
              icon={<Moving />}
              title='Draw A Directional Line'
              onClick={() =>
                handleButtonClick('directional', (nextState) => {
                  if (nextState) activateDrawing('directional');
                })
              }
              isActive={activeButton === 'directional'}
              isDisabled={
                !hasPickupAndDropoff ||
                (features.directional && features.directional.length > 0)
              }
              extraClasses='directional'
              ariaLabel='Draw A Directional Line'
            />

            <ToolbarPanelUtilsButton
              icon={<RemoveRoad />}
              title='Delete Existing ROI'
              onClick={handleDelete}
              isActive={activeButton === 'delete'}
              isDisabled={!hasAnyFeature}
              extraClasses='action'
              ariaLabel='Delete Existing ROI'
            />

            <ToolbarPanelUtilsButton
              icon={<DateRange />}
              title='Select Date Range'
              onClick={() => {
                const nextState = !isDatePickerVisible;
                setActiveButton((prev) =>
                  prev === 'calendar' ? null : 'calendar'
                );
                if (!nextState && onDateRangeChange) {
                  onDateRangeChange(localDateRange);
                }
              }}
              isActive={activeButton === 'calendar'}
              extraClasses='action'
              ariaLabel='Select Date Range'
            />
          </>
        )}
      </div>

      {isDatePickerVisible && (
        <div className='toolbar_panel-date-picker'>
          <DateRangePicker
            label='From - To'
            value={localDateRange}
            onChange={setLocalDateRange}
            maxVisibleMonths={2}
            granularity='day'
            labelPosition='side'
            minValue={initialDateRange.start}
            maxValue={initialDateRange.end}
          />
        </div>
      )}

      {isSliderVisible && (
        <ToolbarPanelUtilsSlider
          bufferDistance={bufferDistance}
          onBufferDistanceChange={setBufferDistance}
          label='Buffer Distance'
          minValue={100}
          maxValue={2000}
          step={100}
        />
      )}
    </>
  );
};

ToolbarPanel.propTypes = {
  mapApiUrl: PropTypes.string,
  features: PropTypes.shape({
    pickup: PropTypes.array.isRequired,
    dropoff: PropTypes.array.isRequired,
    directional: PropTypes.array.isRequired,
  }).isRequired,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  onDateRangeChange: PropTypes.func,
  bufferDistance: PropTypes.number.isRequired,
  setBufferDistance: PropTypes.func.isRequired,
  defaultDrawingColorPickup: PropTypes.string,
  defaultDrawingColorDropoff: PropTypes.string,
  defaultDrawingColorDirectional: PropTypes.string,
  map: PropTypes.object,
  draw: PropTypes.object,
};

export default ToolbarPanel;
