import React, {useState} from 'react';
import Typography from "@mui/material/Typography";
import {CircularProgress, Grid, List, ListItem, ListItemText} from "@mui/material";
import {Map, Placemark, YMaps} from "@pbe/react-yandex-maps";
import Plot from "react-plotly.js";
import Plotly from 'plotly.js-dist';
import Compass from "./Compass";
import Button from "@mui/material/Button";

const ThreeDPlot = () => {
    const [plotData, setPlotData] = useState([]);
    const [geoData, setGeoData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [declination, setDeclination] = useState(null);

    const handleMapClick = async (e) => {
        setSelectedCoordinates(e.get('coords'));
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/calc_anomaly', {
                method: "POST",
                body: JSON.stringify({"lat": selectedCoordinates[0], "lon": selectedCoordinates[1]})
            });
            const response2 = await fetch('http://localhost:8080/get_data', {
                method: "POST",
                body: JSON.stringify({"lat": selectedCoordinates[0], "lon": selectedCoordinates[1]})
            });
            const response3 = await fetch('http://localhost:8080/calc_declination', {
                method: "POST",
                body: JSON.stringify({"lat": selectedCoordinates[0], "lon": selectedCoordinates[1]})
            });
            if (response.ok && response2.ok && response3.ok) {
                const data = await response.json();
                const data2 = await response2.json();
                const data3 = await response3.json();

                setPlotData(data);
                setGeoData(data2);
                setDeclination(data3.declination);
            } else {
                console.log(response);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Устанавливаем состояние загрузки в false после завершения запроса
        }
    };

    const layout = {
        title: 'График анмалии высоты',
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 30
        },
        showlegend: true,
        legend: {"orientation": "h"},
        scene: {
            xaxis: {title: 'Широта'},
            yaxis: {title: 'Долгота'},
            zaxis: {title: 'Аномалия высоты'},

        }
    };

    const exportPlotImage = () => {
        const plotElement = document.querySelector('.js-plotly-plot');

        if (!plotElement) {
            console.error('Element not found');
            return;
        }

        Plotly.toImage(plotElement, {format: 'png', width: 700, height: 450})
            .then((dataURL) => {
                const link = document.createElement('a');
                link.href = dataURL;
                link.download = 'plot.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.error('Ошибка при экспорте изображения:', error);
            });
    };


    return (
        <div>
            <div className="container" style={{ marginTop: "68px"}}>
                <div className="overlay"></div>
                <div style={{ marginTop: "1%"}}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <YMaps>
                                <Map
                                    defaultState={{center: [55.75, 37.57], zoom: 9}}
                                    onClick={handleMapClick}
                                    width="700px"
                                    height="450px"
                                >
                                    {selectedCoordinates && <Placemark geometry={selectedCoordinates}/>}
                                </Map>
                            </YMaps>
                        </Grid>
                        <Grid item xs={6}>
                            {loading && selectedCoordinates ? (
                                <div style={{
                                    width: "700px",
                                    height: "450px",
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <CircularProgress/>
                                </div>
                            ) : (
                                selectedCoordinates == null ? (<p></p>) : (
                                    <div id="plotly-div-id">
                                        <Plot
                                            data={plotData}
                                            layout={layout}
                                        />
                                        <Button variant="outlined" onClick={exportPlotImage} >Export</Button>
                                    </div>
                                )
                            )}
                        </Grid>
                    </Grid>
                </div>
                <br/>
                <Grid container spacing={2}
                      justifyContent="flex-end"
                      alignItems="center"
                >
                    <Grid item xs={6} sm={10} md={2}>
                        <Compass declination={declination}/>
                    </Grid>
                    <Grid item xs={6}>
                        <List sx={{width: "100%", maxWidth: "255px", bgcolor: 'background.paper'}}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary="Координаты"
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{display: 'inline'}}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {geoData["lat"]}
                                            </Typography>
                                            <br/>
                                            <Typography
                                                sx={{display: 'inline'}}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {geoData["lon"]}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary="Аномалия"
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{display: 'inline'}}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {
                                                    geoData["anomaly"] ?
                                                        `${geoData["anomaly"]} м`
                                                        : ""
                                                }
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary="Тангаж"
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{display: 'inline'}}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {
                                                    geoData["tangage"] ?
                                                        `${geoData["tangage"]}°`
                                                        : ""
                                                }
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary="Склонение"
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{display: 'inline'}}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {
                                                    declination ?
                                                        `${declination}°`
                                                        : ""
                                                }
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default ThreeDPlot;
