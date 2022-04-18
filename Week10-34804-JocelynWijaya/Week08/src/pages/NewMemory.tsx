import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonRow, IonCol, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon } from "@ionic/react";
import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router";
import { camera } from "ionicons/icons";

import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import axios from "axios";

import { API_KEY, LOCALHOST } from "../App";

const NewMemory: React.FC = () => {
    //G E O L O C A T I O N
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);

    const selectPos = (e: google.maps.MapMouseEvent) => {
        if(e.latLng?.lat()){
          setLat(e.latLng?.lat());
        }
    
        if(e.latLng?.lng()){
          setLng(e.latLng?.lng());
        }

        console.log('Marker updated!');
    };

    const getCurrentPosition = async() => {
        const coordinates = await Geolocation.getCurrentPosition({enableHighAccuracy: true});
    
        console.log('Current positions: ', coordinates);
        console.log('Lat: ', coordinates.coords.latitude);
        console.log('Lng: ', coordinates.coords.longitude);
    
        setLat(coordinates.coords.latitude);
        setLng(coordinates.coords.longitude);
    };

    const containerStyle = {
        width: '100%',
        height: '300px'
    };

    //W E E K  0 8
    const [chosenMemoryType, setChosenMemoryType] = useState<'good' | 'bad'>('good');
    const titleRef = useRef<HTMLIonInputElement>(null);

    const selectMemoryTypeHandler = (event: CustomEvent) => {
        const selectedMemoryType = event.detail.value;
        setChosenMemoryType(selectedMemoryType);
    };

    const history = useHistory();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const url = LOCALHOST + "insert_new_memory.php";

    const [selectedFile, setSelectedFile] = useState<File>();

    const inputFileRef = useRef<HTMLInputElement>(null);

    const takePhotoHandler = () => {
        inputFileRef.current?.click();
    };

    const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target!.files![0]);
    };

    const addMemoryHandler = async() => {
        const formData = new FormData();

        const enteredTitle = titleRef.current?.value;

        if(!enteredTitle || enteredTitle.toString().trim().length === 0 || !selectedFile || !chosenMemoryType){
            setToastMessage("Input is missing");
            setShowToast(true);
            return;
        }

        formData.append('id', Math.random().toString());
        formData.append('title', enteredTitle.toString());
        formData.append('type', chosenMemoryType);
        formData.append('markerLat', lat as unknown as string);
        formData.append('markerLng', lng as unknown as string);
        formData.append('photo', selectedFile as File);

        axios.post(url, formData).then(res => {
            console.log(res);

            if(res.data.success == 1){
                history.length > 0? history.goBack(): history.replace('/');
            }
            else{
                setToastMessage(res.data.message);
                setShowToast(true);
            }
        });
    };

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="good"/>
                    </IonButtons>

                    <IonTitle>
                        Add New Memory
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding" fullscreen>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating">Memory Title</IonLabel>
                            <IonInput type="text" ref={titleRef} />
                        </IonItem>
                    </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol>
                        <IonSelect onIonChange={selectMemoryTypeHandler} value={chosenMemoryType}>
                            <IonSelectOption value="good">Good Memory</IonSelectOption>
                            <IonSelectOption value="bad">Bad Memory</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                </IonRow>

                <IonRow className="ion-text-center ion-margin-top">
                    <IonCol>
                        <input type="file" onChange={fileChangeHandler} accept="image/*" className="inputFileBtn" ref={inputFileRef} />

                        <div className="image-preview">
                            {!selectedFile && <p>No photo selected</p>}
                            {selectedFile && <p>{selectedFile.name} selected</p>}
                        </div>

                        <IonButton fill="clear" onClick={takePhotoHandler}>
                            <IonIcon slot="start" icon={camera} />
                            <IonLabel>Take Photo</IonLabel>
                        </IonButton>
                    </IonCol>
                </IonRow>

                <IonRow className="ion-margin-top">
                    <IonCol className="ion-text-center">
                        <LoadScript googleMapsApiKey={API_KEY}>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={{lat: lat, lng: lng}}
                                zoom={10}
                                onClick={selectPos}
                                onLoad={getCurrentPosition}
                            >
                                <Marker position={{lat: lat, lng: lng}} />
                            </GoogleMap>
                        </LoadScript>
                    </IonCol>
                </IonRow>

                <IonRow className="ion-margin-top">
                    <IonCol className="ion-text-center">
                        <IonButton onClick={addMemoryHandler}>Add Memory</IonButton>
                    </IonCol>
                </IonRow>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => {setShowToast(false); setToastMessage('');}}
                    message={toastMessage}
                    duration={300}
                />
            </IonContent>
        </IonPage>
    );
};

export default NewMemory;