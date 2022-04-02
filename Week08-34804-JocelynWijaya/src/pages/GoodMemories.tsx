import { IonPage, IonHeader, IonToolbar, IonTitle, isPlatform, IonButtons, IonButton, IonIcon, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonFab, IonFabButton } from "@ionic/react";
import { add } from "ionicons/icons";
import { useContext } from "react";

import MemoriesContext from "../data/memories-context";

const GoodMemories: React.FC = () => {
    const memoriesCtx = useContext(MemoriesContext);
    const goodMemories = memoriesCtx.memories.filter(memory => memory.type === 'good');

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>
                        Good Memories
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
                    {goodMemories.length === 0 && (
                        <IonRow>
                            <IonCol className="ion-text-center">
                                <IonTitle color="primary">No good memories found.</IonTitle>
                            </IonCol>
                        </IonRow>
                    )}

                    {goodMemories.map(memory => (
                        <IonRow key={memory.id}>
                            <IonCol>
                                <IonCard>
                                    <img src={memory.base64Url} alt={memory.title} />

                                    <IonCardHeader>
                                        <IonCardTitle>{memory.title}</IonCardTitle>
                                    </IonCardHeader>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    ))}
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

export default GoodMemories;