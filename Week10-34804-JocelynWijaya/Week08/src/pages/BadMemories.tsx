import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCol, IonFab, IonFabButton, IonGrid, IonIcon, IonRow, isPlatform } from "@ionic/react";
import { add } from "ionicons/icons";
import { useEffect, useState } from "react";

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import axios, { AxiosResponse } from "axios";

import { API_KEY, LOCALHOST } from "../App";

const BadMemories: React.FC = () => {
    const [data, setData] = useState<AxiosResponse>();
    const url = LOCALHOST + "select_all_bad_memories.php";

    const [badMemories, setBadMemories] = useState<Array<any>>([]);

    useEffect(() => {
        axios.get(url).then((response) => {
            setData(response);
            console.log(data);
        });
    }, []);

    useEffect(() => {
        console.log(data);
        setBadMemories(data?.data.memories);
    }, [data]);

    useEffect(() => {
        console.log(badMemories);
    }, [badMemories]);

    const loading = <div/>;

    const containerStyle = {
        width: '100%',
        height: '200px'
    };

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>
                        Bad Memories
                    </IonTitle>
                    {!isPlatform('android') && (
                        <IonButtons slot="end">
                            <IonButton href="/tabs/new">
                                <IonIcon icon={add}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    )}
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonGrid>
                    {badMemories.length === 0 && (
                        <IonRow>
                            <IonCol className="ion-text-center">
                                <IonTitle color="primary">No bad memories found.</IonTitle>
                            </IonCol>
                        </IonRow>
                    )}

                    {badMemories && (
                        <LoadScript
                            googleMapsApiKey={API_KEY}
                            loadingElement={loading}>
                            
                            {badMemories && badMemories.map(memory => (
                                <IonRow key={memory.id}>
                                    <IonCol>
                                        <IonCard className="ion-text-center">
                                            <img src={LOCALHOST + memory.photo} alt={memory.title} />

                                            <GoogleMap
                                                mapContainerStyle={containerStyle}
                                                center={{lat: +memory.markerLat, lng: +memory.markerLng}}
                                                zoom={10}
                                            >
                                                <Marker position={{lat: +memory.markerLat, lng: +memory.markerLng}} />
                                            </GoogleMap>
                                            
                                            <IonCardHeader className="ion-text-left">
                                                <IonCardTitle>{memory.title}</IonCardTitle>
                                            </IonCardHeader>
                                        </IonCard>
                                    </IonCol>
                                </IonRow>
                            ))}
                        </LoadScript>
                    )}
                </IonGrid>

                {isPlatform('android') && (
                    <IonFab horizontal="end" vertical="bottom" slot="fixed">
                        <IonFabButton color="primary" href="/tabs/new">
                            <IonIcon icon={add} />
                        </IonFabButton>
                    </IonFab>
                )}
            </IonContent>
        </IonPage>
    );
};

export default BadMemories;