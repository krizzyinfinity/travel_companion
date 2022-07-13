import React, { useEffect, useState} from "react";
import { CssBaseline, Grid} from "@material-ui/core"
import Header from "./components/Header/Header";
import Map from "./components/Map/Map";
import List from "./components/List/List";
import PlaceDetails from "./components/PlaceDetails/PlaceDetails";
import { getPlacesData } from "./api";
import { getWeatherData } from "./api";

export default function App() {
  const [places, setPlaces]=useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds]=useState({});
  const [weatherData, setWeatherData] = useState([]);
  const [childClicked, setChildClicked]=useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) > rating);

    setFilteredPlaces(filtered);
  }, [rating]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoordinates({ lat: latitude, lng: longitude });
    });
  }, []);

  useEffect(()=> {
    if(bounds.sw && bounds.ne) {
    setIsLoading(true);
    getWeatherData(coordinates.lat, coordinates.lng)
    .then((data)=> setWeatherData(data));
    getPlacesData(type, bounds.sw, bounds.ne)
    .then((data)=> {
      console.log(data);
      setPlaces(data?.filter((place)=>place.name && place.num_reviews > 0));
      setIsLoading(false);
      setFilteredPlaces([]);
    })
  }

  }, [type, bounds])
  return (
    <>
    <CssBaseline />
    <Header setCoordinates={setCoordinates} />
    <Grid container spacing={3} style={{width: "100%"}} >

        <Grid item xs={12} md={4}>
            <List places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating} 
            setRating={setRating}/>
        </Grid>
        <Grid item xs={12} md={8}>
            <Map 
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={ filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
            />
        </Grid>
    </Grid>
    
    
    </>
  )
}
