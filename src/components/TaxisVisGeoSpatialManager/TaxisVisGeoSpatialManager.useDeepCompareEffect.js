import {useEffect, useRef} from 'react';
import isEqual from 'lodash.isequal';

export default function useDeepCompareEffect(callback, dependencies) {
    const previousDepsRef = useRef();

    if (!isEqual(previousDepsRef.current, dependencies)) {
        previousDepsRef.current = dependencies;
    }

    useEffect(() => {
        callback();
    }, [previousDepsRef.current]);
}
