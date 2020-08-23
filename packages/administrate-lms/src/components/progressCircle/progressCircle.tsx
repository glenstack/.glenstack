import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from "../base";
import PropTypes from 'prop-types';

export const ProgressCircle = props => {
    const [offset, setOffset] = useState(0);
    const circleRef = useRef(null);
    const {
        size,
        progress,
        strokeWidth,
        circleOneStroke,
        circleTwoStroke,
    } = props;

    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const progressOffset = ((100 - progress) / 100) * circumference;
        setOffset(progressOffset);

        circleRef.current.style = 'transition: stroke-dashoffset 850ms ease-in-out';

    }, [setOffset, progress, circumference, offset]);

    return (
        <View className="mr-4 mt-1">
            <View>
                <svg
                    className="svg"
                    width={size}
                    height={size}
                >
                    <circle
                        fill="none"
                        className="svg-circle-bg"
                        stroke={circleOneStroke}
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        fill="none"
                        className="svg-circle"
                        ref={circleRef}
                        stroke={circleTwoStroke}
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                    />
                </svg>
            </View>
            <Text className="-mt-8 ml-4">
                {progress}%
            </Text>
        </View>
    );
}

ProgressCircle.propTypes = {
    size: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    circleOneStroke: PropTypes.string.isRequired,
    circleTwoStroke: PropTypes.string.isRequired
}
