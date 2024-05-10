import React from 'react';
import {
    GaugeContainer,
    GaugeValueArc,
    GaugeReferenceArc,
    useGaugeState,
} from '@mui/x-charts/Gauge';
import Typography from "@mui/material/Typography";
import {Grid} from "@mui/material";

function CompassRose({ cx, cy, outerRadius }) {
    const directions = [
        { angle: 0, label: 'N' },
        { angle: 90, label: 'E' },
        { angle: 180, label: 'S' },
        { angle: 270, label: 'W' }
    ];

    return (
        <g>
            {directions.map((direction) => {
                const x = cx + outerRadius * Math.sin((direction.angle * Math.PI) / 180);
                const y = cy - outerRadius * Math.cos((direction.angle * Math.PI) / 180);
                return (
                    <text
                        key={direction.label}
                        x={x}
                        y={y}
                        fill="black"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontWeight: 'bold' }}
                    >
                        {direction.label}
                    </text>
                );
            })}
        </g>
    );
}

function GaugePointer() {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();

    if (valueAngle === null) {
        // No value to display
        return null;
    }

    const target = {
        x: cx + outerRadius * Math.sin(valueAngle),
        y: cy - outerRadius * Math.cos(valueAngle),
    };

    const tail = {
        x: cx - outerRadius * Math.sin(valueAngle),
        y: cy + outerRadius * Math.cos(valueAngle),
    };

    return (
        <g>
            <path
                d={`M ${cx} ${cy} L ${tail.x} ${tail.y}`}
                stroke="blue"
                strokeWidth={3}
            />
            <path
                d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
                stroke="red"
                strokeWidth={3}
            />
            <circle cx={cx} cy={cy} r={3} fill="red"/>
        </g>
    );
}

const Compass = ({declination}) => {
    return (
        <Grid sx={{ width: '220px' }} >
            <Typography variant="h6" align="center" sx={{ backgroundColor: 'background.paper' }} gutterBottom>
                Магнитное склонение {declination}
            </Typography>

            <GaugeContainer
                width={200}
                height={150}
                startAngle={0}
                endAngle={360}
                value={declination}
                sx={{
                    width: '100%',
                    height: '250px',
                    backgroundColor: 'background.paper'
            }}
            >
                <GaugeReferenceArc />
                <GaugeValueArc />
                <GaugePointer />
                <CompassRose cx={100} cy={77} outerRadius={80} />
            </GaugeContainer>
        </Grid>
    );

};

export default Compass;
